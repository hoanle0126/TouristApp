import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ContactService } from './contact.service';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('inquiries')
  @HttpCode(HttpStatus.ACCEPTED)
  async submitInquiry(@Body() dto: CreateContactInquiryDto) {
    await this.contactService.handleInquiry(dto);
    return { ok: true };
  }
}
