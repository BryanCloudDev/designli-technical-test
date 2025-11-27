import { Module } from '@nestjs/common';

import { JsonExtractorController } from './json-extractor.controller';
import { EmailParserService } from './services/email-parser.service';
import { JsonExtractorService } from './json-extractor.service';

@Module({
  controllers: [JsonExtractorController],
  providers: [JsonExtractorService, EmailParserService],
})
export class JsonExtractorModule {}
