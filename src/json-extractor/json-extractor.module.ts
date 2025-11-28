import { Module } from '@nestjs/common';

import { JsonExtractorController } from './json-extractor.controller';
import { EmailParserService } from './services/email-parser.service';
import { JsonExtractorService } from './services/json-extractor.service';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [JsonExtractorController],
  providers: [JsonExtractorService, EmailParserService],
  imports: [CommonModule],
})
export class JsonExtractorModule {}
