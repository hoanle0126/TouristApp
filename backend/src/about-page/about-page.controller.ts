import { Body, Controller, Get, Put } from '@nestjs/common';
import { AboutPageService } from './about-page.service';
import { UpdateAboutPageDto } from './dto/update-about-page.dto';

@Controller('about-page')
export class AboutPageController {
  constructor(private readonly aboutPageService: AboutPageService) {}

  @Get()
  get() {
    return this.aboutPageService.get();
  }

  @Put()
  update(@Body() dto: UpdateAboutPageDto) {
    return this.aboutPageService.update(dto);
  }
}
