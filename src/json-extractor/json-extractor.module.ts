import { Module } from '@nestjs/common';

import { JsonExtractorController } from './json-extractor.controller';
import { EmailParserService } from './services/email-parser.service';
import { JsonExtractorService } from './json-extractor.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [JsonExtractorController],
  providers: [JsonExtractorService, EmailParserService],
  imports: [HttpModule],
})
export class JsonExtractorModule {}
