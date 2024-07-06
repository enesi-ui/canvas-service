import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseTestModule } from './test-utils';
import { Model } from 'mongoose';
import { Shape } from '../src/shapes/shape.schema';
import { getModelToken } from '@nestjs/mongoose';
import { WsAdapter } from '@nestjs/platform-ws';
import { WebSocket } from 'ws';
import { ObjectsModule } from '../src/objects/objects.module';

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
  canvasId: '123',
};

describe('Objects-ws', () => {
  let app: INestApplication;
  let shapeModel: Model<Shape>;
  let webSocket: WebSocket;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ObjectsModule, await mongooseTestModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();

    shapeModel = moduleFixture.get<Model<Shape>>(getModelToken(Shape.name));

    webSocket = new WebSocket('http://localhost:8082');

    await new Promise((resolve, reject) => {
      webSocket.on('error', (err) => {
        reject(err);
      });
      webSocket.on('open', () => {
        resolve(0);
      });
    });
  });

  it('objects/get', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: [
          expect.objectContaining({
            type: 'RECTANGLE',
          }),
        ],
        event: 'objects/get',
      });
      done();
    });

    shapeModel.create(mockData).then(() => {
      webSocket.send(
        JSON.stringify({
          event: 'objects/get',
        }),
      );
    });
  });

  it('objects/:id/get', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: expect.objectContaining({
          type: 'RECTANGLE',
        }),
        event: 'objects/:id/get',
      });
      done();
    });

    shapeModel.create(mockData).then((savedShapes) => {
      const id = savedShapes._id;

      webSocket.send(
        JSON.stringify({
          event: 'objects/:id/get',
          data: id,
        }),
      );
    });
  });

  it('objects/:id/z-index/patch', (done) => {
    webSocket.on('message', async (data) => {
      expect(
        JSON.parse(data.toString()).data.map(({ name, zIndex }) => ({
          name,
          zIndex,
        })),
      ).toEqual([
        { name: 'third', zIndex: 11 },
        { name: 'second', zIndex: 12 },
      ]);
      expect(JSON.parse(data.toString()).event).toEqual(
        'objects/:id/z-index/patch',
      );
      done();
    });

    shapeModel
      .create({ ...mockData, name: 'first', zIndex: 10 })
      .then((shape1) => {
        shapeModel
          .create({ ...mockData, name: 'second', zIndex: 11 })
          .then(() => {
            shapeModel
              .create({ ...mockData, name: 'third', zIndex: 12 })
              .then((shape3) => {
                const id1 = shape1._id;
                const id3 = shape3._id;
                webSocket.send(
                  JSON.stringify({
                    event: 'objects/:id/z-index/patch',
                    data: {
                      id: id3,
                      aboveObjectId: id1,
                      type: 'RECTANGLE',
                    },
                  }),
                );
              });
          });
      });
  });

  it('objects/:id/z-index/patch onTop', (done) => {
    webSocket.on('message', async (data) => {
      expect(
        JSON.parse(data.toString()).data.map(({ name, zIndex }) => ({
          name,
          zIndex,
        })),
      ).toEqual([{ name: 'first', zIndex: 13 }]);
      expect(JSON.parse(data.toString()).event).toEqual(
        'objects/:id/z-index/patch',
      );
      done();
    });

    shapeModel
      .create({ ...mockData, name: 'first', zIndex: 10 })
      .then((shape1) => {
        shapeModel
          .create({ ...mockData, name: 'second', zIndex: 11 })
          .then(() => {
            shapeModel
              .create({ ...mockData, name: 'third', zIndex: 12 })
              .then(() => {
                const id1 = shape1._id;
                webSocket.send(
                  JSON.stringify({
                    event: 'objects/:id/z-index/patch',
                    data: {
                      id: id1,
                      onTop: true,
                      type: 'RECTANGLE',
                    },
                  }),
                );
              });
          });
      });
  });

  it('objects/:id/z-index/patch onBottom', (done) => {
    webSocket.on('message', async (data) => {
      expect(
        JSON.parse(data.toString()).data.map(({ name, zIndex }) => ({
          name,
          zIndex,
        })),
      ).toEqual([
        { name: 'third', zIndex: 10 },
        { name: 'first', zIndex: 11 },
        { name: 'second', zIndex: 12 },
      ]);
      expect(JSON.parse(data.toString()).event).toEqual(
        'objects/:id/z-index/patch',
      );
      done();
    });

    shapeModel.create({ ...mockData, name: 'first', zIndex: 10 }).then(() => {
      shapeModel
        .create({ ...mockData, name: 'second', zIndex: 11 })
        .then(() => {
          shapeModel
            .create({ ...mockData, name: 'third', zIndex: 12 })
            .then((shape) => {
              const id = shape._id;
              webSocket.send(
                JSON.stringify({
                  event: 'objects/:id/z-index/patch',
                  data: {
                    id: id,
                    onBottom: true,
                    type: 'RECTANGLE',
                  },
                }),
              );
            });
        });
    });
  });

  afterEach(async () => {
    webSocket.close();
    await mongooseTestModule.stop();
    await app.close();
  });
});
