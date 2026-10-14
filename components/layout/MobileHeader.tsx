"use client";

import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { formatLongDate } from "@/lib/time";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";
import { Orb } from "@/components/ui/Orb";
import { ProfileMenu } from "./ProfileMenu";

/**
 * The one brand bar for Home, Chat and Tasks on phones: orb + "nurora" +
 * today's date on the left, profile avatar on the right. Same markup on
 * every screen, so they can't drift apart.
 *
 * Phones: fixed 72px tall (+ status-bar safe area, see --mobile-header-h),
 * translucent blurred background, and a hairline that fades in once
 * `scrollRef` has scrolled. Tablet/desktop: plain (Chat only shows it there).
 *
 * `className` / `rowClassName` are for tablet/desktop (md:) tweaks only.
 * `actions`: extra phone-only icon buttons left of the avatar (Chat only).
 */
export function MobileHeader({
  scrollRef,
  className,
  rowClassName,
  actions,
}: {
  scrollRef?: RefObject<HTMLElement | null>;
  className?: string;
  rowClassName?: string;
  actions?: ReactNode;
}) {
  const now = useNow();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 2);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={cn(
        "sticky top-0 z-30 shrink-0 bg-background/70 pt-[env(safe-area-inset-top)] backdrop-blur-lg",
        // Hairline drawn on top (takes no height, so the bar stays exactly 72px).
        "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-border after:opacity-0 after:transition-opacity after:duration-200 data-scrolled:after:opacity-100",
        "md:static md:bg-transparent md:backdrop-blur-none md:after:hidden",
        className,
      )}
    >
      <div className={cn("flex h-18 items-center gap-3 px-4 md:h-auto", rowClassName)}>
        <Orb size={32} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg">nurora</p>
          <p className="truncate text-meta text-muted-foreground">
            {now ? formatLongDate(now) : " "}
          </p>
        </div>
        <div className="flex items-center md:hidden">
          {actions}
          <ProfileMenu variant="avatar" />
        </div>
      </div>
    </header>
  );
}
