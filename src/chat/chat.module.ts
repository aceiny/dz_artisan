import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { DatabaseService } from 'src/database/database.service';
import { ChatController } from './chat.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports : [DatabaseModule , AuthModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
