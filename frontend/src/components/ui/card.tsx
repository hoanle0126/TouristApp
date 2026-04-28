import * as React from "react";

import { cn } from "@/src/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-3xl border border-stone-200/70 bg-white shadow-sm", className)}
      data-slot="card"
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-8", className)} data-slot="card-content" {...props} />;
}

export { Card, CardContent };
