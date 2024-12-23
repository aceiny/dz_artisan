import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EmploymentStatus } from './user.schema';

export class CreateUserProfileDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsDateString()
  birthday: Date;

  @IsEnum(EmploymentStatus)
  employment_status: EmploymentStatus;

  @IsOptional()
  @IsString()
  bio: string;
}
