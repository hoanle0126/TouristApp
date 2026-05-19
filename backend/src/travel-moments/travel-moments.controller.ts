import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTravelMomentDto } from './dto/create-travel-moment.dto';
import { UpdateTravelMomentDto } from './dto/update-travel-moment.dto';
import { TravelMomentsService } from './travel-moments.service';

@Controller('travel-moments')
export class TravelMomentsController {
  constructor(private readonly travelMomentsService: TravelMomentsService) {}

  @Get()
  findAll() {
    return this.travelMomentsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTravelMomentDto) {
    return this.travelMomentsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTravelMomentDto) {
    return this.travelMomentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.travelMomentsService.remove(id);
  }
}
