import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Orb } from "@/components/ui/Orb";
import { ProfileMenu } from "./ProfileMenu";

/**
 * Brand bar shared by Home, Chat and Tasks on phones: orb + "nurora"
 * wordmark on the left, the profile/theme avatar on the right. Pads for
 * the iPhone status bar. (Tablet/desktop show the brand in the sidebar.)
 *
 * `className` styles the outer header (e.g. "md:hidden"); `rowClassName`
 * the inner row (e.g. a centred column on Chat).
 */
export function MobileHeader({
  subtitle,
  className,
  rowClassName,
}: {
  subtitle?: ReactNode;
  className?: string;
  rowClassName?: string;
}) {
  return (
    <header className={cn("shrink-0 pt-[env(safe-area-inset-top)]", className)}>
      <div className={cn("flex items-center gap-3 py-3", rowClassName)}>
        <Orb size={32} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg">nurora</p>
          {subtitle && <p className="truncate text-meta text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="md:hidden">
          <ProfileMenu variant="avatar" />
        </div>
      </div>
    </header>
  );
}
