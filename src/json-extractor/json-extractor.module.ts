import { Module } from '@nestjs/common';

import { JsonExtractorController } from './json-extractor.controller';
import { JsonExtractorService } from './json-extractor.service';

@Module({
  controllers: [JsonExtractorController],
  providers: [JsonExtractorService],
})
export class JsonExtractorModule {}
