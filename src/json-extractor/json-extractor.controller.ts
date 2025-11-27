import { Controller, Post, Body } from '@nestjs/common';

import { CreateJsonExtractorDto } from './dto/create-json-extractor.dto';
import { JsonExtractorService } from './json-extractor.service';

@Controller('json-extractor')
export class JsonExtractorController {
  constructor(private readonly jsonExtractorService: JsonExtractorService) {}

  @Post()
  create(@Body() createJsonExtractorDto: CreateJsonExtractorDto) {
    return this.jsonExtractorService.create(createJsonExtractorDto);
  }
}
