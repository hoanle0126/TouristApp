import { IsBoolean, IsInt, IsString, Min } from 'class-validator';

export class CreateMomentCapturedDto {
  @IsString()
  title: string;

  @IsString()
  country: string;

  @IsString()
  image: string;

  @IsBoolean()
  wide: boolean;

  @IsInt()
  @Min(0)
  sortOrder: number;
}
