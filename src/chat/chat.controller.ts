import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateChatDto } from './dto/create-chat.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/dto/user.schema';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: 'Acess or create a chat',
    description:
      'This endpoint is used to acess or create a chat between two users. If the chat already exists, it will return the chat, otherwise it will create a new chat and return it.',
  })
  @Post('')
  @UseGuards(JwtAuthGuard)
  async acessOrCreateChat(
    @GetUser() user: User,
    @Body() createChatDto: CreateChatDto,
  ) {
    const data = await this.chatService.acessOrCreateChat(
      createChatDto,
      user.user_id,
    );
    return {
      message: 'Chat acessed or created',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Get all chats by user',
    description: 'This endpoint is used to get all chats of a user.',
  })
  @Get('')
  @UseGuards(JwtAuthGuard)
  async findAllChatsByUser(@GetUser() user: User) {
    const data = await this.chatService.findAllChatsByUser(user.user_id);
    return {
      message: 'Chats found',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Get chat by id',
    description: 'This endpoint is used to get a chat by its id.',
    responses: {
      200: {
        description: 'Chat found',
      },
      '404': {
        description: 'Chat not found',
      },
    },
  })
  @Get('/:chatId')
  @UseGuards(JwtAuthGuard)
  async findOne(@GetUser() user: User, @Param('chatId') chatId: string) {
    const data = await this.chatService.findOne(chatId, user.user_id);
    return {
      message: 'Chat found',
      status: HttpStatus.OK,
      data,
    };
  }
}
