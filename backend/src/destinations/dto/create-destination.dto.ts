import { IsArray, IsIn, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateDestinationDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  href: string;

  @IsString()
  image: string;

  @IsString()
  alt: string;

  @IsString()
  price: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  market: string;

  @IsIn(['draft', 'published', 'archived'])
  status: 'draft' | 'published' | 'archived';

  @IsString()
  heroImage: string;

  @IsString()
  heroAlt: string;

  @IsString()
  summary: string;

  @IsArray()
  intro: string[];

  @IsArray()
  facts: Array<{ label: string; value: string }>;

  @IsArray()
  spotlight: Array<{ title: string; description: string }>;

  @IsArray()
  relatedTours: Array<{
    href: string;
    label: string;
    meta: string;
    title: string;
  }>;

  @IsArray()
  relatedHotels: Array<{
    href: string;
    label: string;
    meta: string;
    title: string;
  }>;
}
