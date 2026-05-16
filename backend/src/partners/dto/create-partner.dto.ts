import { IsInt, IsString, Min } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  sortOrder: number;
}
