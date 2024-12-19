import { IsEmail, IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  text: string;

  @IsJSON()
  data: {
    name?: string;
    email?: string;
    phone_number?: string;
    date?: string;
    device?: string;
    location?: string | string[];
    ip_address?: string | string[];
  };
}
