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

  /**
   * Parses an email file and retrieves JSON content from it.
   *
   * The function handles three scenarios:
   * 1. JSON as an attachment.
   * 2. JSON linked directly in the email body.
   * 3. JSON linked on an external webpage linked from the email body.
   *
   * @param {string} fileName - The name of the email file to parse (located in src/json-extractor/emails).
   * @returns {Promise<JsonAttachmentContent>} The parsed JSON content from the email.
   * @throws {BadRequestException} If no JSON content is found or the file cannot be read.
   */
  async parseEmailAndGetJson(
    fileName: string,
  ): Promise<JsonAttachmentContent | undefined> {
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

  /**
   * Reads an email file from the local filesystem.
   *
   * @param {string} fileName - The name of the email file to read.
   * @returns {Promise<Buffer>} The raw content of the email file.
   * @throws {BadRequestException} If the file cannot be read.
   */
  private async openFile(fileName: string): Promise<Buffer> {
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

  /**
   * Extracts JSON content from the attachments of a parsed email.
   *
   * @param {ParsedMail} parsedEmail - The parsed email object.
   * @returns {JsonAttachmentContent | undefined} The parsed JSON from the attachment, if found.
   */
  private getJsonFromAttachments(
    parsedEmail: ParsedMail,
  ): JsonAttachmentContent | undefined {
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

  /**
   * Extracts JSON content from a direct link inside the email body.
   *
   * @param {ParsedMail} parsedEmail - The parsed email object.
   * @returns {Promise<JsonAttachmentContent | undefined>} The JSON content fetched from the link, if found.
   */
  private async getJsonFromEmailBody(
    parsedEmail: ParsedMail,
  ): Promise<JsonAttachmentContent | undefined> {
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

  /**
   * Extracts JSON content from a webpage linked in the email body, where the page contains a link to the JSON file.
   *
   * @param {ParsedMail} parsedEmail - The parsed email object.
   * @returns {Promise<JsonAttachmentContent | undefined>} The JSON content fetched from the external page, if found.
   * @throws {BadRequestException} If the webpage does not contain any JSON links.
   */
  private async getJsonFromEmailLinkToExternalPage(
    parsedEmail: ParsedMail,
  ): Promise<JsonAttachmentContent | undefined> {
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

  /**
   * Loads a webpage and returns a Cheerio instance for DOM manipulation.
   *
   * @param {string} url - The URL of the webpage to load.
   * @returns {Promise<CheerioStatic>} A Cheerio instance loaded with the page HTML.
   */
  private async loadPage(url: string): Promise<cheerio.CheerioAPI> {
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
