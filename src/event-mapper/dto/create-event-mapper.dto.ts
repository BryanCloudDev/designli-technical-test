import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ---------------- Verdict ----------------

export class VerdictDto {
  @IsString()
  status: string;
}

// ---------------- Action ----------------

export class ActionDto {
  @IsString()
  type: string;

  @IsString()
  topicArn: string;
}

// ---------------- Header ----------------

export class HeaderDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

// ---------------- CommonHeaders ----------------

export class CommonHeadersDto {
  @IsString()
  returnPath: string;

  @IsArray()
  @IsString({ each: true })
  from: string[];

  @IsString()
  date: string;

  @IsArray()
  @IsString({ each: true })
  to: string[];

  @IsArray()
  @IsString({ each: true })
  cc: string[];

  @IsString()
  messageId: string;

  @IsString()
  subject: string;
}

// ---------------- Mail ----------------

export class MailDto {
  @Type(() => Date)
  @IsDate()
  timestamp: Date;

  @IsString()
  source: string;

  @IsString()
  messageId: string;

  @IsArray()
  @IsString({ each: true })
  destination: string[];

  @IsBoolean()
  headersTruncated: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeaderDto)
  headers: HeaderDto[];

  @ValidateNested()
  @Type(() => CommonHeadersDto)
  commonHeaders: CommonHeadersDto;
}

// ---------------- Receipt ----------------

export class ReceiptDto {
  @Type(() => Date)
  @IsDate()
  timestamp: Date;

  @IsNumber()
  processingTimeMillis: number;

  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ValidateNested()
  @Type(() => VerdictDto)
  spamVerdict: VerdictDto;

  @ValidateNested()
  @Type(() => VerdictDto)
  virusVerdict: VerdictDto;

  @ValidateNested()
  @Type(() => VerdictDto)
  spfVerdict: VerdictDto;

  @ValidateNested()
  @Type(() => VerdictDto)
  dkimVerdict: VerdictDto;

  @ValidateNested()
  @Type(() => VerdictDto)
  dmarcVerdict: VerdictDto;

  @IsString()
  @IsOptional()
  dmarcPolicy: string;

  @ValidateNested()
  @Type(() => ActionDto)
  action: ActionDto;
}

// ---------------- Ses ----------------

export class SesDto {
  @ValidateNested()
  @Type(() => ReceiptDto)
  receipt: ReceiptDto;

  @ValidateNested()
  @Type(() => MailDto)
  mail: MailDto;
}

// ---------------- Record ----------------

export class RecordDto {
  @IsString()
  eventVersion: string;

  @ValidateNested()
  @Type(() => SesDto)
  ses: SesDto;

  @IsString()
  eventSource: string;
}

// ---------------- SesEvent ----------------

export class SesEventDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecordDto)
  Records: RecordDto[];
}
