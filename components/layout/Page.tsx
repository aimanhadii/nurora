"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MobileHeader } from "./MobileHeader";

/**
 * Scrollable page body: 16 / 24 / 32px side padding, content max 1120px.
 * On phones the shared brand bar sticks to the top of this scroll area
 * (full width, outside the padded column); scroll-padding keeps
 * scroll-into-view targets clear of it. Bottom padding clears the tab bar.
 */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="h-full scroll-pt-(--mobile-header-h) overflow-y-auto overscroll-contain"
    >
      <MobileHeader scrollRef={scrollRef} className="md:hidden" />
      <div
        className={cn(
          "mx-auto w-full max-w-280 px-4 pt-2 pb-[calc(var(--tabbar-h)+24px)] md:px-6 md:pt-8 md:pb-8 xl:px-8",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Screen title row (greeting / page title, description, actions). */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex items-start gap-3 md:mb-8">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
