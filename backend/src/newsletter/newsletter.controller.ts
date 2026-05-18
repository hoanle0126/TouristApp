import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { CreateNewsletterSubscriberDto } from './dto/create-newsletter-subscriber.dto';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter/subscribers')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  subscribe(@Body() dto: CreateNewsletterSubscriberDto) {
    return this.newsletterService.subscribe(dto);
  }

  @Get()
  findAll(@Query('q') query?: string) {
    return this.newsletterService.findAll(query);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsletterService.remove(id);
  }
}
