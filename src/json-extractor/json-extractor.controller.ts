import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JsonExtractorService } from './services/json-extractor.service';

@ApiTags('JSON Extractor')
@Controller('json-extractor')
export class JsonExtractorController {
  constructor(private readonly jsonExtractorService: JsonExtractorService) {}

  @Get()
  @ApiOperation({
    summary: 'Parse email file',
    description: 'Extracts JSON content from a specified email file',
  })
  @ApiQuery({
    name: 'file',
    required: true,
    type: String,
    description: 'The name of the email file to parse',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    schema: {
      type: 'object',
      description: 'The extracted JSON content from the email file',
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  parseEmail(@Query('file') query: string) {
    return this.jsonExtractorService.parseEmail(query);
  }
}
