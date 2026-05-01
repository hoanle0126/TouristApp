import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  findAll(
    @Query('email') email?: string,
    @Query('status') status?: string,
    @Query('payment_status') paymentStatus?: string,
    @Query('per_page') perPage?: string,
  ) {
    return this.bookingsService.findAll({
      email,
      status,
      paymentStatus,
      perPage: this.parsePerPage(perPage),
    });
  }

  @Get(':bookingCode')
  findOne(@Param('bookingCode') bookingCode: string) {
    return this.bookingsService.findOne(bookingCode);
  }

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Patch(':bookingCode/status')
  updateStatus(
    @Param('bookingCode') bookingCode: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(bookingCode, dto);
  }

  private parsePerPage(perPage?: string) {
    if (!perPage) {
      return undefined;
    }

    const parsed = Number(perPage);

    if (!Number.isInteger(parsed) || parsed < 1) {
      return undefined;
    }

    return Math.min(parsed, 50);
  }
}
