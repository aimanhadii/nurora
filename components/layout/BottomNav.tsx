"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Surface } from "@/components/ui/Surface";
import { NAV_ITEMS } from "./nav-items";

/** Floating tab bar for phones. Hidden while the keyboard is open. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="bottom-nav pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-[max(env(safe-area-inset-bottom),0.75rem)] md:hidden"
    >
      <Surface
        as="ul"
        variant="glass"
        className="pointer-events-auto flex h-16 w-full max-w-72 gap-1 rounded-full p-1.5"
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-semibold transition active:scale-95 ${
                  active ? "bg-accent-soft text-accent" : "text-text-3"
                }`}
              >
                <Icon className="size-[22px]" strokeWidth={1.5} />
                {label}
              </Link>
            </li>
          );
        })}
      </Surface>
    </nav>
  );
}
