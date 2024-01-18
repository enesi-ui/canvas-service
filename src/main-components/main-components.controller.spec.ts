import { Test, TestingModule } from '@nestjs/testing';
import { MainComponentsController } from './main-components.controller';

describe('MainComponentController', () => {
  let controller: MainComponentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainComponentsController],
    }).compile();

    controller = module.get<MainComponentsController>(MainComponentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
