import type { ReactNode } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";

/** Floating glass header. Content scrolls underneath it. */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="sticky top-[calc(env(safe-area-inset-top)+0.5rem)] z-20 md:top-0">
      <GlassPanel
        as="header"
        className="flex items-center gap-3 rounded-panel px-5 py-4 md:px-6 md:py-5"
      >
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight md:text-[28px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-sm text-fg-2">{subtitle}</p>
          )}
        </div>
        {actions}
      </GlassPanel>
    </div>
  );
}
