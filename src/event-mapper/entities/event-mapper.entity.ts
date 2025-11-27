import { Injectable } from '@nestjs/common';

import { MappedSesEvent } from '../dto/response-event-mapper.dto';
import { SesEventDto } from '../dto/create-event-mapper.dto';
import { VerdictStatus } from '../enum/verdict-status.enum';
import { monthsOfYearMap } from '../helpers/date.helpers';

@Injectable()
export class EventProcessed {
  fromSesRecord(sesRecord: SesEventDto): MappedSesEvent[] {
    const mappedEvents: MappedSesEvent[] = [];

    sesRecord.Records.forEach((record) => {
      const spam = this.isVertictPass(record.ses.receipt.spamVerdict.status);
      const virus = this.isVertictPass(record.ses.receipt.virusVerdict.status);
      const dns =
        this.isVertictPass(record.ses.receipt.spfVerdict.status) &&
        this.isVertictPass(record.ses.receipt.dkimVerdict.status) &&
        this.isVertictPass(record.ses.receipt.dmarcVerdict.status);
      const mes =
        monthsOfYearMap[new Date(record.ses.mail.timestamp).getMonth()];
      const retrasado = record.ses.receipt.processingTimeMillis > 1000;
      const emisor = record.ses.mail.source.split('@')[0];
      const receptor = record.ses.mail.destination.map(
        (dest) => dest.split('@')[0],
      );

      mappedEvents.push({
        spam,
        virus,
        dns,
        mes,
        retrasado,
        emisor,
        receptor,
      });
    });

    return mappedEvents;
  }

  private isVertictPass = (verdictStatus: VerdictStatus): boolean => {
    return verdictStatus === VerdictStatus.PASS;
  };
}
