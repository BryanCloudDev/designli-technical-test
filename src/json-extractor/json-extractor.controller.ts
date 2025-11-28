import { Controller, Get, Query } from '@nestjs/common';

import { JsonExtractorService } from './services/json-extractor.service';

@Controller('json-extractor')
export class JsonExtractorController {
  constructor(private readonly jsonExtractorService: JsonExtractorService) {}

  @Get()
  parseEmail(@Query('file') query: string) {
    return this.jsonExtractorService.parseEmail(query);
  }
}
