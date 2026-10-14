import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MobileHeader } from "./MobileHeader";

/**
 * Scrollable page body: 16 / 24 / 32px side padding, content max 1120px.
 * On phones it starts with the shared brand bar (which also handles the
 * status-bar safe area). Bottom padding clears the phone tab bar.
 */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="h-full overflow-y-auto overscroll-contain">
      <div
        className={cn(
          "mx-auto w-full max-w-280 px-4 pb-[calc(var(--tabbar-h)+24px)] md:px-6 md:pt-8 md:pb-8 xl:px-8",
          className,
        )}
      >
        <MobileHeader className="mb-2 md:hidden" />
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
