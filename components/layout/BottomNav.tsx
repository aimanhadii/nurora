"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NAV_ITEMS } from "./nav-items";

/** Floating glass tab bar for phones. Hidden while the keyboard is open. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="bottom-nav pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-[max(env(safe-area-inset-bottom),0.75rem)] md:hidden"
    >
      <GlassPanel
        as="ul"
        className="pointer-events-auto flex h-16 w-full max-w-72 gap-1 rounded-full p-1.5"
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium transition active:scale-95 ${
                  active ? "bg-glass-hover text-fg" : "text-fg-3"
                }`}
              >
                <Icon
                  className={`size-[22px] ${active ? "text-accent" : ""}`}
                  strokeWidth={active ? 2 : 1.6}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </GlassPanel>
    </nav>
  );
}
