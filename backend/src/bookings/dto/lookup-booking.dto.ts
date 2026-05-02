import { IsNotEmpty, IsString } from 'class-validator';

export class LookupBookingDto {
  @IsString()
  @IsNotEmpty()
  bookingCode!: string;

  @IsString()
  @IsNotEmpty()
  contact!: string;
}
