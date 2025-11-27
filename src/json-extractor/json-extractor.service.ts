import { Injectable } from '@nestjs/common';

import { CreateJsonExtractorDto } from './dto/create-json-extractor.dto';

@Injectable()
export class JsonExtractorService {
  create(createJsonExtractorDto: CreateJsonExtractorDto) {
    return 'This action adds a new jsonExtractor';
  }
}
