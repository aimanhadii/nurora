"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TodayPanel } from "@/components/tasks/TodayPanel";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

/**
 * Phone: content + bottom tab bar.
 * Tablet: sidebar + content.
 * Desktop: sidebar + chat + today's tasks side by side.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const onChat = pathname.startsWith("/chat");

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <main className="relative min-w-0 flex-1">{children}</main>
      {onChat && <TodayPanel />}
      <BottomNav />
    </div>
  );
}
