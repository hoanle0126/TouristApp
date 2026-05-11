import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMomentCapturedDto } from './dto/create-moment-captured.dto';
import { UpdateMomentCapturedDto } from './dto/update-moment-captured.dto';
import { MomentsCapturedService } from './moments-captured.service';

@Controller('moments-captured')
export class MomentsCapturedController {
  constructor(
    private readonly momentsCapturedService: MomentsCapturedService,
  ) {}

  @Get()
  findAll() {
    return this.momentsCapturedService.findAll();
  }

  @Post()
  create(@Body() dto: CreateMomentCapturedDto) {
    return this.momentsCapturedService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMomentCapturedDto) {
    return this.momentsCapturedService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.momentsCapturedService.remove(id);
  }
}
