import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { DatabaseService } from 'src/database/database.service';
import { ChatController } from './chat.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
