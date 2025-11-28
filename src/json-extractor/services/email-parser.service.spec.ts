import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ParsedMail, Attachment, simpleParser } from 'mailparser';
import { readFile } from 'fs/promises';

import { EmailParserService } from './email-parser.service';
import { HttpClient } from '../../common/http/http-client';
import { JsonAttachmentContent } from '../interfaces/response.interface';

jest.mock('fs/promises');
jest.mock('mailparser', () => ({
  simpleParser: jest.fn(),
}));
jest.mock('cheerio');

describe('EmailParserService', () => {
  let service: EmailParserService;
  let httpClient: HttpClient;

  const mockHttpClient = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailParserService,
        {
          provide: HttpClient,
          useValue: mockHttpClient,
        },
      ],
    }).compile();

    service = module.get<EmailParserService>(EmailParserService);
    httpClient = module.get<HttpClient>(HttpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseEmailAndGetJson', () => {
    const mockFileName = 'test.eml';
    const mockJsonContent: JsonAttachmentContent = {
      id: '123',
      data: { test: 'value' },
    };

    it('should successfully parse JSON from attachment', async () => {
      const mockBuffer = Buffer.from('mock email content');
      const mockParsedEmail: ParsedMail = {
        attachments: [
          {
            filename: 'data.json',
            content: Buffer.from(JSON.stringify(mockJsonContent)),
            contentType: 'application/json',
            contentDisposition: 'attachment',
            headers: new Map(),
            headerLines: [],
            related: false,
            type: 'attachment',
            release: () => {},
            contentId: '',
            cid: '',
            checksum: '',
            size: 0,
          } as unknown as Attachment,
        ],
        headers: new Map(),
        headerLines: [],
        html: '',
        text: '',
      };

      (readFile as jest.Mock).mockResolvedValue(mockBuffer);
      (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);

      const result = await service.parseEmailAndGetJson(mockFileName);

      expect(result).toEqual(mockJsonContent);
    });

    it('should successfully parse JSON from direct link in email body', async () => {
      const mockBuffer = Buffer.from('mock email content');
      const mockParsedEmail: ParsedMail = {
        attachments: [],
        text: 'Check this JSON: https://example.com/data.json',
        headers: new Map(),
        headerLines: [],
        html: '',
      };

      (readFile as jest.Mock).mockResolvedValue(mockBuffer);
      (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);
      mockHttpClient.get.mockResolvedValue({ data: mockJsonContent });

      const result = await service.parseEmailAndGetJson(mockFileName);

      expect(result).toEqual(mockJsonContent);
      expect(httpClient.get).toHaveBeenCalledWith(
        'https://example.com/data.json',
      );
    });

    it('should throw BadRequestException when no JSON content is found', async () => {
      const mockBuffer = Buffer.from('mock email content');
      const mockParsedEmail: ParsedMail = {
        attachments: [],
        text: 'No JSON content here',
        headers: new Map(),
        headerLines: [],
        html: '',
      };

      (readFile as jest.Mock).mockResolvedValue(mockBuffer);
      (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);

      await expect(service.parseEmailAndGetJson(mockFileName)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when file cannot be read', async () => {
      (readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      await expect(service.parseEmailAndGetJson(mockFileName)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('error handling', () => {
    it('should handle JSON parsing errors in attachments', async () => {
      const mockBuffer = Buffer.from('mock email content');
      const mockParsedEmail: ParsedMail = {
        attachments: [
          {
            filename: 'data.json',
            content: Buffer.from('invalid json'),
            contentType: 'application/json',
            contentDisposition: 'attachment',
            headers: new Map(),
            headerLines: [],
            related: false,
            type: 'attachment',
            release: () => {},
            contentId: '',
            cid: '',
            checksum: '',
            size: 0,
          } as unknown as Attachment,
        ],
        headers: new Map(),
        headerLines: [],
        html: '',
        text: '',
      };

      (readFile as jest.Mock).mockResolvedValue(mockBuffer);
      (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);

      await expect(service.parseEmailAndGetJson('test.eml')).rejects.toThrow();
    });
  });
});
