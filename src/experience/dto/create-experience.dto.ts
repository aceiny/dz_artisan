import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({
    description: 'Title of the experience',
    example: 'Software Developer',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'description',
    example: 'Developed software for Google company',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'completion_date',
    example: '2021-10-10',
  })
  @IsOptional()
  @IsDateString()
  completion_date: Date;
}
