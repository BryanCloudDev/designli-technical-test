import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { JsonExtractorService } from './services/json-extractor.service';
import { JsonExtractorController } from './json-extractor.controller';

describe('JsonExtractorController', () => {
  let controller: JsonExtractorController;
  let service: JsonExtractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsonExtractorController],
      providers: [
        {
          provide: JsonExtractorService,
          useValue: {
            parseEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JsonExtractorController>(JsonExtractorController);
    service = module.get<JsonExtractorService>(JsonExtractorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('parseEmail', () => {
    it('should call jsonExtractorService.parseEmail with the correct file name', async () => {
      const fileName = 'test-file.eml';
      const expectedResult = { key: 'value' };
      jest.spyOn(service, 'parseEmail').mockResolvedValue(expectedResult);

      const result = await controller.parseEmail(fileName);

      expect(service.parseEmail).toHaveBeenCalledWith(fileName);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException for invalid file name', async () => {
      const fileName = 'invalid-file.txt';
      jest
        .spyOn(service, 'parseEmail')
        .mockRejectedValue(new BadRequestException('Invalid file name'));

      await expect(controller.parseEmail(fileName)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
