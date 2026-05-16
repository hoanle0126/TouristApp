import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSiteContentSettingsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  siteName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  siteTagline?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  siteDescription?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  hotline?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  topBarNote?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  promoLabel?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  promoCta?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  promoHref?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  homeHeroImage?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  heroImageTwo?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  heroImageThree?: string;
}
