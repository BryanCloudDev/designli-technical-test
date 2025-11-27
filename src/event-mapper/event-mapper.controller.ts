import { Controller, Post, Body } from '@nestjs/common';

import { CreateEventMapperDto } from './dto/create-event-mapper.dto';
import { EventMapperService } from './event-mapper.service';

@Controller('event-mapper')
export class EventMapperController {
  constructor(private readonly eventMapperService: EventMapperService) {}

  @Post()
  create(@Body() createEventMapperDto: CreateEventMapperDto) {
    return this.eventMapperService.create(createEventMapperDto);
  }
}
