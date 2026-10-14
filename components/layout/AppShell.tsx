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
 * Tablet: collapsible sidebar | content.
 * Desktop: a 3-column grid — sidebar | chat | "Today" panel.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const onChat = pathname.startsWith("/chat");

  return (
    <>
      <GlowBackground />
      <ViewportSync />

      <div
        className={`relative z-10 h-[var(--app-h)] md:grid md:grid-rows-[minmax(0,1fr)] md:gap-4 md:p-4 ${
          onChat
            ? "md:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_340px]"
            : "md:grid-cols-[auto_minmax(0,1fr)]"
        }`}
      >
        <Sidebar />
        <main className="relative h-full min-h-0 min-w-0">{children}</main>
        {onChat && <TodayPanel />}
      </div>

      <BottomNav />
      <Toast />
    </>
  );
}
