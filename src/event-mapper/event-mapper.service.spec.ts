import { Test, TestingModule } from '@nestjs/testing';
import { EventMapperService } from './event-mapper.service';
import { EventProcessed } from './entities/event-mapper.entity';
import { SesEventDto } from './dto/create-event-mapper.dto';
import { VerdictStatus } from './enum/verdict-status.enum';

describe('EventMapperService', () => {
  let service: EventMapperService;
  let eventProcessedMock: jest.Mocked<EventProcessed>;

  beforeEach(async () => {
    eventProcessedMock = {
      fromSesRecord: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventMapperService,
        {
          provide: EventProcessed,
          useValue: eventProcessedMock,
        },
      ],
    }).compile();

    service = module.get<EventMapperService>(EventMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call fromSesRecord on EventProcessed entity', () => {
      const mockInput: SesEventDto = {
        Records: [],
      };
      service.create(mockInput);
      expect(eventProcessedMock.fromSesRecord).toHaveBeenCalledWith(mockInput);
    });

    it('should return the result of fromSesRecord', () => {
      const mockInput: SesEventDto = {
        Records: [],
      };
      const mockOutput = [
        {
          spam: true,
          virus: false,
          dns: true,
          mes: 'January',
          retrasado: false,
          emisor: 'test',
          receptor: ['test'],
        },
      ];
      eventProcessedMock.fromSesRecord.mockReturnValue(mockOutput);

      const result = service.create(mockInput);
      expect(result).toEqual(mockOutput);
    });

    it('should correctly map fields for a single record', () => {
      const mockInput: SesEventDto = {
        Records: [
          {
            eventVersion: '1.0',
            eventSource: 'aws:ses',
            ses: {
              receipt: {
                timestamp: new Date('2024-01-05T12:34:56Z'),
                processingTimeMillis: 1500,
                recipients: ['recipient@example.com'],
                spamVerdict: { status: VerdictStatus.PASS },
                virusVerdict: { status: VerdictStatus.FAIL },
                spfVerdict: { status: VerdictStatus.PASS },
                dkimVerdict: { status: VerdictStatus.PASS },
                dmarcVerdict: { status: VerdictStatus.PASS },
                dmarcPolicy: 'reject',
                action: {
                  type: 'SNS',
                  topicArn: 'arn:aws:sns:us-east-1:123456789012:topic',
                },
              },
              mail: {
                timestamp: new Date('2024-01-05T12:34:56Z'),
                source: 'sender@example.com',
                messageId: '<1234@example.com>',
                destination: [
                  'recipient1@example.com',
                  'recipient2@example.com',
                ],
                headersTruncated: false,
                headers: [],
                commonHeaders: {
                  returnPath: 'sender@example.com',
                  from: ['sender@example.com'],
                  date: 'Fri, 5 Jan 2024 12:34:56 +0000',
                  to: ['recipient1@example.com', 'recipient2@example.com'],
                  messageId: '<1234@example.com>',
                  subject: 'Test Email',
                  cc: [],
                },
              },
            },
          },
        ],
      };

      const expectedOutput = [
        {
          spam: true,
          virus: false,
          dns: true,
          mes: 'January',
          retrasado: true,
          emisor: 'sender',
          receptor: ['recipient1', 'recipient2'],
        },
      ];

      eventProcessedMock.fromSesRecord.mockReturnValue(expectedOutput);

      const result = service.create(mockInput);
      expect(result).toEqual(expectedOutput);
    });

    it('should handle multiple records', () => {
      const mockInput: SesEventDto = {
        Records: [
          {
            eventVersion: '1.0',
            eventSource: 'aws:ses',
            ses: {
              receipt: {
                timestamp: new Date('2024-01-05T12:34:56Z'),
                processingTimeMillis: 500,
                recipients: ['recipient1@example.com'],
                spamVerdict: { status: VerdictStatus.PASS },
                virusVerdict: { status: VerdictStatus.PASS },
                spfVerdict: { status: VerdictStatus.PASS },
                dkimVerdict: { status: VerdictStatus.PASS },
                dmarcVerdict: { status: VerdictStatus.PASS },
                dmarcPolicy: 'reject',
                action: {
                  type: 'SNS',
                  topicArn: 'arn:aws:sns:us-east-1:123456789012:topic',
                },
              },
              mail: {
                timestamp: new Date('2024-01-05T12:34:56Z'),
                source: 'sender1@example.com',
                messageId: '<1234@example.com>',
                destination: ['recipient1@example.com'],
                headersTruncated: false,
                headers: [],
                commonHeaders: {
                  returnPath: 'sender1@example.com',
                  from: ['sender1@example.com'],
                  date: 'Fri, 5 Jan 2024 12:34:56 +0000',
                  to: ['recipient1@example.com'],
                  messageId: '<1234@example.com>',
                  subject: 'Test Email 1',
                  cc: [],
                },
              },
            },
          },
          {
            eventVersion: '1.0',
            eventSource: 'aws:ses',
            ses: {
              receipt: {
                timestamp: new Date('2024-02-15T10:00:00Z'),
                processingTimeMillis: 1200,
                recipients: ['recipient2@example.com'],
                spamVerdict: { status: VerdictStatus.FAIL },
                virusVerdict: { status: VerdictStatus.PASS },
                spfVerdict: { status: VerdictStatus.FAIL },
                dkimVerdict: { status: VerdictStatus.PASS },
                dmarcVerdict: { status: VerdictStatus.FAIL },
                dmarcPolicy: 'reject',
                action: {
                  type: 'SNS',
                  topicArn: 'arn:aws:sns:us-east-1:123456789012:topic',
                },
              },
              mail: {
                timestamp: new Date('2024-02-15T10:00:00Z'),
                source: 'sender2@example.com',
                messageId: '<5678@example.com>',
                destination: ['recipient2@example.com'],
                headersTruncated: false,
                headers: [],
                commonHeaders: {
                  returnPath: 'sender2@example.com',
                  from: ['sender2@example.com'],
                  date: 'Thu, 15 Feb 2024 10:00:00 +0000',
                  to: ['recipient2@example.com'],
                  messageId: '<5678@example.com>',
                  subject: 'Test Email 2',
                  cc: [],
                },
              },
            },
          },
        ],
      };

      const expectedOutput = [
        {
          spam: true,
          virus: true,
          dns: true,
          mes: 'January',
          retrasado: false,
          emisor: 'sender1',
          receptor: ['recipient1'],
        },
        {
          spam: false,
          virus: true,
          dns: false,
          mes: 'February',
          retrasado: true,
          emisor: 'sender2',
          receptor: ['recipient2'],
        },
      ];

      eventProcessedMock.fromSesRecord.mockReturnValue(expectedOutput);

      const result = service.create(mockInput);
      expect(result).toEqual(expectedOutput);
    });
  });
});
