import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { UpsertHotelInventoryDto } from './dto/upsert-hotel-inventory.dto';
import { HotelsService } from './hotels.service';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  findAll(
    @Query('location') location?: string,
    @Query('destination') destination?: string,
    @Query('tour') tour?: string,
    @Query('search') search?: string,
    @Query('priceRange') priceRange?: string,
    @Query('per_page') perPage?: string,
  ) {
    return this.hotelsService.findAll({
      location,
      destination,
      tour,
      search,
      priceRange,
      perPage: this.parsePerPage(perPage),
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.hotelsService.findOne(slug);
  }

  @Post()
  create(@Body() dto: CreateHotelDto) {
    return this.hotelsService.create(dto);
  }

  @Patch(':slug/inventory')
  upsertInventory(
    @Param('slug') slug: string,
    @Body() dto: UpsertHotelInventoryDto,
  ) {
    return this.hotelsService.upsertInventory(slug, dto);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateHotelDto) {
    return this.hotelsService.update(slug, dto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.hotelsService.remove(slug);
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
