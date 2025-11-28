import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JsonExtractorService } from './services/json-extractor.service';
import { ParseEmailDto } from './dto/parse-email.dto';
import { MappedSesEvent } from 'src/event-mapper/dto/response-event-mapper.dto';

@ApiTags('JSON Extractor')
@Controller('json-extractor')
export class JsonExtractorController {
  constructor(private readonly jsonExtractorService: JsonExtractorService) {}

  @Get()
  @ApiOperation({
    summary: 'Parse email file',
    description: 'Extracts JSON content from a specified email file',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: MappedSesEvent,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  parseEmail(@Query() query: ParseEmailDto) {
    return this.jsonExtractorService.parseEmail(query.file);
  }
}
