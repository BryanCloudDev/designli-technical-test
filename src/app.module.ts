import { Module } from '@nestjs/common';

import { JsonExtractorModule } from './json-extractor/json-extractor.module';
import { EventMapperModule } from './event-mapper/event-mapper.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [EventMapperModule, JsonExtractorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
