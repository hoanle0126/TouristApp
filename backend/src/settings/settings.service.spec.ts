import { SettingsCryptoService } from './settings-crypto.service';
import { SettingsService } from './settings.service';

function createService(prisma: ReturnType<typeof createPrismaMock>) {
  return new SettingsService(prisma as never, new SettingsCryptoService());
}

const settingsRecord = {
  id: 'site',
  provider: 'openai-compatible',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  encryptedApiKey: null,
  apiKeyLast4: null,
  enabled: false,
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
};

function createPrismaMock() {
  return {
    aiProviderConfig: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };
}

describe('SettingsService', () => {
  const previousKey = process.env.SETTINGS_ENCRYPTION_KEY;

  beforeEach(() => {
    process.env.SETTINGS_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString(
      'base64',
    );
  });

  afterEach(() => {
    if (previousKey === undefined) {
      delete process.env.SETTINGS_ENCRYPTION_KEY;
    } else {
      process.env.SETTINGS_ENCRYPTION_KEY = previousKey;
    }
    jest.restoreAllMocks();
  });

  it('returns singleton defaults with plan contract when no config exists', async () => {
    const prisma = createPrismaMock();
    prisma.aiProviderConfig.findUnique.mockResolvedValue(null);
    const service = createService(prisma);

    await expect(service.getAiProviderSettings()).resolves.toEqual({
      provider: 'openai-compatible',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      enabled: false,
      hasApiKey: false,
      apiKeyLast4: null,
    });

    expect(prisma.aiProviderConfig.findUnique).toHaveBeenCalledWith({
      where: { id: 'site' },
    });
  });

  it('saves encrypted api keys and apiKeyLast4 in the singleton config', async () => {
    const prisma = createPrismaMock();
    prisma.aiProviderConfig.upsert.mockResolvedValue({
      ...settingsRecord,
      encryptedApiKey: 'encrypted-value',
      apiKeyLast4: 'cret',
      enabled: true,
    });
    const service = createService(prisma);

    await service.updateAiProviderSettings({
      provider: 'openai-compatible',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o',
      enabled: true,
      apiKey: 'sk-test-secret',
    });

    const upsertArgs = prisma.aiProviderConfig.upsert.mock.calls[0][0];
    expect(upsertArgs.where).toEqual({ id: 'site' });
    expect(upsertArgs.create.encryptedApiKey).toEqual(expect.any(String));
    expect(upsertArgs.create.encryptedApiKey).not.toContain('sk-test-secret');
    expect(upsertArgs.create.apiKeyLast4).toBe('cret');
    expect(upsertArgs.update.encryptedApiKey).toBe(
      upsertArgs.create.encryptedApiKey,
    );
    expect(upsertArgs.update.apiKeyLast4).toBe('cret');
  });

  it('reads without returning raw or encrypted key material', async () => {
    const prisma = createPrismaMock();
    prisma.aiProviderConfig.findUnique.mockResolvedValue({
      ...settingsRecord,
      encryptedApiKey: 'stored-encrypted-value',
      apiKeyLast4: 'cret',
      enabled: true,
    });
    const service = createService(prisma);

    const result = await service.getAiProviderSettings();

    expect(result).toEqual({
      provider: 'openai-compatible',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      enabled: true,
      hasApiKey: true,
      apiKeyLast4: 'cret',
    });
    expect(result).not.toHaveProperty('apiKey');
    expect(result).not.toHaveProperty('encryptedApiKey');
    expect(JSON.stringify(result)).not.toContain('stored-encrypted-value');
  });

  it('preserves existing encrypted api key and last4 when apiKey is omitted', async () => {
    const prisma = createPrismaMock();
    prisma.aiProviderConfig.upsert.mockResolvedValue({
      ...settingsRecord,
      provider: 'openai-compatible',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      encryptedApiKey: 'existing-encrypted-value',
      apiKeyLast4: 'old4',
    });
    const service = createService(prisma);

    await service.updateAiProviderSettings({
      provider: 'openai-compatible',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
    });

    const upsertArgs = prisma.aiProviderConfig.upsert.mock.calls[0][0];
    expect(upsertArgs.update).not.toHaveProperty('encryptedApiKey');
    expect(upsertArgs.update).not.toHaveProperty('apiKeyLast4');
  });

  it('clears stored api key only when clearApiKey is explicit', async () => {
    const prisma = createPrismaMock();
    prisma.aiProviderConfig.upsert.mockResolvedValue(settingsRecord);
    const service = createService(prisma);

    await service.updateAiProviderSettings({ clearApiKey: true });

    const upsertArgs = prisma.aiProviderConfig.upsert.mock.calls[0][0];
    expect(upsertArgs.update.encryptedApiKey).toBeNull();
    expect(upsertArgs.update.apiKeyLast4).toBeNull();
    expect(upsertArgs.create.encryptedApiKey).toBeNull();
    expect(upsertArgs.create.apiKeyLast4).toBeNull();
  });

  it('does not persist settings when provider test fails with an invalid api key', async () => {
    const prisma = createPrismaMock();
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({
        error: {
          message: 'Invalid API key.',
        },
      }),
    });
    global.fetch = fetchMock as never;
    const service = createService(prisma);

    await expect(
      service.testAiProviderSettings({
        provider: 'openai-compatible',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o-mini',
        apiKey: 'sk-test-secret',
      }),
    ).rejects.toThrow('Invalid API key.');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'content-type': 'application/json',
          authorization: 'Bearer sk-test-secret',
        }),
      }),
    );
    expect(prisma.aiProviderConfig.upsert).not.toHaveBeenCalled();
  });
});
