import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContactInquiryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  lastName: string;

  @IsEmail()
  @MaxLength(160)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  desiredDestination?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  primaryInterest?: string;

  @IsIn(['landing', 'contact-page'])
  source: 'landing' | 'contact-page';
}
