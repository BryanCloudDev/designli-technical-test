import { Test, TestingModule } from '@nestjs/testing';
import { JsonExtractorController } from './json-extractor.controller';
import { JsonExtractorService } from './json-extractor.service';

describe('JsonExtractorController', () => {
  let controller: JsonExtractorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsonExtractorController],
      providers: [JsonExtractorService],
    }).compile();

    controller = module.get<JsonExtractorController>(JsonExtractorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
