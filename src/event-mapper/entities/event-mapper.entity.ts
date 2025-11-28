import { Injectable } from '@nestjs/common';

import { MappedSesEvent } from '../dto/response-event-mapper.dto';
import { SesEventDto } from '../dto/create-event-mapper.dto';
import { VerdictStatus } from '../enum/verdict-status.enum';
import { monthsOfYearMap } from '../helpers/date.helpers';

@Injectable()
export class EventProcessed {
  /**
   * Maps a SES event record to an array of simplified MappedSesEvent objects.
   *
   * For each record in the SES event:
   * - Checks if the message passes spam, virus, and DNS (SPF, DKIM, DMARC) verifications.
   * - Extracts the month of the email.
   * - Determines if processing was delayed (> 1000 ms).
   * - Extracts the sender (emisor) and recipients (receptor) usernames.
   *
   * @param {SesEventDto} sesRecord - The SES event DTO containing one or more email records.
   * @returns {MappedSesEvent[]} An array of mapped SES events with simplified properties:
   *  - spam: boolean indicating spam verdict
   *  - virus: boolean indicating virus verdict
   *  - dns: boolean indicating SPF, DKIM, and DMARC verification
   *  - mes: string representing the month of the email
   *  - retrasado: boolean indicating if processing was delayed
   *  - emisor: string username of the sender
   *  - receptor: string array of recipient usernames
   */
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

  /**
   * Checks if the given verdict status is a PASS.
   *
   * @param {VerdictStatus} verdictStatus - The verdict status to check.
   * @returns {boolean} - Returns true if the verdict status is PASS, otherwise false.
   */
  private isVertictPass = (verdictStatus: VerdictStatus): boolean => {
    return verdictStatus === VerdictStatus.PASS;
  };
}
