import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  badge: string;

  @IsString()
  date: string;

  @IsString()
  location: string;

  @IsString()
  description: string;

  @IsString()
  href: string;

  @IsString()
  image: string;

  @IsString()
  alt: string;

  @IsInt()
  @Min(0)
  sortOrder: number;

  @IsBoolean()
  @IsOptional()
  isPopup?: boolean;
}
