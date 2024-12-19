import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SigninUserDto {
  @ApiProperty({
    description: 'Email of the user',
    type: String,
    required: true,
    example: 'yzeraibi2000@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Email of the user',
    type: String,
    required: true,
    example: 'yzeraibi2000@gmail.com',
  })
  @IsStrongPassword()
  password: string;
}
