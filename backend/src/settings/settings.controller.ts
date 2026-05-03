import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { TestAiProviderSettingsDto } from './dto/test-ai-provider-settings.dto';
import { UpdateAiProviderSettingsDto } from './dto/update-ai-provider-settings.dto';
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
}
