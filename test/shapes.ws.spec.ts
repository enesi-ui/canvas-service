import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseTestModule } from './test-utils';
import { ShapesModule } from '../src/shapes/shapes.module';
import { Model } from 'mongoose';
import { Shape } from '../src/shapes/shape.schema';
import { getModelToken } from '@nestjs/mongoose';
import { WsAdapter } from '@nestjs/platform-ws';
import { WebSocket } from 'ws';
import { EventsModule } from '../src/events/events.module';
import { MainComponent } from '../src/main-components/main-component.schema';
import { MainComponentsModule } from '../src/main-components/main-components.module';

const mongooseTestModule = new MongooseTestModule();

describe('Shapes-ws', () => {
  let app: INestApplication;
  let shapeModel: Model<Shape>;
  let webSocket: WebSocket;
  let mainComponentModel: Model<MainComponent>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        EventsModule,
        ShapesModule,
        MainComponentsModule,
        await mongooseTestModule.forRoot(),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();

    shapeModel = moduleFixture.get<Model<Shape>>(getModelToken(Shape.name));
    mainComponentModel = moduleFixture.get<Model<MainComponent>>(
      getModelToken(MainComponent.name),
    );

    webSocket = new WebSocket('http://localhost:8080');

    await new Promise((resolve, reject) => {
      webSocket.on('error', (err) => {
        reject(err);
      });
      webSocket.on('open', () => {
        resolve(0);
      });
    });
  });

  it('/ (POST)', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: expect.objectContaining({
          fill: '#000000',
          type: 'CIRCLE',
          fillAlpha: 1,
        }),
        event: 'shapes/post',
      });
      const savedShapes = await shapeModel.find().exec();

      expect(savedShapes.length).toEqual(1);
      expect(savedShapes[0]).toEqual(
        expect.objectContaining({
          fill: '#000000',
          type: 'CIRCLE',
          fillAlpha: 1,
        }),
      );
      done();
    });
    webSocket.send(
      JSON.stringify({
        event: 'shapes/post',
        data: {
          fill: '#000000',
          type: 'CIRCLE',
          fillAlpha: 1,
        },
      }),
    );
  });

  it('/ (GET)', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: [
          expect.objectContaining({
            fill: '#000000',
            type: 'CIRCLE',
            fillAlpha: 1,
          }),
        ],
        event: 'shapes/get',
      });
      done();
    });

    shapeModel
      .create({
        fill: '#000000',
        type: 'CIRCLE',
        fillAlpha: 1,
      })
      .then(() => {
        webSocket.send(
          JSON.stringify({
            event: 'shapes/get',
          }),
        );
      });
  });

  it('/ (GET) :id', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: expect.objectContaining({
          fill: '#000000',
          type: 'CIRCLE',
          fillAlpha: 1,
        }),
        event: 'shapes/get/:id',
      });
      done();
    });

    shapeModel
      .create({
        fill: '#000000',
        type: 'CIRCLE',
        fillAlpha: 1,
      })
      .then((savedShapes) => {
        const id = savedShapes._id;

        webSocket.send(
          JSON.stringify({
            event: 'shapes/get/:id',
            data: id,
          }),
        );
      });
  });

  it.only('/ (GET) :id/main-component', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: null,
        event: 'shapes/get/:id/main-component',
      });
      done();
    });

    shapeModel
      .create({
        fill: '#000000',
        type: 'CIRCLE',
        fillAlpha: 1,
      })
      .then((savedShapes) => {
        mainComponentModel.create({
          shapeId: savedShapes._id,
          name: 'test-component',
        });
        return savedShapes._id;
      })
      .then((id) => {
        webSocket.send(
          JSON.stringify({
            event: 'shapes/get/:id/main-component',
            data: id,
          }),
        );
      });
  });

  afterEach(async () => {
    webSocket.close();
    await mongooseTestModule.stop();
    await app.close();
  });
});
