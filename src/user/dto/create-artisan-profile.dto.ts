import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateArtisanProfileDto {
  @ApiProperty({
    description: 'Job title of the artisan',
    type: String,
    required: true,
    example: 'Software Engineer',
  })
  @IsString()
  @IsNotEmpty()
  job_title: string;

  @ApiProperty({
    description: "The artisan's years of experience",
    type: Number,
    required: true,
    example: 5,
  })
  @IsNumber()
  @IsPositive()
  years_experience: number;

  @ApiProperty({
    description: 'Profile picture of the artisan',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @Type(() => Object)
  cv_document: Express.Multer.File;
}
