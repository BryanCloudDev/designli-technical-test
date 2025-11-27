import { Test, TestingModule } from '@nestjs/testing';
import { JsonExtractorService } from './json-extractor.service';

describe('JsonExtractorService', () => {
  let service: JsonExtractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonExtractorService],
    }).compile();

    service = module.get<JsonExtractorService>(JsonExtractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
