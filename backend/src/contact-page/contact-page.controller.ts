import { Body, Controller, Get, Put } from '@nestjs/common';
import { ContactPageService } from './contact-page.service';
import { UpdateContactPageDto } from './dto/update-contact-page.dto';

@Controller('contact-page')
export class ContactPageController {
  constructor(private readonly contactPageService: ContactPageService) {}

  @Get()
  get() {
    return this.contactPageService.get();
  }

  @Put()
  update(@Body() dto: UpdateContactPageDto) {
    return this.contactPageService.update(dto);
  }
}
