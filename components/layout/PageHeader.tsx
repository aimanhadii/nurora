import type { ReactNode } from "react";
import { ProfileMenu } from "./ProfileMenu";

/** Top bar of a screen. Part of the layout flow, so nothing hides under it. */
export function PageHeader({
  title,
  subtitle,
  leading,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="shrink-0 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 md:px-6 md:pt-5">
      {/* Same max width as the content below, so they line up. */}
      <div className="mx-auto flex max-w-[760px] items-center gap-3">
        {leading}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
            {title}
          </h1>
          {subtitle && <p className="truncate text-sm text-text-2">{subtitle}</p>}
        </div>
        {actions}
        {/* Phones have no sidebar, so the profile/theme menu lives here. */}
        <div className="md:hidden">
          <ProfileMenu variant="avatar" />
        </div>
      </div>
    </header>
  );
}
