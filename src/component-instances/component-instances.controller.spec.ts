import { Test, TestingModule } from '@nestjs/testing';
import { ComponentInstancesController } from './component-instances.controller';
import { ComponentInstancesService } from './component-instances.service';

describe('ComponentInstancesController', () => {
  let controller: ComponentInstancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentInstancesController],
      providers: [ComponentInstancesService],
    }).compile();

    controller = module.get<ComponentInstancesController>(ComponentInstancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
