import { Test, TestingModule } from '@nestjs/testing';
import { EventMapperController } from './event-mapper.controller';
import { EventMapperService } from './event-mapper.service';

describe('EventMapperController', () => {
  let controller: EventMapperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventMapperController],
      providers: [EventMapperService],
    }).compile();

    controller = module.get<EventMapperController>(EventMapperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
