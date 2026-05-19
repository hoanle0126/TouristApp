import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContactPageController } from './contact-page.controller';
import { ContactPageService } from './contact-page.service';

@Module({
  imports: [PrismaModule],
  controllers: [ContactPageController],
  providers: [ContactPageService],
})
export class ContactPageModule {}
