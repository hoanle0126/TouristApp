import { IsInt, IsString, Min } from 'class-validator';

export class CreateTravelerReviewDto {
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsString()
  trip: string;

  @IsString()
  quote: string;

  @IsInt()
  @Min(0)
  sortOrder: number;
}
