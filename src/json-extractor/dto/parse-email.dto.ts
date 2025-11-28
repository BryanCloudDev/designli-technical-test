import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParseEmailDto {
  @ApiProperty({
    description: 'The name of the email file to parse (must end with .eml)',
    example: 'email-with-json-link.eml',
  })
  @IsString()
  @Matches(/.*\.eml$/, {
    message: 'File must have .eml extension',
  })
  file: string;
}
