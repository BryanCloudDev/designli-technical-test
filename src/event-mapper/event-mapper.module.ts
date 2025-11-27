import { Module } from '@nestjs/common';

import { EventMapperController } from './event-mapper.controller';
import { EventProcessed } from './entities/event-mapper.entity';
import { EventMapperService } from './event-mapper.service';

@Module({
  controllers: [EventMapperController],
  providers: [EventMapperService, EventProcessed],
})
export class EventMapperModule {}
