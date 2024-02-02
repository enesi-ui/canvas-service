import { Test, TestingModule } from '@nestjs/testing';
import { DataResourcesController } from './data-resources.controller';
import { DataResourcesService } from './data-resources.service';

describe('DataRessourcesController', () => {
  let controller: DataResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataResourcesController],
      providers: [DataResourcesService],
    }).compile();

    controller = module.get<DataResourcesController>(DataResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
