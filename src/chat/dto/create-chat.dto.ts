import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateChatDto {

  @ApiProperty({
    description: 'User ID of the user',
    type: String,
    required: true,
    example: '123e4567-ee89-12d3-a456-426614174000',
  })
  @IsUUID()
  user: string;
}
