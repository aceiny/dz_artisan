import { Test, TestingModule } from '@nestjs/testing';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

describe('MessageGateway', () => {
  let gateway: MessageGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageGateway, MessageService],
    }).compile();

    gateway = module.get<MessageGateway>(MessageGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
