import { Test, TestingModule } from '@nestjs/testing';
import { MainComponentsService } from './main-components.service';

describe('MainComponentService', () => {
  let service: MainComponentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainComponentsService],
    }).compile();

    service = module.get<MainComponentsService>(MainComponentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
