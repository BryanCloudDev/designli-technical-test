import { Injectable } from '@nestjs/common';

import { SesEventDto } from './dto/create-event-mapper.dto';

@Injectable()
export class EventMapperService {
  create(createEventMapperDto: SesEventDto) {
    return createEventMapperDto;
  }
}
