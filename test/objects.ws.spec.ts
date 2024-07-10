import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseTestModule } from './test-utils';
import { Model } from 'mongoose';
import { Shape } from '../src/shapes/shape.schema';
import { getModelToken } from '@nestjs/mongoose';
import { WsAdapter } from '@nestjs/platform-ws';
import { WebSocket } from 'ws';
import { ObjectsModule } from '../src/objects/objects.module';
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
  canvasId: '123',
};

describe('Objects-ws', () => {
  let app: INestApplication;
  let shapeModel: Model<Shape>;
  let canvasModel: Model<Canvas>;
  let webSocket: WebSocket;
  let canvas: Canvas;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ObjectsModule, await mongooseTestModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();

    shapeModel = moduleFixture.get<Model<Shape>>(getModelToken(Shape.name));

    canvasModel = moduleFixture.get<Model<Canvas>>(getModelToken(Canvas.name));

    canvas = await canvasModel.create({
      name: 'Some Canvas',
      maxZIndex: 12,
      minZIndex: 10,
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

    shapeModel.create({ ...mockData, canvas }).then(() => {
      webSocket.send(
        JSON.stringify({
          event: 'objects/get',
          data: canvas.id,
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

    shapeModel.create({ ...mockData, canvas }).then((savedShapes) => {
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
      ).toEqual([{ name: 'third', zIndex: 9 }]);
      expect(JSON.parse(data.toString()).event).toEqual(
        'objects/:id/z-index/patch',
      );
      done();
    });

    shapeModel
      .create({ ...mockData, canvas, name: 'first', zIndex: 10 })
      .then((shape1) => {
        shapeModel
          .create({ ...mockData, canvas, name: 'second', zIndex: 11 })
          .then(() => {
            shapeModel
              .create({ ...mockData, canvas, name: 'third', zIndex: 12 })
              .then((shape3) => {
                const id1 = shape1._id;
                const id3 = shape3._id;
                webSocket.send(
                  JSON.stringify({
                    event: 'objects/:id/z-index/patch',
                    data: {
                      id: id3,
                      belowObject: id1,
                      type: 'RECTANGLE',
                    },
                  }),
                );
              });
          });
      });
  });

  it('objects/:id/z-index/patch - in between two object', (done) => {
    webSocket.on('message', async (data) => {
      expect(
        JSON.parse(data.toString()).data.map(({ name, zIndex }) => ({
          name,
          zIndex,
        })),
      ).toEqual([
        { name: 'third', zIndex: 10 },
        { name: 'first', zIndex: 9 },
      ]);
      expect(JSON.parse(data.toString()).event).toEqual(
        'objects/:id/z-index/patch',
      );
      done();
    });

    shapeModel
      .create({ ...mockData, canvas, name: 'first', zIndex: 10 })
      .then(() => {
        shapeModel
          .create({ ...mockData, canvas, name: 'second', zIndex: 11 })
          .then((shape2) => {
            shapeModel
              .create({ ...mockData, canvas, name: 'third', zIndex: 12 })
              .then((shape3) => {
                const id2 = shape2._id;
                const id3 = shape3._id;
                webSocket.send(
                  JSON.stringify({
                    event: 'objects/:id/z-index/patch',
                    data: {
                      id: id3,
                      belowObject: id2,
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
      .create({ ...mockData, canvas, name: 'first', zIndex: 10 })
      .then((shape1) => {
        shapeModel
          .create({ ...mockData, canvas, name: 'second', zIndex: 11 })
          .then(() => {
            shapeModel
              .create({ ...mockData, canvas, name: 'third', zIndex: 12 })
              .then(() => {
                const id1 = shape1._id;
                webSocket.send(
                  JSON.stringify({
                    event: 'objects/:id/z-index/patch',
                    data: {
                      id: id1,
                      onTop: true,
                      type: 'RECTANGLE',
                      canvasId: canvas.id,
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
        { name: 'third', zIndex: 9 },
      ]);
      expect(JSON.parse(data.toString()).event).toEqual(
        'objects/:id/z-index/patch',
      );
      done();
    });

    shapeModel
      .create({ ...mockData, canvas, name: 'first', zIndex: 10 })
      .then(() => {
        shapeModel
          .create({ ...mockData, canvas, name: 'second', zIndex: 11 })
          .then(() => {
            shapeModel
              .create({ ...mockData, canvas, name: 'third', zIndex: 12 })
              .then((shape) => {
                const id = shape._id;
                webSocket.send(
                  JSON.stringify({
                    event: 'objects/:id/z-index/patch',
                    data: {
                      id: id,
                      onBottom: true,
                      type: 'RECTANGLE',
                      canvasId: canvas.id,
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
