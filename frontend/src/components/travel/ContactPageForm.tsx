"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { submitContactInquiry } from "@/src/lib/api/contact";

type Status = { type: "success" | "error"; message: string } | null;

const fieldClassName =
  "h-14 rounded-xl border-stone-200/70 bg-stone-50/90 px-4 font-medium shadow-none transition-all hover:bg-white focus-visible:border-red-800 focus-visible:ring-4 focus-visible:ring-red-800/10";
const labelClassName = "text-[0.7rem] font-black text-stone-950";

export function ContactPageForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    try {
      await submitContactInquiry({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        message: message.trim(),
        source: "contact-page",
      });

      setStatus({
        type: "success",
        message: "Thanks. A curator will reach out within 24 hours.",
      });
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not send your inquiry right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <Label className={labelClassName} htmlFor="contact-first-name">
            First Name
          </Label>
          <Input
            className={fieldClassName}
            id="contact-first-name"
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Jane"
            required
            type="text"
            value={firstName}
          />
        </div>
        <div>
          <Label className={labelClassName} htmlFor="contact-last-name">
            Last Name
          </Label>
          <Input
            className={fieldClassName}
            id="contact-last-name"
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Doe"
            required
            type="text"
            value={lastName}
          />
        </div>
      </div>
      <div>
        <Label className={labelClassName} htmlFor="contact-email">
          Email Address
        </Label>
        <Input
          className={fieldClassName}
          id="contact-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="jane@example.com"
          required
          type="email"
          value={email}
        />
      </div>
      <div>
        <Label className={labelClassName} htmlFor="contact-message">
          Message
        </Label>
        <Textarea
          className="min-h-36 resize-none rounded-xl border-stone-200/70 bg-stone-50/90 px-4 py-4 font-medium shadow-none transition-all hover:bg-white focus-visible:border-red-800 focus-visible:ring-4 focus-visible:ring-red-800/10"
          id="contact-message"
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us about your desired destinations, travel dates, or special occasions..."
          required
          value={message}
        />
      </div>
      {status ? (
        <p
          className={`text-sm font-semibold ${
            status.type === "success" ? "text-emerald-700" : "text-red-700"
          }`}
          role="status"
        >
          {status.message}
        </p>
      ) : null}
      <Button
        className="min-h-14 px-10 text-sm font-black tracking-wide shadow-lg shadow-red-950/10"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
