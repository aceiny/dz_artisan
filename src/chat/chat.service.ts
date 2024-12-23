import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { DatabaseService } from 'src/database/database.service';
import { jwtPayload } from 'src/auth/types/payload.type';

@Injectable()
export class ChatService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}
  async findChatByUser(user1: string, user2: string) {
    const query = `SELECT * FROM chats WHERE user1_id = '${user1}' AND user2_id = '${user2}' OR user1_id = '${user2}' AND user2_id = '${user1}'`;
    const chat = (await this.databaseService.query(query))[0];
    return chat;
  }
  async acessOrCreateChat(createChatDto: CreateChatDto , userId : string) {
    const chat = await this.findChatByUser(userId, createChatDto.user);
    if (chat) {
      return chat;
    }
    const query = `INSERT INTO chats (user1_id, user2_id) VALUES ('${userId}', '${createChatDto.user}') RETURNING *`;
    return (await this.databaseService.query(query))[0];
  }

  async findAllChatsByUser(userId : string) {
    const query = `SELECT * FROM chats WHERE user1_id = '${userId}' OR user2_id = '${userId}'`;
    return this.databaseService.query(query); 
  }

  async findOne(chatId : string , userId : string) {
    const query = `SELECT * FROM chats WHERE chat_id = '${chatId}' AND (user1_id = '${userId}' OR user2_id = '${userId}')`;

    const chat =  (await this.databaseService.query(query))[0];
    if(!chat){
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }
}
