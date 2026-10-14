import type { ReactNode } from "react";
import { ThemeCycleButton } from "./ThemeToggle";

/** Sticky, blurred header. Content scrolls underneath it. */
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
    <header className="sticky top-0 z-20 border-b border-line bg-bg/75 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-4 md:px-8 md:py-6">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight md:text-[28px]">
            {title}
          </h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
        {actions}
        <div className="md:hidden">
          <ThemeCycleButton />
        </div>
      </div>
    </header>
  );
}
