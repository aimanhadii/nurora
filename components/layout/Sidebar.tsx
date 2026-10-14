"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsUpDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { PLACEHOLDER_PROFILE } from "@/lib/profile";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NAV_ITEMS } from "./nav-items";

export function LogoMark() {
  return (
    <span className="accent-fill flex size-9 shrink-0 items-center justify-center rounded-xl text-base font-bold">
      t
    </span>
  );
}

export function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-135 from-accent-solid to-accent-2 text-sm font-semibold"
    >
      {name[0]}
    </span>
  );
}

/** Glass navigation panel for tablet and desktop. Can fold to an icon rail. */
export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const name = PLACEHOLDER_PROFILE.name;

  return (
    <GlassPanel
      as="aside"
      className={`hidden shrink-0 flex-col rounded-panel p-3 transition-[width] duration-300 ease-out md:flex ${
        collapsed ? "w-[76px] items-center" : "w-60"
      }`}
    >
      <div
        className={`flex gap-2 ${collapsed ? "flex-col items-center" : "items-center justify-between pl-1"}`}
      >
        <div className="flex items-center gap-2.5">
          <LogoMark />
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight">teman</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="flex size-11 items-center justify-center rounded-full text-fg-3 transition hover:bg-glass-hover hover:text-fg"
        >
          <ToggleIcon className="size-[18px]" strokeWidth={1.75} />
        </button>
      </div>

      <nav aria-label="Main" className="mt-6 w-full">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? label : undefined}
                  className={`flex h-11 items-center gap-3 rounded-full text-[15px] font-medium transition ${
                    collapsed ? "justify-center" : "px-4"
                  } ${
                    active
                      ? "glass-flat text-fg"
                      : "border border-transparent text-fg-2 hover:bg-glass-hover hover:text-fg"
                  }`}
                >
                  <Icon
                    className={`size-[18px] shrink-0 ${active ? "text-accent" : ""}`}
                    strokeWidth={1.75}
                  />
                  <span className={collapsed ? "sr-only" : ""}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={`mt-auto flex h-12 items-center gap-3 rounded-full glass-flat ${
          collapsed ? "w-12 justify-center" : "w-full pr-3 pl-2"
        }`}
      >
        <Avatar name={name} />
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {name}
            </span>
            <ChevronsUpDown
              className="size-4 text-fg-3"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </>
        )}
      </div>
    </GlassPanel>
  );
}
