import * as React from "react";

import { cn } from "@/src/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-xl border border-stone-200 bg-white/90 px-4 py-3 text-sm font-medium text-stone-950 shadow-sm transition-all outline-none placeholder:text-stone-400 focus-visible:border-emerald-700 focus-visible:ring-4 focus-visible:ring-emerald-700/10 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      data-slot="textarea"
      {...props}
    />
  );
}

export { Textarea };
