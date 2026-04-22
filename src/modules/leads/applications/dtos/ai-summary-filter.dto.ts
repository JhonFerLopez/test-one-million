import { IsDateString, IsOptional, IsString } from 'class-validator';

export class AiSummaryFilterDto {
  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
