import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsString, IsUrl } from 'class-validator';

export class CreateCertificationDto {
  @ApiProperty({
    example: 'Certified Python Developer',
    description: 'The name of the certification',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Issued by the Python Software Foundation',
    description: 'The issuing authority of the certification',
    required: true,
  })
  @IsString()
  issuing_authority: string;

  @ApiProperty({
    example: '2021-01-01',
    description: 'The date the certification was issued',
    required: true,
  })
  @IsDateString()
  issue_date: string;

  @ApiProperty({
    example: '2023-01-01',
    description: 'The date the certification expires',
    required: true,
  })
  @IsDateString()
  expiry_date: string;

  @ApiProperty({
    example: 'https://www.coursera.org/',
    description: 'The URL to the certification document',
    required: true,
  })
  @IsUrl()
  document_url: string;
}
