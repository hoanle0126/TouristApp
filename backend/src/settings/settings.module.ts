import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsController } from './settings.controller';
import { SettingsCryptoService } from './settings-crypto.service';
import { SettingsService } from './settings.service';

@Module({
  imports: [PrismaModule],
  controllers: [SettingsController],
  providers: [SettingsService, SettingsCryptoService],
  exports: [SettingsService, SettingsCryptoService],
})
export class SettingsModule {}
