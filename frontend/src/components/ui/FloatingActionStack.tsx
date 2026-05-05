"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, LoaderCircle, MessageCircleMore, Send, Sparkles, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { sendChatbotMessage } from "@/src/lib/api/chatbot";
import { ApiError, ApiNetworkError } from "@/src/lib/api/client";
import type { ApiChatbotSource } from "@/src/lib/api/types";
import { cn } from "@/src/lib/utils";

type ChatMessage = {
  readonly content: string;
  readonly role: "assistant" | "user";
  readonly sources?: readonly ApiChatbotSource[];
};

function ChatMarkdown({ content }: { readonly content: string }) {
  const blocks = content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const listItems = lines
          .map((line) => line.match(/^(?:[-*]|\d+[.)])\s+(.+)$/)?.[1])
          .filter((line): line is string => Boolean(line));

        if (listItems.length === lines.length && listItems.length > 0) {
          return (
            <ul className="ml-4 list-disc space-y-1" key={`list-${blockIndex}`}>
              {listItems.map((item, itemIndex) => (
                <li key={`${blockIndex}-${itemIndex}`}>
                  <InlineMarkdown content={item} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <div className="space-y-1" key={`paragraph-${blockIndex}`}>
            {lines.map((line, lineIndex) => (
              <p key={`${blockIndex}-${lineIndex}`}>
                <InlineMarkdown content={line} />
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function InlineMarkdown({ content }: { readonly content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

export function FloatingActionStack() {
  const [draft, setDraft] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<readonly ChatMessage[]>([]);
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

  const sendMessage = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    setIsSending(true);
    setMessages((currentMessages) => [
      ...currentMessages,
      { content: trimmedMessage, role: "user" },
    ]);
    setDraft("");

    try {
      const response = await sendChatbotMessage({
        message: trimmedMessage,
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          content: response.answer,
          role: "assistant",
          sources: response.sources,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof ApiNetworkError
          ? "The support service is currently unavailable. Please try again in a moment."
          : error instanceof ApiError
            ? error.message
            : "Something went wrong while processing your question. Please try again.";

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          content: message,
          role: "assistant",
          sources: [],
        },
      ]);
    } finally {
      setIsSending(false);
    }
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
                {message.role === "assistant" ? (
                  <ChatMarkdown content={message.content} />
                ) : (
                  <p>{message.content}</p>
                )}
                {message.role === "assistant" && message.sources?.length ? (
                  <div className="mt-3 border-t border-stone-200/80 pt-3 text-xs text-stone-500">
                    <p className="font-semibold uppercase tracking-[0.16em] text-stone-400">
                      Sources
                    </p>
                    <ul className="mt-2 space-y-1">
                      {message.sources.map((source) => (
                        <li key={`${source.kind}-${source.slug}`}>{source.label}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
            {isSending ? (
              <div className="max-w-[88%] rounded-2xl bg-stone-100 px-4 py-3 text-sm text-stone-700 shadow-sm">
                <div className="flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" />
                  Looking up grounded website information...
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-stone-200/80 bg-white px-6 py-5">
          <form
            className="flex items-center gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(draft);
            }}
          >
            <Input
              className="flex-1"
              disabled={isSending}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about tours, hotels, or availability"
              value={draft}
            />
            <Button aria-label="Send message" disabled={isSending} size="icon" type="submit">
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
