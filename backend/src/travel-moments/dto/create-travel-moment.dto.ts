import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateTravelMomentDto {
  @IsString()
  image: string;

  @IsString()
  alt: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsInt()
  @Min(0)
  sortOrder: number;
}
