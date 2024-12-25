import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export enum JobType {
  ONE_TIME = 'one_time',
  CONTRACT = 'contract',
  TEMPORARY = 'temporary',
  VOLUNTEER = 'volunteer',
}
export class CreateJobDto {
  @ApiProperty({
    name: 'title of the job',
    description: 'Title of the job',
    example: 'i can make your website',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    name: 'description of the job',
    description: 'Description of the job',
    example: 'i can turn ur figma ui into a website',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    name: 'location of the job',
    description: 'Location of the job',
    example: 'Lagos, Nigeria',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    name: 'job type',
    description: 'Type of job',
    example: 'one_time',
  })
  @IsEnum(JobType)
  @IsString()
  job_type: JobType;

  @ApiProperty({
    name: 'min price of the job',
    description: ' Minimum price of the job ',
    example: 10000,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  minimum_price: number;

  @ApiProperty({
    name: 'estimated duration of the job',
    description: ' Estimated duration of the job ',
    example: '2 weeks',
  })
  @IsNotEmpty()
  @IsString()
  estimated_duration: string;

  @ApiProperty({
    name: 'tags for the job',
    description: 'Tags for the job comma separated',
    example: ['web design', 'figma', 'ui'],
  })
  @IsNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    name: 'attachments for the job',
    description: 'Attachments for the job like images or something',
  })
  @Type(() => Object)
  attachments?: Express.Multer.File[];
}
