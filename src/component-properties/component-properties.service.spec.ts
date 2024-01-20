import { Test, TestingModule } from '@nestjs/testing';
import { ComponentPropertiesService } from './component-properties.service';

describe('ComponentPropertiesService', () => {
  let service: ComponentPropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComponentPropertiesService],
    }).compile();

    service = module.get<ComponentPropertiesService>(ComponentPropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
