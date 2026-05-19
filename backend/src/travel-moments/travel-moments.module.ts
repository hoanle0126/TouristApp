import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TravelMomentsController } from './travel-moments.controller';
import { TravelMomentsService } from './travel-moments.service';

@Module({
  imports: [PrismaModule],
  controllers: [TravelMomentsController],
  providers: [TravelMomentsService],
})
export class TravelMomentsModule {}
