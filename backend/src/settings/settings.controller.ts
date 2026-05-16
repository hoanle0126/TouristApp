import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { TestAiProviderSettingsDto } from './dto/test-ai-provider-settings.dto';
import { UpdateAiProviderSettingsDto } from './dto/update-ai-provider-settings.dto';
import { UpdateSiteContentSettingsDto } from './dto/update-site-content-settings.dto';
import { UpdateShopPaymentSettingsDto } from './dto/update-shop-payment-settings.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('ai-provider')
  getAiProviderSettings() {
    return this.settingsService.getAiProviderSettings();
  }

  @Put('ai-provider')
  updateAiProviderSettings(@Body() dto: UpdateAiProviderSettingsDto) {
    return this.settingsService.updateAiProviderSettings(dto);
  }

  @Post('ai-provider/test')
  testAiProviderSettings(@Body() dto: TestAiProviderSettingsDto) {
    return this.settingsService.testAiProviderSettings(dto);
  }

  @Get('shop-payment')
  getShopPaymentSettings() {
    return this.settingsService.getShopPaymentSettings();
  }

  @Put('shop-payment')
  updateShopPaymentSettings(@Body() dto: UpdateShopPaymentSettingsDto) {
    return this.settingsService.updateShopPaymentSettings(dto);
  }

  @Get('site-content')
  getSiteContentSettings() {
    return this.settingsService.getSiteContentSettings();
  }

  @Put('site-content')
  updateSiteContentSettings(@Body() dto: UpdateSiteContentSettingsDto) {
    return this.settingsService.updateSiteContentSettings(dto);
  }
}
