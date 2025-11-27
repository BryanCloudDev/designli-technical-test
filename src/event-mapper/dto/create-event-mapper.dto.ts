import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// Documentation based in: https://docs.aws.amazon.com/ses/latest/dg/receiving-email-notifications-contents.html

// ---------------- Verdict ----------------
export class VerdictDto {
  @ApiProperty({ example: 'PASS', description: 'Verdict status' })
  @IsString()
  status: string;
}

// ---------------- Action ----------------
export class ActionDto {
  @ApiProperty({ example: 'SNS', description: 'Type of action performed' })
  @IsString()
  type: string;

  @ApiProperty({
    example: 'arn:aws:sns:us-east-1:123456789012:topic',
    description: 'SNS topic ARN',
  })
  @IsString()
  topicArn: string;
}

// ---------------- Header ----------------
export class HeaderDto {
  @ApiProperty({ example: 'Content-Type', description: 'Name of the header' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'text/plain; charset=UTF-8',
    description: 'Value of the header',
  })
  @IsString()
  value: string;
}

// ---------------- CommonHeaders ----------------
export class CommonHeadersDto {
  @ApiProperty({
    example: 'noreply@example.com',
    description: 'Return path address',
  })
  @IsString()
  returnPath: string;

  @ApiProperty({
    example: ['sender@example.com'],
    description: 'Sender email list',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  from: string[];

  @ApiProperty({
    example: 'Tue, 5 Jan 2024 12:34:56 +0000',
    description: 'Date of the email',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: ['recipient@example.com'],
    description: 'Recipient list',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  to: string[];

  @ApiProperty({
    example: ['cc@example.com'],
    description: 'CC list',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  cc: string[];

  @ApiProperty({
    example: '<1234@example.com>',
    description: 'Email message ID',
  })
  @IsString()
  messageId: string;

  @ApiProperty({ example: 'Test Email', description: 'Email subject' })
  @IsString()
  subject: string;
}

// ---------------- Mail ----------------
export class MailDto {
  @ApiProperty({
    example: '2024-01-05T12:34:56Z',
    description: 'Timestamp of email',
  })
  @Type(() => Date)
  @IsDate()
  timestamp: Date;

  @ApiProperty({
    example: 'sender@example.com',
    description: 'Source email address',
  })
  @IsString()
  source: string;

  @ApiProperty({ example: '<1234@example.com>', description: 'Message ID' })
  @IsString()
  messageId: string;

  @ApiProperty({
    example: ['recipient@example.com'],
    description: 'Destination emails',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  destination: string[];

  @ApiProperty({
    example: false,
    description: 'Whether headers were truncated',
  })
  @IsBoolean()
  headersTruncated: boolean;

  @ApiProperty({ type: () => [HeaderDto], description: 'Email headers' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeaderDto)
  headers: HeaderDto[];

  @ApiProperty({
    type: () => CommonHeadersDto,
    description: 'Parsed common headers',
  })
  @ValidateNested()
  @Type(() => CommonHeadersDto)
  commonHeaders: CommonHeadersDto;
}

// ---------------- Receipt ----------------
export class ReceiptDto {
  @ApiProperty({
    example: '2024-01-05T12:34:56Z',
    description: 'Timestamp of receipt',
  })
  @Type(() => Date)
  @IsDate()
  timestamp: Date;

  @ApiProperty({ example: 500, description: 'Processing time in milliseconds' })
  @IsNumber()
  processingTimeMillis: number;

  @ApiProperty({
    example: ['recipient@example.com'],
    description: 'Recipient list',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ApiProperty({ type: () => VerdictDto, description: 'Spam verdict' })
  @ValidateNested()
  @Type(() => VerdictDto)
  spamVerdict: VerdictDto;

  @ApiProperty({ type: () => VerdictDto, description: 'Virus verdict' })
  @ValidateNested()
  @Type(() => VerdictDto)
  virusVerdict: VerdictDto;

  @ApiProperty({ type: () => VerdictDto, description: 'SPF verdict' })
  @ValidateNested()
  @Type(() => VerdictDto)
  spfVerdict: VerdictDto;

  @ApiProperty({ type: () => VerdictDto, description: 'DKIM verdict' })
  @ValidateNested()
  @Type(() => VerdictDto)
  dkimVerdict: VerdictDto;

  @ApiProperty({ type: () => VerdictDto, description: 'DMARC verdict' })
  @ValidateNested()
  @Type(() => VerdictDto)
  dmarcVerdict: VerdictDto;

  @ApiProperty({
    example: 'reject',
    description: 'DMARC policy (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  dmarcPolicy: string;

  @ApiProperty({ type: () => ActionDto, description: 'Action taken by SES' })
  @ValidateNested()
  @Type(() => ActionDto)
  action: ActionDto;
}

// ---------------- Ses ----------------
export class SesDto {
  @ApiProperty({ type: () => ReceiptDto, description: 'SES receipt data' })
  @ValidateNested()
  @Type(() => ReceiptDto)
  receipt: ReceiptDto;

  @ApiProperty({ type: () => MailDto, description: 'SES mail data' })
  @ValidateNested()
  @Type(() => MailDto)
  mail: MailDto;
}

// ---------------- Record ----------------
export class RecordDto {
  @ApiProperty({ example: '1.0', description: 'Event version' })
  @IsString()
  eventVersion: string;

  @ApiProperty({ type: () => SesDto, description: 'SES event data' })
  @ValidateNested()
  @Type(() => SesDto)
  ses: SesDto;

  @ApiProperty({ example: 'aws:ses', description: 'Event source' })
  @IsString()
  eventSource: string;
}

// ---------------- SesEvent ----------------
export class SesEventDto {
  @ApiProperty({
    type: () => [RecordDto],
    description: 'List of SES event records',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecordDto)
  Records: RecordDto[];
}
