import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString, Matches, Min, ValidateNested } from 'class-validator';

export class HotelInventoryInputDto {
  @IsOptional()
  @IsString()
  id?: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;

  @IsInt()
  @Min(0)
  totalRooms: number;

  @IsIn(['open', 'closed'])
  status: 'open' | 'closed';
}

export class UpsertHotelInventoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HotelInventoryInputDto)
  inventory: HotelInventoryInputDto[];
}
