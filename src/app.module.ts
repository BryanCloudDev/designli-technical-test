import { Module } from '@nestjs/common';

import { JsonExtractorModule } from './json-extractor/json-extractor.module';
import { EventMapperModule } from './event-mapper/event-mapper.module';

@Module({
  imports: [EventMapperModule, JsonExtractorModule],
})
export class AppModule {}
