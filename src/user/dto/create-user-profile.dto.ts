import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EmploymentStatus } from './user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserProfileDto {
  @ApiProperty({
    description: 'Username of the user',
    type: String,
    required: true,
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: "User's birthday",
    type: Date,
    required: true,
    example: '1990-01-01',
  })
  @IsDateString()
  birthday: Date;

  @ApiProperty({
    description: 'Employment status of the user',
    type: String,
    required: true,
    example: 'Employed',
  })
  @IsEnum(EmploymentStatus)
  employment_status: EmploymentStatus;

  @ApiProperty({
    description: 'Bio of the user',
    type: String,
    required: false,
    example: 'I am a software engineer',
  })
  @IsOptional()
  @IsString()
  bio: string;
}
