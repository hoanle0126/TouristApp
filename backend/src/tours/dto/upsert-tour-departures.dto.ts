import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { IsValidDateOnly } from './is-valid-date-only.validator';

export class TourDepartureInputDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsValidDateOnly()
  date: string;

  @IsInt()
  @Min(0)
  capacity: number;

  @IsIn(['open', 'closed'])
  status: 'open' | 'closed';
}

export class UpsertTourDeparturesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourDepartureInputDto)
  departures: TourDepartureInputDto[];
}
