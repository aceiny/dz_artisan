import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

enum UserRole{
  client = 'client',
  artisan = 'artisan',
}
export class SignupUserDto {
  @ApiProperty({
    description: 'full name of the user',
    type: String,
    required: true,
    example: 'Yacine Zeraibi',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;


  @ApiProperty({
    description: 'email of the user',
    type: String,
    required: true,
    example: 'yzeraibi2000@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password of the user',
    type: String,
    required: true,
    example: 'Yacine@123',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'role of the user',
    type: String,
    required: true,
    example: 'client',
  })
  @IsEnum(UserRole)
  role: UserRole;
  
}
