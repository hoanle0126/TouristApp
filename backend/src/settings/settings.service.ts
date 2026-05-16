import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestAiProviderSettingsDto } from './dto/test-ai-provider-settings.dto';
import { SettingsCryptoService } from './settings-crypto.service';
import { UpdateAiProviderSettingsDto } from './dto/update-ai-provider-settings.dto';
import { UpdateSiteContentSettingsDto } from './dto/update-site-content-settings.dto';
import { UpdateShopPaymentSettingsDto } from './dto/update-shop-payment-settings.dto';

const SINGLETON_CONFIG_ID = 'site';
const DEFAULT_PROVIDER = 'openai-compatible';
const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_PAYMENT_BANK_BIN = '970436';
const DEFAULT_PAYMENT_BANK_NAME = 'Vietcombank';
const DEFAULT_PAYMENT_ACCOUNT_NUMBER = '0123456789';
const DEFAULT_PAYMENT_ACCOUNT_NAME = 'CURATOR TRAVEL LTD';
const DEFAULT_SITE_NAME = 'CURATOR';
const DEFAULT_SITE_TAGLINE = 'High-End Travel Monograph';
const DEFAULT_SITE_DESCRIPTION =
  'Curated destinations and exclusive travel experiences.';
const DEFAULT_CONTACT_EMAIL = 'inquiries@curator.travel';
const DEFAULT_HOTLINE = 'Hotline: +44 (0) 20 7123 4567';
const DEFAULT_TOP_BAR_NOTE = 'Private itinerary support, 24/7';
const DEFAULT_PROMO_LABEL =
  'Travel freely without worrying about the price';
const DEFAULT_PROMO_CTA = 'View offers';
const DEFAULT_PROMO_HREF = '/tours';
const DEFAULT_HOME_HERO_IMAGE = '/thumbnail.jpg';
const DEFAULT_HOME_HERO_ALT =
  'Misty mountains reflected in a crystal lake at first light';
const DEFAULT_HOME_HERO_IMAGE_TWO =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_HOME_HERO_ALT_TWO =
  'Golden evening light over a secluded tropical bay';
const DEFAULT_HOME_HERO_IMAGE_THREE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_HOME_HERO_ALT_THREE =
  'A sweeping coastline with clear water and distant cliffs';

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

type ShopPaymentSettingsRecord = {
  bankBin: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
};

type SiteContentSettingsRecord = {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  contactEmail: string;
  hotline: string;
  topBarNote: string;
  promoLabel: string;
  promoCta: string;
  promoHref: string;
  homeHeroImage: string;
  homeHeroAlt: string;
  heroImageTwo: string;
  heroImageTwoAlt: string;
  heroImageThree: string;
  heroImageThreeAlt: string;
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

  async getShopPaymentSettings(): Promise<ShopPaymentSettingsRecord> {
    const config = await this.prisma.shopPaymentConfig.findUnique({
      where: { id: SINGLETON_CONFIG_ID },
    });

    return this.toShopPaymentReadModel(config);
  }

  async getShopPaymentRuntimeConfig(): Promise<ShopPaymentSettingsRecord> {
    return this.getShopPaymentSettings();
  }

  async getSiteContentSettings(): Promise<SiteContentSettingsRecord> {
    const config = await this.prisma.siteContentConfig.findUnique({
      where: { id: SINGLETON_CONFIG_ID },
    });

    return this.toSiteContentReadModel(config);
  }

  async getSiteContentRuntimeConfig(): Promise<SiteContentSettingsRecord> {
    return this.getSiteContentSettings();
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

  async updateShopPaymentSettings(dto: UpdateShopPaymentSettingsDto) {
    const current = await this.getShopPaymentSettings();
    const config = await this.prisma.shopPaymentConfig.upsert({
      where: { id: SINGLETON_CONFIG_ID },
      create: {
        id: SINGLETON_CONFIG_ID,
        bankBin: dto.bankBin ?? current.bankBin,
        bankName: dto.bankName ?? current.bankName,
        accountNumber: dto.accountNumber ?? current.accountNumber,
        accountName: dto.accountName ?? current.accountName,
      },
      update: {
        ...(dto.bankBin !== undefined ? { bankBin: dto.bankBin } : {}),
        ...(dto.bankName !== undefined ? { bankName: dto.bankName } : {}),
        ...(dto.accountNumber !== undefined
          ? { accountNumber: dto.accountNumber }
          : {}),
        ...(dto.accountName !== undefined
          ? { accountName: dto.accountName }
          : {}),
      },
    });

    return this.toShopPaymentReadModel(config);
  }

  async updateSiteContentSettings(dto: UpdateSiteContentSettingsDto) {
    const current = await this.getSiteContentSettings();
    const config = await this.prisma.siteContentConfig.upsert({
      where: { id: SINGLETON_CONFIG_ID },
      create: {
        id: SINGLETON_CONFIG_ID,
        siteName: dto.siteName ?? current.siteName,
        siteTagline: dto.siteTagline ?? current.siteTagline,
        siteDescription: dto.siteDescription ?? current.siteDescription,
        contactEmail: dto.contactEmail ?? current.contactEmail,
        hotline: dto.hotline ?? current.hotline,
        topBarNote: dto.topBarNote ?? current.topBarNote,
        promoLabel: dto.promoLabel ?? current.promoLabel,
        promoCta: dto.promoCta ?? current.promoCta,
        promoHref: dto.promoHref ?? current.promoHref,
        homeHeroImage: dto.homeHeroImage ?? current.homeHeroImage,
        homeHeroAlt: dto.homeHeroAlt ?? current.homeHeroAlt,
        heroImageTwo: dto.heroImageTwo ?? current.heroImageTwo,
        heroImageTwoAlt: dto.heroImageTwoAlt ?? current.heroImageTwoAlt,
        heroImageThree: dto.heroImageThree ?? current.heroImageThree,
        heroImageThreeAlt:
          dto.heroImageThreeAlt ?? current.heroImageThreeAlt,
      },
      update: {
        ...(dto.siteName !== undefined ? { siteName: dto.siteName } : {}),
        ...(dto.siteTagline !== undefined
          ? { siteTagline: dto.siteTagline }
          : {}),
        ...(dto.siteDescription !== undefined
          ? { siteDescription: dto.siteDescription }
          : {}),
        ...(dto.contactEmail !== undefined
          ? { contactEmail: dto.contactEmail }
          : {}),
        ...(dto.hotline !== undefined ? { hotline: dto.hotline } : {}),
        ...(dto.topBarNote !== undefined
          ? { topBarNote: dto.topBarNote }
          : {}),
        ...(dto.promoLabel !== undefined
          ? { promoLabel: dto.promoLabel }
          : {}),
        ...(dto.promoCta !== undefined ? { promoCta: dto.promoCta } : {}),
        ...(dto.promoHref !== undefined ? { promoHref: dto.promoHref } : {}),
        ...(dto.homeHeroImage !== undefined
          ? { homeHeroImage: dto.homeHeroImage }
          : {}),
        ...(dto.homeHeroAlt !== undefined
          ? { homeHeroAlt: dto.homeHeroAlt }
          : {}),
        ...(dto.heroImageTwo !== undefined
          ? { heroImageTwo: dto.heroImageTwo }
          : {}),
        ...(dto.heroImageTwoAlt !== undefined
          ? { heroImageTwoAlt: dto.heroImageTwoAlt }
          : {}),
        ...(dto.heroImageThree !== undefined
          ? { heroImageThree: dto.heroImageThree }
          : {}),
        ...(dto.heroImageThreeAlt !== undefined
          ? { heroImageThreeAlt: dto.heroImageThreeAlt }
          : {}),
      },
    });

    return this.toSiteContentReadModel(config);
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

  private toShopPaymentReadModel(
    config: ShopPaymentSettingsRecord | null,
  ): ShopPaymentSettingsRecord {
    return {
      bankBin: config?.bankBin ?? DEFAULT_PAYMENT_BANK_BIN,
      bankName: config?.bankName ?? DEFAULT_PAYMENT_BANK_NAME,
      accountNumber: config?.accountNumber ?? DEFAULT_PAYMENT_ACCOUNT_NUMBER,
      accountName: config?.accountName ?? DEFAULT_PAYMENT_ACCOUNT_NAME,
    };
  }

  private toSiteContentReadModel(
    config: SiteContentSettingsRecord | null,
  ): SiteContentSettingsRecord {
    return {
      siteName: config?.siteName ?? DEFAULT_SITE_NAME,
      siteTagline: config?.siteTagline ?? DEFAULT_SITE_TAGLINE,
      siteDescription: config?.siteDescription ?? DEFAULT_SITE_DESCRIPTION,
      contactEmail: config?.contactEmail ?? DEFAULT_CONTACT_EMAIL,
      hotline: config?.hotline ?? DEFAULT_HOTLINE,
      topBarNote: config?.topBarNote ?? DEFAULT_TOP_BAR_NOTE,
      promoLabel: config?.promoLabel ?? DEFAULT_PROMO_LABEL,
      promoCta: config?.promoCta ?? DEFAULT_PROMO_CTA,
      promoHref: config?.promoHref ?? DEFAULT_PROMO_HREF,
      homeHeroImage: config?.homeHeroImage ?? DEFAULT_HOME_HERO_IMAGE,
      homeHeroAlt: config?.homeHeroAlt ?? DEFAULT_HOME_HERO_ALT,
      heroImageTwo: config?.heroImageTwo ?? DEFAULT_HOME_HERO_IMAGE_TWO,
      heroImageTwoAlt: config?.heroImageTwoAlt ?? DEFAULT_HOME_HERO_ALT_TWO,
      heroImageThree:
        config?.heroImageThree ?? DEFAULT_HOME_HERO_IMAGE_THREE,
      heroImageThreeAlt:
        config?.heroImageThreeAlt ?? DEFAULT_HOME_HERO_ALT_THREE,
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
