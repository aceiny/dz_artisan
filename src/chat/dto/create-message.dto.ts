import { IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  chat: string;
  @IsString()
  content: string;
}
