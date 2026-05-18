import { apiFetch } from "@/src/lib/api/client";

export type SubmitContactInquiryInput = {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly message: string;
  readonly desiredDestination?: string;
  readonly primaryInterest?: string;
  readonly source: "landing" | "contact-page";
};

export async function submitContactInquiry(input: SubmitContactInquiryInput) {
  return apiFetch<{ readonly ok: true }>("/contact/inquiries", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}
