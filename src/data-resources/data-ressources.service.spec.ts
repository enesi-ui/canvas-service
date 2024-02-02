import { Test, TestingModule } from '@nestjs/testing';
import { DataResourcesService } from './data-resources.service';

describe('DataRessourcesService', () => {
  let service: DataResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataResourcesService],
    }).compile();

    service = module.get<DataResourcesService>(DataResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
