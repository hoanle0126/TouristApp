import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MomentsCapturedController } from './moments-captured.controller';
import { MomentsCapturedService } from './moments-captured.service';

@Module({
  imports: [PrismaModule],
  controllers: [MomentsCapturedController],
  providers: [MomentsCapturedService],
})
export class MomentsCapturedModule {}
