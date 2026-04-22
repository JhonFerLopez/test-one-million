import { IsString, IsEmail, IsNumber, IsOptional, MinLength, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeadDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  source!: string;

  @IsString()
  @IsOptional()
  productInterest?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  budget?: number;
}
