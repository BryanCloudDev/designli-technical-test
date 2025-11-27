import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';

import { MappedSesEvent } from './dto/response-event-mapper.dto';
import { EventMapperService } from './event-mapper.service';
import { SesEventDto } from './dto/create-event-mapper.dto';

@ApiTags('Event Mapper')
@Controller('event-mapper')
export class EventMapperController {
  constructor(private readonly eventMapperService: EventMapperService) {}

  @Post()
  @ApiOperation({
    summary: 'Map and process an SES inbound email event',
    description:
      'Receives an AWS SES inbound email event (SNS-style payload) and processes it to return a mapped or transformed structure.',
  })
  @ApiBody({
    description: 'SES inbound email event payload',
    type: SesEventDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Event processed successfully.',
    type: MappedSesEvent,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed for the provided SES event payload.',
  })
  create(@Body() sesEventDto: SesEventDto): MappedSesEvent[] {
    return this.eventMapperService.create(sesEventDto);
  }
}
