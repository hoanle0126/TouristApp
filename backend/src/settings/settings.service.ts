import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestAiProviderSettingsDto } from './dto/test-ai-provider-settings.dto';
import { SettingsCryptoService } from './settings-crypto.service';
import { UpdateAiProviderSettingsDto } from './dto/update-ai-provider-settings.dto';

const SINGLETON_CONFIG_ID = 'site';
const DEFAULT_PROVIDER = 'openai-compatible';
const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4o-mini';

type AiProviderSettingsRecord = {
  provider: string;
  baseUrl: string;
  model: string;
  enabled: boolean;
  encryptedApiKey: string | null;
  apiKeyLast4: string | null;
};

type AiProviderSettingsReadModel = {
  provider: string;
  baseUrl: string;
  model: string;
  enabled: boolean;
  hasApiKey: boolean;
  apiKeyLast4: string | null;
};

type AiProviderRuntimeConfig = {
  provider: string;
  baseUrl: string;
  model: string;
  enabled: boolean;
  apiKey: string | null;
};

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsCrypto: SettingsCryptoService,
  ) {}

  async getAiProviderSettings(): Promise<AiProviderSettingsReadModel> {
    const config = await this.prisma.aiProviderConfig.findUnique({
      where: { id: SINGLETON_CONFIG_ID },
    });

    return this.toReadModel(config);
  }

  async getAiProviderRuntimeConfig(): Promise<AiProviderRuntimeConfig> {
    const config = await this.prisma.aiProviderConfig.findUnique({
      where: { id: SINGLETON_CONFIG_ID },
    });

    return {
      provider: config?.provider ?? DEFAULT_PROVIDER,
      baseUrl: config?.baseUrl ?? DEFAULT_BASE_URL,
      model: config?.model ?? DEFAULT_MODEL,
      enabled: config?.enabled ?? false,
      apiKey: config?.encryptedApiKey
        ? this.settingsCrypto.decrypt(config.encryptedApiKey)
        : null,
    };
  }

  async updateAiProviderSettings(dto: UpdateAiProviderSettingsDto) {
    const data = this.toPersistenceData(dto);
    const config = await this.prisma.aiProviderConfig.upsert({
      where: { id: SINGLETON_CONFIG_ID },
      create: {
        id: SINGLETON_CONFIG_ID,
        provider: dto.provider ?? DEFAULT_PROVIDER,
        baseUrl: dto.baseUrl ?? DEFAULT_BASE_URL,
        model: dto.model ?? DEFAULT_MODEL,
        enabled: dto.enabled ?? false,
        encryptedApiKey: data.encryptedApiKey ?? null,
        apiKeyLast4: data.apiKeyLast4 ?? null,
      },
      update: data,
    });

    return this.toReadModel(config);
  }

  async testAiProviderSettings(dto: TestAiProviderSettingsDto) {
    const response = await fetch(this.buildChatCompletionsUrl(dto.baseUrl), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${dto.apiKey}`,
      },
      body: JSON.stringify({
        model: dto.model,
        max_tokens: 8,
        messages: [
          {
            role: 'user',
            content: 'Reply with the single word ok.',
          },
        ],
      }),
    });

    if (!response.ok) {
      const payload: unknown = await response.json().catch(() => undefined);
      const message =
        this.extractProviderErrorMessage(payload) ??
        `Provider request failed with status ${response.status}.`;
      throw new Error(message);
    }

    return { ok: true, status: 'verified' };
  }

  private toPersistenceData(dto: UpdateAiProviderSettingsDto) {
    const data: {
      provider?: string;
      baseUrl?: string;
      model?: string;
      enabled?: boolean;
      encryptedApiKey?: string | null;
      apiKeyLast4?: string | null;
    } = {};

    if (dto.provider !== undefined) {
      data.provider = dto.provider;
    }

    if (dto.baseUrl !== undefined) {
      data.baseUrl = dto.baseUrl;
    }

    if (dto.model !== undefined) {
      data.model = dto.model;
    }

    if (dto.enabled !== undefined) {
      data.enabled = dto.enabled;
    }

    if (dto.clearApiKey === true) {
      data.encryptedApiKey = null;
      data.apiKeyLast4 = null;
    } else if (dto.apiKey !== undefined) {
      data.encryptedApiKey = this.settingsCrypto.encrypt(dto.apiKey);
      data.apiKeyLast4 = this.last4(dto.apiKey);
    }

    return data;
  }

  private toReadModel(
    config: AiProviderSettingsRecord | null,
  ): AiProviderSettingsReadModel {
    const hasApiKey = Boolean(config?.encryptedApiKey);

    return {
      provider: config?.provider ?? DEFAULT_PROVIDER,
      baseUrl: config?.baseUrl ?? DEFAULT_BASE_URL,
      model: config?.model ?? DEFAULT_MODEL,
      enabled: config?.enabled ?? false,
      hasApiKey,
      apiKeyLast4: hasApiKey ? (config?.apiKeyLast4 ?? null) : null,
    };
  }

  private buildChatCompletionsUrl(baseUrl: string) {
    return `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
  }

  private extractProviderErrorMessage(payload: unknown) {
    if (
      payload &&
      typeof payload === 'object' &&
      'error' in payload &&
      payload.error &&
      typeof payload.error === 'object' &&
      'message' in payload.error &&
      typeof payload.error.message === 'string'
    ) {
      return payload.error.message;
    }

    return null;
  }

  private last4(value: string) {
    return value.slice(-4);
  }
}
