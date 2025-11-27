import { Module } from '@nestjs/common';

import { EventMapperModule } from './event-mapper/event-mapper.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [EventMapperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
