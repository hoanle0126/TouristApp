import {
  IsArray,
  IsDateString,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  excerpt: string;

  @IsString()
  category: string;

  @IsString()
  author: string;

  @IsIn(['draft', 'published', 'archived'])
  status: 'draft' | 'published' | 'archived';

  @IsDateString()
  publishedAt: string;

  @IsString()
  readingTime: string;

  @IsString()
  image: string;

  @IsString()
  alt: string;

  @IsString()
  heroImage: string;

  @IsString()
  heroAlt: string;

  @IsString()
  intro: string;

  @IsString()
  meta: string;

  @IsString()
  quote: string;

  @IsArray()
  sections: Array<{ heading?: string; body: string[] }>;

  @IsObject()
  inlineImage: { image: string; alt: string };

  @IsObject()
  secondaryFeature: {
    title: string;
    body: string;
    image: { image: string; alt: string };
  };

  @IsArray()
  relatedPosts: Array<{
    href: string;
    title: string;
    excerpt: string;
    category: string;
    image: string;
    alt: string;
  }>;

  @IsObject()
  seo: { title?: string; description?: string; ogImage?: string };

  @IsOptional()
  @IsArray()
  mentionedDestinationSlugs?: string[];

  @IsOptional()
  @IsArray()
  mentionedTourSlugs?: string[];

  @IsOptional()
  @IsArray()
  mentionedHotelSlugs?: string[];
}
