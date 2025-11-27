import { Injectable } from '@nestjs/common';

import { MappedSesEvent } from './dto/response-event-mapper.dto';
import { EventProcessed } from './entities/event-mapper.entity';
import { SesEventDto } from './dto/create-event-mapper.dto';

@Injectable()
export class EventMapperService {
  constructor(readonly eventProcessedEntity: EventProcessed) {}

  create(createEventMapperDto: SesEventDto): MappedSesEvent[] {
    const response =
      this.eventProcessedEntity.fromSesRecord(createEventMapperDto);

    return response;
  }
}
