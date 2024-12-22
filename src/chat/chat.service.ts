import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}
  async findChatByUser(user1: string, user2: string) {
    const query = `SELECT * FROM chat WHERE user1_id = '${user1}' AND user2_id = '${user2}' OR user1_id = '${user2}' AND user2_id = '${user1}'`;
    const chat = (await this.databaseService.query(query))[0];
    return chat;
  }
  async acessOrCreateChat(createChatDto: CreateChatDto) {
    const chat = await this.findChatByUser(createChatDto.user1, createChatDto.user2);
    if (chat) {
      return chat;
    }
    const query = `INSERT INTO chat (user1_id, user2_id) VALUES ('${createChatDto.user1}', ${createChatDto.user2})`;
    return this.databaseService.query(query);
  }

  async findAllChatsByUser(user : string) {
    const query = `SELECT * FROM chat WHERE user1_id = '${user}' OR user2_id = '${user}'`;
    return this.databaseService.query(query); 
  }

  async findOne(chatId : string) {
    const query = `SELECT * FROM chat WHERE id = '${chatId}'`;
    const chat =  (await this.databaseService.query(query))[0];
    if(!chat){
      return {message : "Chat not found"};
    }
    return chat;
  }
}
