import { Test, TestingModule } from '@nestjs/testing';
import { ComponentInstancesService } from './component-instances.service';

describe('ComponentInstancesService', () => {
  let service: ComponentInstancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComponentInstancesService],
    }).compile();

    service = module.get<ComponentInstancesService>(ComponentInstancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
