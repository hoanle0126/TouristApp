import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TravelerReviewsController } from './traveler-reviews.controller';
import { TravelerReviewsService } from './traveler-reviews.service';

@Module({
  imports: [PrismaModule],
  controllers: [TravelerReviewsController],
  providers: [TravelerReviewsService],
})
export class TravelerReviewsModule {}
