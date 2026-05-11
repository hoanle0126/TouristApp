import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class SettingsCryptoService {
  encrypt(value: string) {
    const key = this.getEncryptionKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(value, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return [iv, tag, encrypted]
      .map((part) => part.toString('base64'))
      .join(':');
  }

  decrypt(value: string) {
    const [ivBase64, tagBase64, encryptedBase64] = value.split(':');

    if (!ivBase64 || !tagBase64 || !encryptedBase64) {
      throw new Error('Stored AI provider key is invalid.');
    }

    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.getEncryptionKey(),
      Buffer.from(ivBase64, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(tagBase64, 'base64'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedBase64, 'base64')),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }

  private getEncryptionKey() {
    const configuredKey = process.env.SETTINGS_ENCRYPTION_KEY;

    if (!configuredKey) {
      throw new Error('SETTINGS_ENCRYPTION_KEY is not configured.');
    }

    const key = Buffer.from(configuredKey, 'base64');

    if (key.length !== 32) {
      throw new Error(
        'SETTINGS_ENCRYPTION_KEY must be a 32-byte base64 value.',
      );
    }

    return key;
  }
}
