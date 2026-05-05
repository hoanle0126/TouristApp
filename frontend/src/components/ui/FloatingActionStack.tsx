"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, MessageCircleMore, Send, Sparkles, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

const quickPrompts = [
  "Help me plan a 5-day Kyoto trip",
  "Find a quiet luxury hotel in Hoi An",
  "Suggest a nature-focused itinerary",
] as const;

const cannedResponses = [
  "I can help narrow this down. Share your destination, dates, and whether you prefer tours, hotels, or a mixed itinerary.",
  "For a stronger recommendation, tell me your budget range and how structured you want the journey to be.",
  "A good next step is to start from destination and duration, then I can map that to the closest curated journey in this site.",
] as const;

interface ChatMessage {
  readonly content: string;
  readonly role: "assistant" | "user";
}

export function FloatingActionStack() {
  const [draft, setDraft] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const [messages, setMessages] = useState<readonly ChatMessage[]>([
    {
      content:
        "Ask about destinations, stays, or how to move through the curated booking flow.",
      role: "assistant",
    },
  ]);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollVisible(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isChatOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        popupRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }

      setIsChatOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsChatOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isChatOpen]);

  const chatButtonOffsetClass = useMemo(() => {
    return isScrollVisible ? "bottom-24 md:bottom-28" : "bottom-6 md:bottom-8";
  }, [isScrollVisible]);

  const chatPopupOffsetClass = useMemo(() => {
    return isScrollVisible ? "bottom-40 md:bottom-44" : "bottom-22 md:bottom-24";
  }, [isScrollVisible]);

  const sendMessage = (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { content: trimmedMessage, role: "user" },
      {
        content:
          cannedResponses[currentMessages.length % cannedResponses.length],
        role: "assistant",
      },
    ]);
    setDraft("");
  };

  return (
    <>
      <div
        className={cn(
          "fixed right-6 z-[61] w-[min(calc(100vw-2rem),24rem)] overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white shadow-[0_40px_120px_-40px_rgba(28,25,23,0.45)] transition-all duration-300",
          "md:right-8",
          chatPopupOffsetClass,
          isChatOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
        ref={popupRef}
      >
        <div className="border-b border-stone-200/80 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-emerald-800">
                Curator Assistant
              </p>
              <div className="flex items-center gap-2 text-2xl font-black tracking-tight text-stone-950">
                <Sparkles className="size-5 text-emerald-800" />
                Plan with chat
              </div>
            </div>
            <Button
              aria-label="Close chatbot panel"
              className="rounded-full text-stone-500 hover:text-stone-950"
              onClick={() => setIsChatOpen(false)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-[min(30rem,calc(100vh-12rem))] overflow-y-auto px-6 py-6">
          <div className="mb-6 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <Button
                className="h-auto rounded-full border border-stone-200 bg-white px-4 py-2 text-left text-xs font-medium text-stone-600 hover:border-emerald-800/30 hover:bg-emerald-50 hover:text-emerald-900"
                key={prompt}
                onClick={() => sendMessage(prompt)}
                size={null}
                type="button"
                variant="ghost"
              >
                {prompt}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                className={cn(
                  "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
                  message.role === "assistant"
                    ? "bg-stone-100 text-stone-700"
                    : "ml-auto bg-emerald-800 text-white",
                )}
                key={`${message.role}-${index}`}
              >
                {message.content}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-stone-200/80 bg-white px-6 py-5">
          <form
            className="flex items-center gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(draft);
            }}
          >
            <Input
              className="flex-1"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about your next journey"
              value={draft}
            />
            <Button aria-label="Send message" size="icon" type="submit">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>

      <Button
        aria-expanded={isChatOpen}
        aria-label="Open chatbot panel"
        className={cn(
          "fixed right-6 z-[60] rounded-full shadow-[0_20px_50px_-20px_rgba(6,78,59,0.65)] transition-all duration-300",
          "md:right-8",
          chatButtonOffsetClass,
          isChatOpen && "bg-emerald-900 hover:bg-emerald-950",
        )}
        onClick={() => setIsChatOpen((current) => !current)}
        ref={triggerRef}
        size="icon"
        type="button"
      >
        <MessageCircleMore className="size-5" />
      </Button>

      <Button
        aria-label="Scroll to top"
        className={cn(
          "fixed bottom-6 right-6 z-[60] rounded-full shadow-[0_20px_50px_-20px_rgba(6,78,59,0.65)] transition-all duration-300",
          "md:bottom-8 md:right-8",
          isScrollVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        size="icon"
        type="button"
      >
        <ArrowUp className="size-5" />
      </Button>
    </>
  );
}
