import { Module } from '@nestjs/common';

import { EventMapperController } from './event-mapper.controller';
import { EventMapperService } from './event-mapper.service';

@Module({
  controllers: [EventMapperController],
  providers: [EventMapperService],
})
export class EventMapperModule {}
