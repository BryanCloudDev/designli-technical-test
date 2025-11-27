import { Controller, Post, Body } from '@nestjs/common';

import { EventMapperService } from './event-mapper.service';
import { SesEventDto } from './dto/create-event-mapper.dto';

@Controller('event-mapper')
export class EventMapperController {
  constructor(private readonly eventMapperService: EventMapperService) {}

  @Post()
  create(@Body() sesEventDto: SesEventDto) {
    return this.eventMapperService.create(sesEventDto);
  }
}
