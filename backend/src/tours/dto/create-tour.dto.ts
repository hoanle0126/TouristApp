import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateTourDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsIn(['Featured', 'New'])
  badge?: 'Featured' | 'New';

  @IsString()
  type: string;

  @IsString()
  duration: string;

  @IsString()
  guests: string;

  @IsString()
  price: string;

  @IsString()
  availability: string;

  @IsArray()
  description: string[];

  @IsString()
  shortDescription: string;

  @IsString()
  image: string;

  @IsString()
  heroImage: string;

  @IsString()
  subtitle: string;

  @IsArray()
  highlights: Array<{
    icon:
      | 'boat'
      | 'fish'
      | 'food'
      | 'eco'
      | 'camera'
      | 'map'
      | 'mountain'
      | 'sparkles'
      | 'hotel'
      | 'walk'
      | 'coffee'
      | 'compass';
    title: string;
    description: string;
  }>;

  @IsArray()
  itinerary: Array<{ title: string; description: string }>;

  @IsArray()
  gallery: Array<{
    image: string;
    layout: 'portrait' | 'landscape';
  }>;

  @IsArray()
  inclusions: string[];

  @IsArray()
  exclusions: string[];

  @IsString()
  destinationSlug: string;
}
