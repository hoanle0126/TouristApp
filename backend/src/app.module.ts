import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { BookingsModule } from './bookings/bookings.module';
import { DestinationsModule } from './destinations/destinations.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { HotelsModule } from './hotels/hotels.module';
import { EventsModule } from './events/events.module';
import { PartnersModule } from './partners/partners.module';
import { PrismaModule } from './prisma/prisma.module';
import { SettingsModule } from './settings/settings.module';
import { TravelerReviewsModule } from './traveler-reviews/traveler-reviews.module';
import { ToursModule } from './tours/tours.module';

@Module({
  imports: [
    PrismaModule,
    ToursModule,
    DestinationsModule,
    HotelsModule,
    EventsModule,
    PartnersModule,
    TravelerReviewsModule,
    BlogsModule,
    BookingsModule,
    ChatbotModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
