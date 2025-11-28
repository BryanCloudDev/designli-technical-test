import * as fs from 'fs/promises';
import path from 'path';

import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { simpleParser } from 'mailparser';
import * as cheerio from 'cheerio';

// Interface for JSON attachment content
export interface JsonAttachmentContent {
  [key: string]: unknown;
}

@Injectable()
export class EmailParserService {
  private readonly logger = new Logger(EmailParserService.name);

  constructor(private readonly httpService: HttpService) {}

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
      }
      this.logger.log('No JSON attachment found in the email');

      // Case 2 - Inside the body of the email as a link

      const jsonUrlRegex = /https?:\/\/[^\s]+?\.json\b/;
      const bodyText = parsedEmail.text || '';
      const match = bodyText.match(jsonUrlRegex);

      if (match && match[0]) {
        const jsonUrl = match[0];
        this.logger.log(`Found JSON URL: ${jsonUrl}`);

        const fetchedJson = await this.httpService.axiosRef.get(jsonUrl);

        if (fetchedJson.status !== 200) {
          throw new BadRequestException(
            `Failed to fetch JSON from URL: ${jsonUrl}`,
          );
        }

        return fetchedJson.data as JsonAttachmentContent;
      } else {
        this.logger.log('No JSON link found in the email body');
      }

      // Case 3 - Inside the body of the email as a link that leads to a webpage where there is a link
      // that leads to the actual JSON

      const webpageUrlRegex = /https?:\/\/[^\s<>"]+/;
      const bodyText1 = parsedEmail.text || '';
      const match1 = bodyText1.match(webpageUrlRegex);

      if (match1 && match1[0]) {
        const webUrl = match1[0];
        this.logger.log(`Found Web URL: ${webUrl}`);

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
          this.logger.log('No JSON link found on the webpage');
          throw new BadRequestException(
            'No JSON content found in the redirected page.',
          );
        }
        // taking the first link that ends with .json

        const fetchedJson = await this.httpService.axiosRef.get(
          results[0].href,
        );

        if (fetchedJson.status !== 200) {
          throw new BadRequestException(
            `Failed to fetch JSON from URL: ${results[0].href}`,
          );
        }

        return fetchedJson.data as JsonAttachmentContent;
      }

      this.logger.log('No link found in the email body');

      throw new BadRequestException('No JSON content found in the email.');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error parsing email:', error);
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

  async loadPage(url: string) {
    const response = await this.httpService.axiosRef.get<string>(url);
    const data = response.data;

    const $ = cheerio.load(data);

    return $;
  }
}
