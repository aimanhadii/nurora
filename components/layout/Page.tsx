import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ProfileMenu } from "./ProfileMenu";

/**
 * Scrollable page body: 16 / 24 / 32px side padding, content max 1120px.
 * Bottom padding clears the phone tab bar.
 */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="h-full overflow-y-auto overscroll-contain">
      <div
        className={cn(
          "mx-auto w-full max-w-280 px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-[calc(var(--tabbar-h)+24px)] md:px-6 md:pt-8 md:pb-8 xl:px-8",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Screen title row. On phones the profile/theme menu sits on the right. */
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
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      <div className="md:hidden">
        <ProfileMenu variant="avatar" />
      </div>
    </header>
  );
}
