import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateBookingItemDto {
  @IsIn(['tour', 'hotel'])
  itemType: 'tour' | 'hotel';

  @IsString()
  slug: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;

  @IsOptional()
  @IsString()
  tourDepartureId?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsDateString()
  checkIn?: string;

  @IsOptional()
  @IsDateString()
  checkOut?: string;

  @IsOptional()
  @IsString()
  guests?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  nights?: number;

  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @IsString()
  meta?: string;
}

export class CreateBookingDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsInt()
  @Min(1)
  travelers: number;

  @IsOptional()
  @IsString()
  primaryTravelerName?: string;

  @IsOptional()
  @IsEmail()
  primaryTravelerEmail?: string;

  @IsOptional()
  @IsString()
  primaryTravelerPhone?: string;

  @IsOptional()
  @IsObject()
  travelerDetails?: Prisma.InputJsonObject;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @IsOptional()
  @IsString()
  dropoffLocation?: string;

  @IsOptional()
  @IsString()
  arrivalFlight?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsString()
  internalNotes?: string;

  @IsIn(['credit-card', 'bank-transfer', 'apple-pay', 'cash'])
  paymentMethod: 'credit-card' | 'bank-transfer' | 'apple-pay' | 'cash';

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateBookingItemDto)
  items: CreateBookingItemDto[];
}
