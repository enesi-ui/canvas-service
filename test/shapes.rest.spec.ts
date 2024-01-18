import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseTestModule } from './test-utils';
import { ShapesModule } from '../src/shapes/shapes.module';
import { Model } from 'mongoose';
import { Shape } from '../src/shapes/shape.schema';
import { getModelToken } from '@nestjs/mongoose';

const mongooseTestModule = new MongooseTestModule();

describe('Shapes-rest', () => {
  let app: INestApplication;
  let shapeModel: Model<Shape>;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ShapesModule, await mongooseTestModule.forRoot()],
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
      .send({ fill: '#000000', type: 'CIRCLE', fillAlpha: 1 })
      .expect(201);

    const savedShapes = await shapeModel.find().exec();

    expect(savedShapes.length).toEqual(1);
    expect(savedShapes[0]).toEqual(
      expect.objectContaining({
        fill: '#000000',
        type: 'CIRCLE',
        fillAlpha: 1,
      }),
    );
  });

  afterEach(async () => {
    await mongooseTestModule.stop();
    await app.close();
  });
});
