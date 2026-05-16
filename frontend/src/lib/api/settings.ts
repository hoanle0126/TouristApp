import { apiFetch } from "@/src/lib/api/client";
import type {
  ApiAiProviderSettings,
  ApiSiteContentSettings,
  ApiShopPaymentSettings,
  TestAiProviderSettingsInput,
  UpdateAiProviderSettingsInput,
  UpdateSiteContentSettingsInput,
  UpdateShopPaymentSettingsInput,
} from "@/src/lib/api/types";

export function getAiProviderSettings() {
  return apiFetch<ApiAiProviderSettings>("/settings/ai-provider");
}

export function updateAiProviderSettings(input: UpdateAiProviderSettingsInput) {
  return apiFetch<ApiAiProviderSettings>("/settings/ai-provider", {
    method: "PUT",
    body: input,
  });
}

export function testAiProviderSettings(input: TestAiProviderSettingsInput) {
  return apiFetch<{ ok: boolean; status: string }>("/settings/ai-provider/test", {
    method: "POST",
    body: input,
  });
}

export function getShopPaymentSettings() {
  return apiFetch<ApiShopPaymentSettings>("/settings/shop-payment");
}

export function updateShopPaymentSettings(input: UpdateShopPaymentSettingsInput) {
  return apiFetch<ApiShopPaymentSettings>("/settings/shop-payment", {
    method: "PUT",
    body: input,
  });
}

export function getSiteContentSettings() {
  return apiFetch<ApiSiteContentSettings>("/settings/site-content");
}

export function updateSiteContentSettings(input: UpdateSiteContentSettingsInput) {
  return apiFetch<ApiSiteContentSettings>("/settings/site-content", {
    method: "PUT",
    body: input,
  });
}
