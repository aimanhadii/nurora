"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Orb } from "@/components/ui/Orb";
import { Surface } from "@/components/ui/Surface";
import { NAV_ITEMS } from "./nav-items";
import { ProfileMenu } from "./ProfileMenu";

/** Navigation panel for tablet and desktop. Can fold to an icon rail. */
export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <Surface
      as="aside"
      variant="glass"
      className={`hidden h-full flex-col rounded-card p-3 transition-[width] duration-300 ease-out md:flex ${
        collapsed ? "w-[76px] items-center" : "w-[260px]"
      }`}
    >
      <div
        className={`flex gap-2 ${collapsed ? "flex-col items-center" : "items-center justify-between pl-1.5"}`}
      >
        <div className="flex items-center gap-2.5">
          <Orb size={30} />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight">teman</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="flex size-11 items-center justify-center rounded-full text-text-3 transition hover:bg-surface-2 hover:text-text"
        >
          <ToggleIcon className="size-[18px]" strokeWidth={1.5} />
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
                      ? "bg-accent-soft text-accent shadow-active"
                      : "text-text-2 hover:bg-surface-2 hover:text-text"
                  }`}
                >
                  <Icon className="size-[18px] shrink-0" strokeWidth={1.5} />
                  <span className={collapsed ? "sr-only" : ""}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto w-full">
        <ProfileMenu variant={collapsed ? "pill-collapsed" : "pill"} />
      </div>
    </Surface>
  );
}
