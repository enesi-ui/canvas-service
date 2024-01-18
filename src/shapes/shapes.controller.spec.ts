import { Test, TestingModule } from '@nestjs/testing';
import { ShapesController } from './shapes.controller';
import { ShapesService } from './shapes.service';

describe('ShapesController', () => {
  let controller: ShapesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShapesController],
      providers: [ShapesService],
    }).compile();

    controller = module.get<ShapesController>(ShapesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
