import * as React from "react"

import { cn } from "@/lib/utils"

// 16px text on every screen: smaller text makes iOS Safari zoom on focus.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-input bg-card px-3 text-base transition-[color,box-shadow,border-color] outline-none placeholder:text-subtle-foreground hover:border-foreground/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:h-10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
