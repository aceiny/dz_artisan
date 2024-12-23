import { IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsUUID()
  user: string;
}
