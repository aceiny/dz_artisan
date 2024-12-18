import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SigninUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
