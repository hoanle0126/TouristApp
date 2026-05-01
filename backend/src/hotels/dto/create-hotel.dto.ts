import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
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

  @IsNumber()
  @Min(0)
  @Max(10)
  score: number;

  @IsString()
  scoreLabel: string;

  @IsString()
  scoreSummary: string;

  @IsIn(['draft', 'published', 'archived'])
  status: 'draft' | 'published' | 'archived';

  @IsString()
  listingImage: string;

  @IsString()
  listingAlt: string;

  @IsString()
  heroImage: string;

  @IsString()
  heroAlt: string;

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
    alt: string;
  }>;

  @IsArray()
  gallery: Array<{ image: string; alt: string }>;

  @IsArray()
  reviewScores: Array<{ label: string; score: number }>;

  @IsArray()
  reviews: Array<{
    author: string;
    initials: string;
    quote: string;
    stayed: string;
  }>;

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
