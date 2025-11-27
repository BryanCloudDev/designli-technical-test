import { Injectable } from '@nestjs/common';

import { EmailParserService } from './services/email-parser.service';

@Injectable()
export class JsonExtractorService {
  constructor(private readonly emailParserService: EmailParserService) {}

  parseEmail(query: string) {
    return this.emailParserService.parse(query);
  }
}
