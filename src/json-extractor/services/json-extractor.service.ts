import { Injectable } from '@nestjs/common';

import { EmailParserService } from './email-parser.service';
import { JsonAttachmentContent } from '../interfaces/response.interface';

@Injectable()
export class JsonExtractorService {
  constructor(private readonly emailParserService: EmailParserService) {}

  /**
   * Parses an email specified by a file path or URL and retrieves JSON content from it.
   *
   * This method is a wrapper around `EmailParserService.parseEmailAndGetJson`.
   *
   * @param {string} query - The path or URL of the email file to parse.
   * @returns {Promise<JsonAttachmentContent>} The JSON content extracted from the email.
   */
  parseEmail(query: string): Promise<JsonAttachmentContent | undefined> {
    return this.emailParserService.parseEmailAndGetJson(query);
  }
}
