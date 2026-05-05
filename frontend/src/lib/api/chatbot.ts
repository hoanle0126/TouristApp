import { apiFetch } from "@/src/lib/api/client";
import type { ApiChatbotResponse } from "@/src/lib/api/types";

export async function sendChatbotMessage(input: { readonly message: string }) {
  return apiFetch<ApiChatbotResponse>("/chatbot/respond", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}
