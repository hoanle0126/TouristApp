import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class HotelInventoryInputDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsDateString()
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
