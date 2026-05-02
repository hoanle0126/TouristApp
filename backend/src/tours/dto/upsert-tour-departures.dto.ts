import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class TourDepartureInputDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsDateString()
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
