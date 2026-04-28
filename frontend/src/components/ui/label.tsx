"use client";

import * as React from "react";

import { cn } from "@/src/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "mb-2 block text-[0.6875rem] font-bold uppercase tracking-widest text-stone-600",
        className,
      )}
      data-slot="label"
      {...props}
    />
  );
}

export { Label };
