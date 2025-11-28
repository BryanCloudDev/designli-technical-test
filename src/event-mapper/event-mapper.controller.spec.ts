import { Test, TestingModule } from '@nestjs/testing';
import { EventMapperController } from './event-mapper.controller';
import { EventMapperService } from './event-mapper.service';
import { SesEventDto } from './dto/create-event-mapper.dto';
import { MappedSesEvent } from './dto/response-event-mapper.dto';
import { VerdictStatus } from './enum/verdict-status.enum';

describe('EventMapperController', () => {
  let controller: EventMapperController;
  let service: EventMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventMapperController],
      providers: [
        {
          provide: EventMapperService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventMapperController>(EventMapperController);
    service = module.get<EventMapperService>(EventMapperService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createSesEventDto = (): SesEventDto => ({
      Records: [
        {
          eventVersion: '1.0',
          eventSource: 'aws:ses',
          ses: {
            receipt: {
              timestamp: new Date('2023-01-01T00:00:00.000Z'),
              processingTimeMillis: 1200,
              recipients: ['recipient@example.com'],
              spamVerdict: { status: VerdictStatus.PASS },
              virusVerdict: { status: VerdictStatus.PASS },
              spfVerdict: { status: VerdictStatus.PASS },
              dkimVerdict: { status: VerdictStatus.PASS },
              dmarcVerdict: { status: VerdictStatus.PASS },
              dmarcPolicy: 'reject',
              action: {
                type: 'SNS',
                topicArn: 'arn:aws:sns:us-east-1:123456789012:MyTopic',
              },
            },
            mail: {
              timestamp: new Date('2023-01-01T00:00:00.000Z'),
              source: 'john.doe@example.com',
              messageId: '12345',
              destination: ['support@example.com', 'billing@example.com'],
              headersTruncated: false,
              headers: [
                { name: 'From', value: 'john.doe@example.com' },
                { name: 'To', value: 'support@example.com' },
                { name: 'Subject', value: 'Test Email' },
              ],
              commonHeaders: {
                from: ['john.doe@example.com'],
                to: ['support@example.com'],
                messageId: '12345',
                subject: 'Test Email',
                returnPath: 'return@example.com',
                date: '2023-01-01T00:00:00.000Z',
                cc: [],
              },
            },
          },
        },
      ],
    });

    it('should process SES event successfully', () => {
      const sesEventDto = createSesEventDto();
      const expectedResult: MappedSesEvent[] = [
        {
          spam: true,
          virus: true,
          dns: true,
          mes: 'January',
          retrasado: true,
          emisor: 'john.doe',
          receptor: ['support', 'billing'],
        },
      ];

      jest.spyOn(service, 'create').mockReturnValue(expectedResult);

      const result = controller.create(sesEventDto);

      expect(service.create).toHaveBeenCalledWith(sesEventDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle validation failure', () => {
      const invalidSesEventDto: SesEventDto = { Records: [] };

      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new Error('Validation failed');
      });

      expect(() => controller.create(invalidSesEventDto)).toThrow(
        'Validation failed',
      );
      expect(service.create).toHaveBeenCalledWith(invalidSesEventDto);
    });
  });
});
