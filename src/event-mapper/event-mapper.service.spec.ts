import { Test, TestingModule } from '@nestjs/testing';
import { EventMapperService } from './event-mapper.service';

describe('EventMapperService', () => {
  let service: EventMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventMapperService],
    }).compile();

    service = module.get<EventMapperService>(EventMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
