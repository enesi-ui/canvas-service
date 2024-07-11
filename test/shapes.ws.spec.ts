import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseTestModule } from './test-utils';
import { ShapesModule } from '../src/shapes/shapes.module';
import { Model } from 'mongoose';
import { Shape } from '../src/shapes/shape.schema';
import { getModelToken } from '@nestjs/mongoose';
import { WsAdapter } from '@nestjs/platform-ws';
import { WebSocket } from 'ws';
import { MainComponent } from '../src/main-components/main-component.schema';
import { Canvas } from '../src/canvas/canvas.schema';

const mongooseTestModule = new MongooseTestModule();

const mockData = {
  type: 'RECTANGLE',
  fills: [],
  strokes: [],
  container: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  graphics: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  zIndex: 0,
  name: 'Some Shape',
  radius: 0,
};

describe('Shapes-ws', () => {
  let app: INestApplication;
  let shapeModel: Model<Shape>;
  let webSocket: WebSocket;
  let secondWebSocket: WebSocket;
  let mainComponentModel: Model<MainComponent>;
  let canvasModel: Model<Canvas>;
  let canvas: Canvas;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ShapesModule, await mongooseTestModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();

    shapeModel = moduleFixture.get<Model<Shape>>(getModelToken(Shape.name));
    mainComponentModel = moduleFixture.get<Model<MainComponent>>(
      getModelToken(MainComponent.name),
    );
    canvasModel = moduleFixture.get<Model<Canvas>>(getModelToken(Canvas.name));

    canvas = await canvasModel.create({
      name: 'canvasName',
      maxZIndex: 0,
      minZIndex: 0,
    });

    webSocket = new WebSocket('http://localhost:8082');

    await new Promise((resolve, reject) => {
      webSocket.on('error', (err) => {
        reject(err);
      });
      webSocket.on('open', () => {
        resolve(0);
      });
    });

    secondWebSocket = new WebSocket('http://localhost:8082');

    await new Promise((resolve, reject) => {
      secondWebSocket.on('error', (err) => {
        reject(err);
      });
      secondWebSocket.on('open', () => {
        resolve(0);
      });
    });
  });

  it('shapes/post', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: expect.objectContaining({
          type: 'RECTANGLE',
        }),
        event: 'shapes/:id/post',
      });
      const savedShapes = await shapeModel.find().exec();

      expect(savedShapes.length).toEqual(1);
      expect(savedShapes[0]).toEqual(
        expect.objectContaining({
          type: 'RECTANGLE',
        }),
      );

      done();
    });
    webSocket.send(
      JSON.stringify({
        event: 'shapes/post',
        data: { ...mockData, canvas: canvas.id.toString() },
      }),
    );
  });

  it('shapes/post - throws for validation errors', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: expect.objectContaining({
          error: 'Bad Request',
          statusCode: 400,
        }),
        event: 'error',
      });
      const savedShapes = await shapeModel.find().exec();

      expect(savedShapes.length).toEqual(0);
      done();
    });
    webSocket.send(
      JSON.stringify({
        event: 'shapes/post',
        data: {
          fill: '#000000',
        },
      }),
    );
  });

  it('shapes/get', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: [
          expect.objectContaining({
            type: 'RECTANGLE',
          }),
        ],
        event: 'shapes/get',
      });
      done();
    });

    shapeModel.create({ ...mockData, canvas }).then(() => {
      webSocket.send(
        JSON.stringify({
          event: 'shapes/get',
          data: canvas.id,
        }),
      );
    });
  });

  it('shapes/get multiple canvases', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: [
          expect.objectContaining({
            type: 'RECTANGLE',
          }),
        ],
        event: 'shapes/get',
      });
      done();
    });

    shapeModel.create({ ...mockData, canvas }).then(() => {
      canvasModel
        .create({ name: 'canvasName2', maxZIndex: 0, minZIndex: 0 })
        .then((newCanvas) => {
          shapeModel
            .create({ ...mockData, type: 'ELLIPSE', canvas: newCanvas })
            .then(() => {
              webSocket.send(
                JSON.stringify({
                  event: 'shapes/get',
                  data: canvas.id,
                }),
              );
            });
        });
    });
  });

  it('shapes/:id/get', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: expect.objectContaining({
          type: 'RECTANGLE',
        }),
        event: 'shapes/:id/get',
      });
      done();
    });

    shapeModel.create({ ...mockData, canvas }).then((savedShapes) => {
      const id = savedShapes._id;

      webSocket.send(
        JSON.stringify({
          event: 'shapes/:id/get',
          data: id,
        }),
      );
    });
  });

  it('shapes/:id/main-component/get', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: expect.objectContaining({
          type: 'main',
          name: 'test-component',
          shape: expect.any(String),
        }),
        event: 'shapes/:id/main-component/get',
      });
      done();
    });

    shapeModel
      .create({ ...mockData, canvas })
      .then((savedShapes) => {
        mainComponentModel.create({
          shape: savedShapes,
          name: 'test-component',
        });
        return savedShapes._id;
      })
      .then((id) => {
        webSocket.send(
          JSON.stringify({
            event: 'shapes/:id/main-component/get',
            data: id,
          }),
        );
      });
  });

  it('shapes/:id/patch', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: expect.objectContaining({
          type: 'RECTANGLE',
          fills: [
            {
              color: '#a92f2f',
              alpha: 1,
            },
          ],
        }),
        event: 'shapes/:id/patch',
      });
      done();
    });

    shapeModel.create({ ...mockData, canvas }).then((savedShapes) => {
      const id = savedShapes._id;

      webSocket.send(
        JSON.stringify({
          event: 'shapes/:id/patch',
          data: {
            id,
            fills: [
              {
                color: '#a92f2f',
                alpha: 1,
              },
            ],
            type: 'RECTANGLE',
          },
        }),
      );
    });
  });

  it('shapes/:id/patch - broadcasts message to all connected clients', (done) => {
    secondWebSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: expect.objectContaining({
          fills: [{ color: '#a92f2f', alpha: 1 }],
          type: 'RECTANGLE',
        }),
        event: 'shapes/:id/patch',
      });
      done();
    });

    shapeModel.create({ ...mockData, canvas }).then((savedShapes) => {
      const id = savedShapes._id;

      webSocket.send(
        JSON.stringify({
          event: 'shapes/:id/patch',
          data: {
            id,
            fills: [{ color: '#a92f2f', alpha: 1 }],
            type: 'RECTANGLE',
          },
        }),
      );
    });
  });

  afterEach(async () => {
    webSocket.close();
    secondWebSocket.close();
    await mongooseTestModule.stop();
    await app.close();
  });
});
