import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  completion_date: Date;
}
