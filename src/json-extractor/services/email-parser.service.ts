import * as fs from 'fs/promises';
import path from 'path';

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ParsedMail, simpleParser } from 'mailparser';
import * as cheerio from 'cheerio';

import { JsonAttachmentContent } from '../interfaces/response.interface';
import { errorHandler } from 'src/common/error/error-handler';
import { HttpClient } from 'src/common/http/http-client';

@Injectable()
export class EmailParserService {
  constructor(private readonly httpClient: HttpClient) {}

  async parseEmailAndGetJson(fileName: string) {
    try {
      const file = await this.openFile(fileName);
      const parsedEmail = await simpleParser(file);

      // Case 1 - Look for JSON attachments
      const jsonFromAttachment = this.getJsonFromAttachments(parsedEmail);
      if (jsonFromAttachment) {
        return jsonFromAttachment;
      }

      // Case 2 - Inside the body of the email as a link
      const jsonFromBody = await this.getJsonFromEmailBody(parsedEmail);
      if (jsonFromBody) {
        return jsonFromBody;
      }

      // Case 3 - Inside the body of the email as a link that leads to a webpage where there is a link that leads to the actual JSON
      const jsonFromExternalPage =
        await this.getJsonFromEmailLinkToExternalPage(parsedEmail);
      if (jsonFromExternalPage) {
        return jsonFromExternalPage;
      }

      throw new BadRequestException('No JSON content found in the email');
    } catch (error) {
      errorHandler('Error in parseEmailAndGetJson', this.logger, error);
    }
  }

  private readonly logger = new Logger(EmailParserService.name);

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
      throw new BadRequestException('Could not read the specified file');
    }
  }

  private getJsonFromAttachments(parsedEmail: ParsedMail) {
    for (const attachment of parsedEmail.attachments) {
      if (attachment && attachment.filename) {
        if (attachment.filename.endsWith('.json')) {
          const parsedContent = JSON.parse(
            attachment.content.toString(),
          ) as JsonAttachmentContent;
          return parsedContent;
        }
      }
    }
  }

  private async getJsonFromEmailBody(parsedEmail: ParsedMail) {
    try {
      const jsonUrlRegex = /https?:\/\/[^\s]+?\.json\b/;
      const bodyText = parsedEmail.text || '';
      const match = bodyText.match(jsonUrlRegex);

      if (match && match[0]) {
        const jsonUrl = match[0];
        const fetchedJson = await this.httpClient.get(jsonUrl);

        return fetchedJson.data as JsonAttachmentContent;
      }
    } catch (error) {
      errorHandler('Error in getJsonFromEmailBody', this.logger, error);
    }
  }

  private async getJsonFromEmailLinkToExternalPage(parsedEmail: ParsedMail) {
    try {
      const webpageUrlRegex = /https?:\/\/[^\s<>"]+/;
      const bodyText = parsedEmail.text || '';
      const match = bodyText.match(webpageUrlRegex);

      if (match && match[0]) {
        const webUrl = match[0];
        const $ = await this.loadPage(webUrl);
        const results: { href: string }[] = [];

        $('a').each((i, el) => {
          const href = $(el).attr('href');

          if (!href || !href.endsWith('.json')) return;
          const absoluteUrl = new URL(href, webUrl).toString();

          results.push({
            href: absoluteUrl,
          });
        });

        if (results.length === 0) {
          throw new BadRequestException(
            'The redirected page does not contain any JSON links',
          );
        }
        // taking the first link that ends with .json
        const fetchedJson = await this.httpClient.get(results[0].href);

        return fetchedJson.data as JsonAttachmentContent;
      }
    } catch (error: any) {
      errorHandler(
        'Error in getJsonFromEmailLinkToExternalPage',
        this.logger,
        error,
      );
    }
  }

  private async loadPage(url: string) {
    try {
      const response = await this.httpClient.get(url);
      const data = response.data as string;

      // Load the HTML into cheerio
      const $ = cheerio.load(data);

      return $;
    } catch (error) {
      return errorHandler('Error in loadPage', this.logger, error);
    }
  }
}
