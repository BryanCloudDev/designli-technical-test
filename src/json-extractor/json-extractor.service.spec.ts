import { Test, TestingModule } from '@nestjs/testing';
import { JsonExtractorService } from './services/json-extractor.service';
import { EmailParserService } from './services/email-parser.service';
import { JsonAttachmentContent } from './interfaces/response.interface';

describe('JsonExtractorService', () => {
  let service: JsonExtractorService;
  let emailParserService: EmailParserService;

  beforeEach(async () => {
    const mockEmailParserService = {
      parseEmailAndGetJson: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JsonExtractorService,
        {
          provide: EmailParserService,
          useValue: mockEmailParserService,
        },
      ],
    }).compile();

    service = module.get<JsonExtractorService>(JsonExtractorService);
    emailParserService = module.get<EmailParserService>(EmailParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseEmail', () => {
    it('should call EmailParserService.parseEmailAndGetJson with the correct query', async () => {
      const query = 'test-query';
      await service.parseEmail(query);
      expect(emailParserService.parseEmailAndGetJson).toHaveBeenCalledWith(
        query,
      );
    });

    it('should return the result from EmailParserService.parseEmailAndGetJson', async () => {
      const mockResult: JsonAttachmentContent = { content: 'test-content' };
      (emailParserService.parseEmailAndGetJson as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const result = await service.parseEmail('test-query');
      expect(result).toEqual(mockResult);
    });

    it('should return undefined when EmailParserService.parseEmailAndGetJson returns undefined', async () => {
      (emailParserService.parseEmailAndGetJson as jest.Mock).mockResolvedValue(
        undefined,
      );

      const result = await service.parseEmail('test-query');
      expect(result).toBeUndefined();
    });

    it('should throw an error when EmailParserService.parseEmailAndGetJson throws an error', async () => {
      const errorMessage = 'Test error';
      (emailParserService.parseEmailAndGetJson as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(service.parseEmail('test-query')).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
