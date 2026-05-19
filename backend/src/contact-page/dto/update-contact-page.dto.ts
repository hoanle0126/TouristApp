import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ContactOfficeDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  address: string[];
}

export class ContactDepartmentDto {
  @IsString()
  name: string;

  @IsString()
  email: string;
}

export class UpdateContactPageDto {
  @IsString()
  heroTitle: string;

  @IsString()
  heroSubtitle: string;

  @IsString()
  formTitle: string;

  @IsString()
  formSubtitle: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactOfficeDto)
  offices: ContactOfficeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDepartmentDto)
  departments: ContactDepartmentDto[];

  @IsString()
  mapImage: string;

  @IsString()
  mapAlt: string;

  @IsString()
  mapTitle: string;

  @IsString()
  mapNote: string;
}
