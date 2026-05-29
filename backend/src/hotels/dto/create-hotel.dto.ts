import {
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHotelDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  address: string;

  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  badge?: string;

  @IsIn(['draft', 'published', 'archived'])
  status: 'draft' | 'published' | 'archived';

  @IsString()
  listingImage: string;

  @IsString()
  heroImage: string;

  @IsArray()
  description: string[];

  @IsArray()
  amenities: Array<string | { icon?: string; title: string }>;

  @IsArray()
  suites: Array<{
    name: string;
    price: string;
    badge?: string;
    description: string;
    image: string;
  }>;

  @IsArray()
  gallery: Array<{ image: string }>;

  @IsObject()
  booking: {
    checkIn: string;
    checkOut: string;
    fee: string;
    nightlyTotal: string;
    nights: number;
    rating: number;
    travelers: string;
    total: string;
  };

  @IsOptional()
  @IsArray()
  destinationSlugs?: string[];

  @IsOptional()
  @IsArray()
  tourSlugs?: string[];
}
