import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignupUserDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsPhoneNumber('DZ')
  phone_number: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  wilaya: string;
}
