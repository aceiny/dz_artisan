import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  private connectedClients: Map<string, string> = new Map(); // Maps client.id to userId

  // Handle connection and authentication
  async handleConnection(client: Socket) {
    try {
      // Verify JWT and extract userId
      const user = await this.chatService.authenticateClient(client);

      // Store userId in client data
      client.data.userId = user.id;
      this.connectedClients.set(client.id, user.id);

      // join user's rooms to get all new messsages in those rooms
      const user_chats = await this.chatService.findAllChatsByUser(user.id);
      user_chats.forEach((chat) => {
        client.join(chat.chat_id);
      });
    } catch (error) {
      console.error(`Unauthorized connection attempt: ${error.message}`);
      client.disconnect();
    }
  }

  // Handle disconnection
  handleDisconnect(client: Socket) {
    const userId = this.connectedClients.get(client.id);
    if (userId) {
      console.log(`Client disconnected: ${client.id} (User: ${userId})`);
      this.connectedClients.delete(client.id);
    }
  }
  @WebSocketServer()
  server;
  @SubscribeMessage('message')
  async handleMessage(client: any, payload: CreateMessageDto) {
    const userId = client.data.userId;
    if (!userId) throw new WsException('User not connected');

    //verifies that the user is part of the chat
    const chat = await this.chatService.findOne(payload.chat, userId);
    const message = await this.chatService.addMessage(
      payload.chat,
      payload.content,
      userId,
    );
    return this.server.to(payload.chat).emit('message', message);
  }
}
