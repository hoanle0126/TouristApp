"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Button
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-6 right-6 z-[60] rounded-full shadow-[0_20px_50px_-20px_rgba(6,78,59,0.65)] transition-all duration-300",
        "md:bottom-8 md:right-8",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      size="icon"
      type="button"
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}
