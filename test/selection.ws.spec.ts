import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseTestModule } from './test-utils';
import { ShapesModule } from '../src/shapes/shapes.module';
import { Model } from 'mongoose';
import { Shape } from '../src/shapes/shape.schema';
import { Selection } from '../src/selection/selection.schema';
import { getModelToken } from '@nestjs/mongoose';
import { WsAdapter } from '@nestjs/platform-ws';
import { WebSocket } from 'ws';
import { SelectionModule } from '../src/selection/selection.module';

const mongooseTestModule = new MongooseTestModule();

const shapeMockData = {
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

describe('Selection-ws', () => {
  let app: INestApplication;
  let shapeModel: Model<Shape>;
  let selectionModel: Model<Selection>;
  let webSocket: WebSocket;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        await mongooseTestModule.forRoot(),
        SelectionModule,
        ShapesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();

    shapeModel = moduleFixture.get<Model<Shape>>(getModelToken(Shape.name));
    selectionModel = moduleFixture.get<Model<Selection>>(
      getModelToken(Selection.name),
    );

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

  it('selection/get', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: {
          canvasId: 'some-unique-id',
          shapeIds: [expect.any(String)],
        },
        event: 'selection/:canvasId/get',
      });
      done();
    });

    shapeModel.create(shapeMockData).then((shape) => {
      selectionModel.create({ shape, canvasId: 'some-unique-id' }).then(() => {
        webSocket.send(
          JSON.stringify({
            event: 'selection/:canvasId/get',
            data: 'some-unique-id',
          }),
        );
      });
    });
  });

  it('selection/put - creates new entry for shapes to be selected', (done) => {
    let shapeId: string;
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: {
          canvasId: 'some-unique',
          shapeIds: [shapeId],
        },
        event: 'selection/:canvasId/put',
      });
      done();
    });

    shapeModel.create(shapeMockData).then((shape) => {
      shapeId = shape.id;
      webSocket.send(
        JSON.stringify({
          event: 'selection/:canvasId/put',
          data: {
            selectShapes: [shape._id],
            deselectShapes: [],
            canvasId: 'some-unique',
            select: true,
          },
        }),
      );
    });
  });

  it('selection/put - deletes an entry for shapes to be deselect', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: {
          canvasId: 'some-unique-id',
          shapeIds: [],
        },
        event: 'selection/:canvasId/put',
      });
      selectionModel.find({ canvasId: 'some-unique' }).then((selections) => {
        expect(selections.length).toBe(0);
      });
      done();
    });

    shapeModel.create(shapeMockData).then((shape) => {
      selectionModel.create({ shape, canvasId: 'some-unique-id' }).then(() => {
        webSocket.send(
          JSON.stringify({
            event: 'selection/:canvasId/put',
            data: {
              selectShapes: [],
              deselectShapes: [shape._id],
              canvasId: 'some-unique-id',
              select: false,
            },
          }),
        );
      });
    });
  });

  it('selection/put - cannot select a shape if already selected by another canvas', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: expect.objectContaining({
          message: 'Selected by another canvas',
        }),
        event: 'error',
      });
      done();
    });

    shapeModel.create(shapeMockData).then((shape) => {
      selectionModel.create({ shape, canvasId: 'some-unique-id' }).then(() => {
        webSocket.send(
          JSON.stringify({
            event: 'selection/:canvasId/put',
            data: {
              selectShapes: [shape._id],
              deselectShapes: [],
              canvasId: 'another-unique-id',
              select: true,
            },
          }),
        );
      });
    });
  });

  it('selection/put - deselects all ids of a given canvas if deselectAll is true', (done) => {
    webSocket.on('message', async (data) => {
      expect(JSON.parse(data.toString())).toEqual({
        data: {
          canvasId: 'some-unique-id',
          shapeIds: [],
        },
        event: 'selection/:canvasId/put',
      });
      selectionModel.find({ canvasId: 'some-unique-id' }).then((selections) => {
        expect(selections.length).toBe(0);
      });
      done();
    });

    shapeModel.create(shapeMockData).then((shape) => {
      selectionModel.create({ shape, canvasId: 'some-unique-id' }).then(() => {
        webSocket.send(
          JSON.stringify({
            event: 'selection/:canvasId/put',
            data: {
              selectShapes: [],
              deselectShapes: [],
              canvasId: 'some-unique-id',
              deselectAll: true,
            },
          }),
        );
      });
    });
  });

  afterEach(async () => {
    webSocket.close();
    await mongooseTestModule.stop();
    await app.close();
  });
});
