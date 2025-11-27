import { Injectable } from '@nestjs/common';

import { CreateEventMapperDto } from './dto/create-event-mapper.dto';

@Injectable()
export class EventMapperService {
  create(createEventMapperDto: CreateEventMapperDto) {
    return 'This action adds a new eventMapper';
  }
}
