import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateQuoteDto {
    @IsUUID()
    request_id: string;
  
    @IsNumber()
    @Min(0)
    amount: number;
  
    @IsString()
    description: string;
  
    @IsNumber()
    @Min(1)
    validity_period: number;
  }
export class CreateQuoteRequestDto {
    @IsUUID()
    job_id: string;
  
    @IsOptional()
    @IsDateString()
    preferred_date?: Date;
  
    @IsOptional()
    @IsString()
    note?: string;
  }