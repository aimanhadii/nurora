"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLACEHOLDER_PROFILE } from "@/lib/profile";
import { NAV_ITEMS } from "./nav-items";
import { ThemeSegmented } from "./ThemeToggle";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-[10px] bg-accent text-sm font-bold text-accent-fg">
        t
      </span>
      <span className="text-lg font-semibold tracking-tight">teman</span>
    </div>
  );
}

/** Left navigation for tablet and desktop. */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-bg px-3 py-5 md:flex lg:w-60">
      <div className="px-2">
        <Logo />
      </div>

      <nav aria-label="Main" className="mt-8">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-surface-2 text-fg"
                      : "text-muted hover:bg-surface-2/60 hover:text-fg"
                  }`}
                >
                  <Icon className="size-[18px]" strokeWidth={1.75} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-4">
        <ThemeSegmented />
        <div className="flex items-center gap-3 px-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-surface-2 text-sm font-medium">
            {PLACEHOLDER_PROFILE.name[0]}
          </span>
          <span className="text-sm font-medium">
            {PLACEHOLDER_PROFILE.name}
          </span>
        </div>
      </div>
    </aside>
  );
}
