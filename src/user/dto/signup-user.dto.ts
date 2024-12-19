import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

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
    description: 'phone number of the user',
    type: String,
    required: true,
    example: '+213555555555',
  })
  @IsPhoneNumber('DZ')
  phone_number: string;

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
    description: 'address of the user',
    type: String,
    required: true,
    example: 'Cité 1000 logements',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'wilaya of the user',
    type: String,
    required: true,
    example: 'Oran',
  })
  @IsString()
  wilaya: string;
}
