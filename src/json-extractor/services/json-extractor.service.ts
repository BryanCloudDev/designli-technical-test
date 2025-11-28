import { Injectable } from '@nestjs/common';

import { EmailParserService } from './email-parser.service';

@Injectable()
export class JsonExtractorService {
  constructor(private readonly emailParserService: EmailParserService) {}

  parseEmail(query: string) {
    return this.emailParserService.parseEmailAndGetJson(query);
  }
}
