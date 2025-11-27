import * as fs from 'fs/promises';
import path from 'path';

import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { simpleParser } from 'mailparser';

// Interface for JSON attachment content
export interface JsonAttachmentContent {
  [key: string]: unknown;
}

@Injectable()
export class EmailParserService {
  private readonly logger = new Logger(EmailParserService.name);

  async parse(fileName: string) {
    try {
      const file = await this.openFile(fileName);
      const parsedEmail = await simpleParser(file);

      console.log(JSON.stringify(parsedEmail));

      // Case 1 - Look for JSON attachments
      for (const attachment of parsedEmail.attachments) {
        if (attachment && attachment.filename) {
          if (attachment.filename.endsWith('.json')) {
            const parsedContent = JSON.parse(
              attachment.content.toString(),
            ) as JsonAttachmentContent;
            return parsedContent;
          }
        }

        throw new BadRequestException('No JSON attachment found in the email.');
      }

      // Case 2 - Inside the body of the email as a link

      // Case 3 - Inside the body of the email as a link that leads to a webpage where there is a link
      // that leads to the actual JSON
    } catch (error) {
      if (error instanceof HttpException) throw error;
    }
  }

  private async openFile(fileName: string) {
    try {
      const emailPath = path.join(
        process.cwd(),
        'src/json-extractor/emails',
        fileName,
      );

      const file = await fs.readFile(emailPath);

      return file;
    } catch (error) {
      this.logger.error('Error reading file:', error);
      throw new BadRequestException('Could not read the specified file.');
    }
  }
}
