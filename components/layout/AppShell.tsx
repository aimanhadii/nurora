"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "./BottomNav";
import { GlowBackground } from "./GlowBackground";
import { Sidebar } from "./Sidebar";
import { ViewportSync } from "./ViewportSync";

/**
 * Phone: full-screen page + bottom tab bar.
 * Tablet: icon sidebar (expandable) + page.
 * Desktop: 248px sidebar + page (content max 1120px, centred).
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={300}>
      <GlowBackground />
      <ViewportSync />

      {/* Solid strip under the iPhone status bar so content doesn't scroll behind the clock. */}
      <div className="fixed inset-x-0 top-0 z-40 h-[env(safe-area-inset-top)] bg-background/90 backdrop-blur-xl md:hidden" />

      <div className="relative z-10 flex h-[var(--app-h)]">
        <Sidebar />
        <main className="h-full min-w-0 flex-1">{children}</main>
      </div>

      <BottomNav />
      <Toaster />
    </TooltipProvider>
  );
}
