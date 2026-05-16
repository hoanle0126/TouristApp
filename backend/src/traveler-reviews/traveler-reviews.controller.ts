import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTravelerReviewDto } from './dto/create-traveler-review.dto';
import { UpdateTravelerReviewDto } from './dto/update-traveler-review.dto';
import { TravelerReviewsService } from './traveler-reviews.service';

@Controller('traveler-reviews')
export class TravelerReviewsController {
  constructor(
    private readonly travelerReviewsService: TravelerReviewsService,
  ) {}

  @Get()
  findAll() {
    return this.travelerReviewsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTravelerReviewDto) {
    return this.travelerReviewsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTravelerReviewDto) {
    return this.travelerReviewsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.travelerReviewsService.remove(id);
  }
}
