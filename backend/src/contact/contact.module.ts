import { Module } from '@nestjs/common';

import { MailModule } from '../mail/mail.module';
import { SettingsModule } from '../settings/settings.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [MailModule, SettingsModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
