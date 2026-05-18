"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Mail, Send } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { submitContactInquiry } from "@/src/lib/api/contact";

type Status = { type: "success" | "error"; message: string } | null;

export function LandingContactForm() {
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
        source: "landing",
      });

      setStatus({
        type: "success",
        message: "Thanks. We'll be in touch shortly.",
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="landing-first-name">First Name</Label>
          <Input
            id="landing-first-name"
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First Name"
            required
            type="text"
            value={firstName}
          />
        </div>
        <div>
          <Label htmlFor="landing-last-name">Last Name</Label>
          <Input
            id="landing-last-name"
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last Name"
            required
            type="text"
            value={lastName}
          />
        </div>
      </div>
      <div>
        <Label className="inline-flex items-center gap-1.5" htmlFor="landing-email">
          <Mail className="size-3.5 text-red-700" />
          Email Address
        </Label>
        <Input
          id="landing-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email Address"
          required
          type="email"
          value={email}
        />
      </div>
      <div>
        <Label className="inline-flex items-center gap-1.5" htmlFor="landing-message">
          <Send className="size-3.5 text-red-700" />
          Message
        </Label>
        <Textarea
          id="landing-message"
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Message"
          required
          rows={4}
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
        className="w-full bg-red-900 py-6 text-base font-bold text-white hover:bg-red-950"
        disabled={isSubmitting}
        type="submit"
      >
        <Send className="size-4" />
        {isSubmitting ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}
