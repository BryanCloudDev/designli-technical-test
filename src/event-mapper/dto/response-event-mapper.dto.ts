import { ApiProperty } from '@nestjs/swagger';

export class MappedSesEvent {
  @ApiProperty({
    description: 'True if spamVerdict.status === "PASS"',
    example: true,
  })
  spam: boolean;

  @ApiProperty({
    description: 'True if virusVerdict.status === "PASS"',
    example: true,
  })
  virus: boolean;

  @ApiProperty({
    description:
      'True if spfVerdict, dkimVerdict and dmarcVerdict all === "PASS"',
    example: true,
  })
  dns: boolean;

  @ApiProperty({
    description: 'Month name derived from mail.timestamp',
    example: 'January',
  })
  mes: string;

  @ApiProperty({
    description: 'True if processingTimeMillis > 1000',
    example: true,
  })
  retrasado: boolean;

  @ApiProperty({
    description: 'Sender username extracted from mail.source',
    example: 'john.doe',
  })
  emisor: string;

  @ApiProperty({
    description: 'Array of usernames extracted from mail.destination',
    example: ['alice', 'support', 'billing'],
  })
  receptor: string[];
}
