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
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { UpsertTourDeparturesDto } from './dto/upsert-tour-departures.dto';
import { ToursService } from './tours.service';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Get()
  findAll(
    @Query('destination') destination?: string,
    @Query('hotel') hotel?: string,
    @Query('type') type?: string,
    @Query('duration') duration?: string,
    @Query('search') search?: string,
    @Query('priceRange') priceRange?: string,
    @Query('per_page') perPage?: string,
  ) {
    return this.toursService.findAll({
      destination,
      duration,
      hotel,
      perPage: this.parsePerPage(perPage),
      search,
      priceRange,
      type,
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.toursService.findOne(slug);
  }

  @Post()
  create(@Body() dto: CreateTourDto) {
    return this.toursService.create(dto);
  }

  @Patch(':slug/departures')
  upsertDepartures(
    @Param('slug') slug: string,
    @Body() dto: UpsertTourDeparturesDto,
  ) {
    return this.toursService.upsertDepartures(slug, dto);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateTourDto) {
    return this.toursService.update(slug, dto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.toursService.remove(slug);
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
