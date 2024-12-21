import { IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsUUID()
  user1: string;
  @IsUUID()
  user2: string;
}
