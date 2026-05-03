import { apiFetch } from "@/src/lib/api/client";
import type {
  ApiAiProviderSettings,
  TestAiProviderSettingsInput,
  UpdateAiProviderSettingsInput,
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
