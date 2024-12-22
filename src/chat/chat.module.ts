import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports : [DatabaseService],
  providers: [ChatService],
})
export class ChatModule {}
