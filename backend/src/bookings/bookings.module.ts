import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsModule } from '../settings/settings.module';
import { AiBookingSummaryService } from './ai-booking-summary.service';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [PrismaModule, MailModule, SettingsModule],
  controllers: [BookingsController],
  providers: [BookingsService, AiBookingSummaryService],
})
export class BookingsModule {}
