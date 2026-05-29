import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateDestinationDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsString()
  heroImage: string;

  @IsString()
  summary: string;

  @IsArray()
  intro: string[];

  @IsArray()
  facts: Array<{ label: string; value: string }>;

  @IsArray()
  spotlight: Array<{ title: string; description: string }>;

  @IsOptional()
  @IsArray()
  gallery?: Array<{ image: string }>;
}
