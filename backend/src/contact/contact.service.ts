import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { MailService } from '../mail/mail.service';
import { SettingsService } from '../settings/settings.service';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly mailService: MailService,
    private readonly settingsService: SettingsService,
  ) {}

  async handleInquiry(dto: CreateContactInquiryDto) {
    const siteContent = await this.settingsService.getSiteContentSettings();
    const recipient = siteContent.contactEmail.trim();

    if (!recipient) {
      throw new InternalServerErrorException(
        'Contact email is not configured.',
      );
    }

    await this.mailService.sendContactInquiryToAdmin(
      {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        message: dto.message,
        desiredDestination: dto.desiredDestination,
        primaryInterest: dto.primaryInterest,
        source: dto.source,
      },
      recipient,
    );
  }
}
