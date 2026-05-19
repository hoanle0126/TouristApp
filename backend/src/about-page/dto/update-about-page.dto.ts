import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AboutCuratorDto {
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsString()
  bio: string;

  @IsString()
  image: string;

  @IsString()
  alt: string;
}

export class AboutPhilosophyPillarDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsIn(['nature', 'sparkle', 'leaf'])
  icon: 'nature' | 'sparkle' | 'leaf';
}

export class UpdateAboutPageDto {
  @IsString()
  heroImage: string;

  @IsString()
  heroAlt: string;

  @IsString()
  heroTitle: string;

  @IsString()
  heroSubtitle: string;

  @IsString()
  storyImage: string;

  @IsString()
  storyAlt: string;

  @IsString()
  storyHeading: string;

  @IsArray()
  @IsString({ each: true })
  storyBody: string[];

  @IsString()
  storyCtaLabel: string;

  @IsString()
  mission: string;

  @IsString()
  vision: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AboutCuratorDto)
  curators: AboutCuratorDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AboutPhilosophyPillarDto)
  philosophy: AboutPhilosophyPillarDto[];

  @IsString()
  cta: string;

  @IsString()
  ctaButtonLabel: string;
}
