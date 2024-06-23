import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseTestModule } from './test-utils';
import { Model } from 'mongoose';
import { Shape, ShapeSchema } from '../src/shapes/shape.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';

import {
  MainComponent,
  MainComponentSchema,
} from '../src/main-components/main-component.schema';
import { ShapesController } from '../src/shapes/shapes.controller';
import { ShapesService } from '../src/shapes/shapes.service';

const mongooseTestModule = new MongooseTestModule();

describe('Shapes-rest', () => {
  let app: INestApplication;
  let shapeModel: Model<Shape>;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        await mongooseTestModule.forRoot(),
        MongooseModule.forFeature([
          { name: MainComponent.name, schema: MainComponentSchema },
          { name: Shape.name, schema: ShapeSchema },
        ]),
      ],
      controllers: [ShapesController],
      providers: [ShapesService],
      exports: [ShapesService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    shapeModel = moduleFixture.get<Model<Shape>>(getModelToken(Shape.name));
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/shapes').expect(200).expect([]);
  });

  it('/ (POST)', async () => {
    await request(app.getHttpServer())
      .post('/shapes')
      .send({
        type: 'RECTANGLE',
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
        zIndex: 0,
        name: 'Some Shape',
        radius: 0,
        canvasId: '123',
      })
      .expect(201);

    const savedShapes = await shapeModel.find().exec();

    expect(savedShapes.length).toEqual(1);
    expect(savedShapes[0]).toEqual(
      expect.objectContaining({
        type: 'RECTANGLE',
      }),
    );
  });

  afterEach(async () => {
    await mongooseTestModule.stop();
    await app.close();
  });
});
