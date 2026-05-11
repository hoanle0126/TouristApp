import { Injectable, Logger } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

export type AiBookingSummaryInput = {
  bookingCode: string;
  travelers: number;
  paymentStatus: string;
  startDate?: string;
  endDate?: string;
  specialRequests?: string | null;
  items: {
    itemType: 'tour' | 'hotel';
    title: string;
    date?: string | null;
    checkIn?: string | null;
    checkOut?: string | null;
    guests?: string | null;
    roomType?: string | null;
    quantity: number;
  }[];
};

@Injectable()
export class AiBookingSummaryService {
  private readonly logger = new Logger(AiBookingSummaryService.name);

  constructor(private readonly settingsService: SettingsService) {}

  async generate(input: AiBookingSummaryInput): Promise<string | null> {
    const config = await this.settingsService.getAiProviderRuntimeConfig();

    if (!config.enabled || !config.apiKey) {
      return null;
    }

    const timeoutMs = this.getTimeoutMs();
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const response = await fetch(
        this.buildChatCompletionsUrl(config.baseUrl),
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model,
            temperature: 0.2,
            messages: [
              {
                role: 'system',
                content:
                  'You write one short English booking operations summary for travel admins. Keep it to one paragraph, concise, factual, and based only on the provided booking data.',
              },
              {
                role: 'user',
                content: this.buildPrompt(input),
              },
            ],
          }),
          signal: abortController.signal,
        },
      );

      if (!response.ok) {
        this.logger.warn(
          `Booking AI summary provider returned ${response.status}`,
        );
        return null;
      }

      const data = (await response.json()) as {
        choices?: { message?: { content?: unknown } }[];
      };
      const content = data.choices?.[0]?.message?.content;

      return typeof content === 'string' && content.trim()
        ? content.trim()
        : null;
    } catch (error) {
      this.logger.warn(
        'Booking AI summary provider request failed',
        error instanceof Error ? error.stack : undefined,
      );
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildChatCompletionsUrl(baseUrl: string) {
    return `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
  }

  private buildPrompt(input: AiBookingSummaryInput) {
    return JSON.stringify({
      bookingCode: input.bookingCode,
      travelers: input.travelers,
      paymentStatus: input.paymentStatus,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
      specialRequests: input.specialRequests ?? null,
      items: input.items.map((item) => ({
        itemType: item.itemType,
        title: item.title,
        date: item.date ?? null,
        checkIn: item.checkIn ?? null,
        checkOut: item.checkOut ?? null,
        guests: item.guests ?? null,
        roomType: item.roomType ?? null,
        quantity: item.quantity,
      })),
    });
  }

  private getTimeoutMs() {
    const raw = Number(process.env.BOOKING_AI_SUMMARY_TIMEOUT_MS ?? '3000');
    return Number.isFinite(raw) && raw > 0 ? raw : 3000;
  }
}
