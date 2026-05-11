import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsValidDateOnly } from '../../tours/dto/is-valid-date-only.validator';

export class HotelInventoryInputDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsValidDateOnly()
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
