"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLocalData } from "@/lib/local-store";
import { taskTimeLabel } from "@/lib/tasks/format";
import {
  countdown,
  lastSevenDays,
  nextUpTask,
  streakDays,
} from "@/lib/tasks/stats";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Orb } from "@/components/ui/Orb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAV_ITEMS } from "./nav-items";
import { ProfileMenu } from "./ProfileMenu";

// "auto" = icon rail on tablets, full sidebar on desktop (pure CSS, so no
// layout jump on load). Clicking the toggle pins one or the other.
type Mode = "auto" | "expanded" | "collapsed";

const WIDTH: Record<Mode, string> = {
  auto: "w-16 xl:w-62",
  expanded: "w-62",
  collapsed: "w-16",
};
const SHOW_WHEN_EXPANDED: Record<Mode, string> = {
  auto: "hidden xl:flex",
  expanded: "flex",
  collapsed: "hidden",
};
const SHOW_WHEN_COLLAPSED: Record<Mode, string> = {
  auto: "flex xl:hidden",
  expanded: "hidden",
  collapsed: "flex",
};

export function Sidebar() {
  const [mode, setMode] = useState<Mode>("auto");

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 border-r bg-card/60 backdrop-blur-xl transition-[width] duration-200 ease-out md:block",
        WIDTH[mode],
      )}
    >
      <ExpandedSidebar
        className={SHOW_WHEN_EXPANDED[mode]}
        onCollapse={() => setMode("collapsed")}
      />
      <CollapsedSidebar
        className={SHOW_WHEN_COLLAPSED[mode]}
        onExpand={() => setMode("expanded")}
      />
    </aside>
  );
}

function ExpandedSidebar({
  className,
  onCollapse,
}: {
  className: string;
  onCollapse: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className={cn("h-full flex-col gap-6 p-4", className)}>
      <div className="flex items-center gap-3 pl-1">
        <Orb size={28} />
        <span className="flex-1 font-display text-xl font-semibold">
          ilmora
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onCollapse}
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Collapse</TooltipContent>
        </Tooltip>
      </div>

      <nav aria-label="Main">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40",
                    active
                      ? "bg-brand-soft text-brand"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.5} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-3">
        <SidebarInsights />
        <ProfileMenu variant="pill" />
      </div>
    </div>
  );
}

function startsIn(dueAt: string, now: Date): string {
  const left = countdown(dueAt, now);
  return left === "now" ? "now" : `in ${left}`;
}

/** "Next up" mini card + streak, so the sidebar earns its space. */
function SidebarInsights() {
  const data = useLocalData();
  const now = useNow(15_000);
  const pathname = usePathname();
  if (!data || !now) return null;

  // Home already shows a big Next up card; don't repeat it here.
  const showNextUp = !pathname.startsWith("/home");

  const next = nextUpTask(data.tasks, now);
  const streak = streakDays(data.tasks, now);
  const week = lastSevenDays(data.tasks, now);

  return (
    <div className="space-y-3 rounded-xl border bg-card p-3">
      {showNextUp && (
        <Link
          href="/tasks"
          className="block rounded-lg p-1 outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <p className="text-xs font-medium text-muted-foreground">Next up</p>
          {next ? (
            <>
              <p className="mt-1 truncate text-sm font-medium">{next.title}</p>
              <p className="mt-1 flex items-center justify-between gap-2 font-mono text-xs tabular-nums text-muted-foreground">
                <span className="truncate">{taskTimeLabel(next, now)}</span>
                <span className="shrink-0 text-brand">
                  {startsIn(next.dueAt!, now)}
                </span>
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Nothing scheduled
            </p>
          )}
        </Link>
      )}
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-1",
          showNextUp && "border-t pt-3",
        )}
      >
        <p className="text-meta font-medium whitespace-nowrap">
          <span aria-hidden="true">🔥 </span>
          {streak}-day streak
        </p>
        <div className="flex shrink-0 gap-1" aria-hidden="true">
          {week.map((d) => (
            <span
              key={d.key}
              className={cn(
                "size-1.5 rounded-full",
                d.count > 0 ? "bg-brand" : "bg-foreground/15",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CollapsedSidebar({
  className,
  onExpand,
}: {
  className: string;
  onExpand: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className={cn("h-full flex-col items-center gap-4 py-4", className)}>
      <Orb size={28} />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExpand}
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen strokeWidth={1.5} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Expand</TooltipContent>
      </Tooltip>

      <nav aria-label="Main">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      aria-label={label}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40",
                        active
                          ? "bg-brand-soft text-brand"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <Icon className="size-5" strokeWidth={1.5} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto">
        <ProfileMenu variant="icon" />
      </div>
    </div>
  );
}
