import { Test, TestingModule } from '@nestjs/testing';
import { ComponentPropertiesController } from './component-properties.controller';
import { ComponentPropertiesService } from './component-properties.service';

describe('ComponentPropertiesController', () => {
  let controller: ComponentPropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentPropertiesController],
      providers: [ComponentPropertiesService],
    }).compile();

    controller = module.get<ComponentPropertiesController>(ComponentPropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
