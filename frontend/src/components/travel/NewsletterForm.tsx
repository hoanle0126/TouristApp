"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ApiError } from "@/src/lib/api/client";
import { subscribeToNewsletter } from "@/src/lib/api/newsletter";

type Status = { type: "success" | "error"; message: string } | null;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    try {
      await subscribeToNewsletter(email.trim());
      setStatus({ type: "success", message: "Thanks for subscribing." });
      setEmail("");
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 409
          ? "This email is already subscribed."
          : error instanceof Error
            ? error.message
            : "Could not subscribe right now.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address for newsletter
        </label>
        <Input
          className="min-w-0 flex-1 border-none bg-white shadow-sm ring-1 ring-stone-200 focus-visible:ring-red-700"
          id="newsletter-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          required
          type="email"
          value={email}
        />
        <Button
          className="px-6 text-xs uppercase tracking-widest"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "..." : "Join"}
        </Button>
      </div>
      {status ? (
        <p
          className={`text-xs font-semibold ${
            status.type === "success" ? "text-emerald-700" : "text-red-700"
          }`}
          role="status"
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
