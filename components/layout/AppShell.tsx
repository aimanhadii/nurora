"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TodayPanel } from "@/components/tasks/TodayPanel";
import { Toast } from "@/components/ui/Toast";
import { BottomNav } from "./BottomNav";
import { GlowBackground } from "./GlowBackground";
import { Sidebar } from "./Sidebar";
import { ViewportSync } from "./ViewportSync";

/**
 * Phone: full-screen content + floating tab bar.
 * Tablet: collapsible sidebar + content.
 * Desktop: sidebar + chat + "Today" panel, floating with gaps.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const onChat = pathname.startsWith("/chat");

  return (
    <>
      <GlowBackground />
      <ViewportSync />

      {/* Solid strip under the iPhone status bar so text doesn't scroll behind the clock. */}
      <div className="fixed inset-x-0 top-0 z-40 h-[env(safe-area-inset-top)] bg-bg/85 md:hidden" />

      <div className="relative z-10 flex h-[var(--app-h)] overflow-hidden md:gap-3 md:p-3">
        <Sidebar />
        <main className="relative min-w-0 flex-1">{children}</main>
        {onChat && <TodayPanel />}
      </div>

      <BottomNav />
      <Toast />
    </>
  );
}
