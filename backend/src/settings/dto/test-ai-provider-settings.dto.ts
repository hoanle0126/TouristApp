import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class TestAiProviderSettingsDto {
  @IsIn(['openai-compatible'])
  provider: string;

  @IsString()
  @IsNotEmpty()
  baseUrl: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  apiKey: string;
}
