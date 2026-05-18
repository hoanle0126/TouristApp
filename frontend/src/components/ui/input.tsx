import * as React from "react";

import { cn } from "@/src/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-xl border border-stone-200 bg-white/90 px-4 py-3 text-sm font-medium text-stone-950 shadow-sm transition-all outline-none placeholder:text-stone-400 focus-visible:border-red-700 focus-visible:ring-4 focus-visible:ring-red-700/10 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
