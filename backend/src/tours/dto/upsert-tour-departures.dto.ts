import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString, Matches, Min, ValidateNested } from 'class-validator';

export class TourDepartureInputDto {
  @IsOptional()
  @IsString()
  id?: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
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
