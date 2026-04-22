import { IsString, IsEmail, IsNumber, IsOptional, MinLength, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLeadDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  productInterest?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  budget?: number;
}
