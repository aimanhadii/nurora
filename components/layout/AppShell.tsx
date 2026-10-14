"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "./BottomNav";
import { GlowBackground } from "./GlowBackground";
import { Sidebar } from "./Sidebar";
import { ViewportSync } from "./ViewportSync";

/** Ctrl/⌘ + Shift + O starts a new chat from anywhere. */
function useNewChatShortcut() {
  const router = useRouter();
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        router.push("/chat/new");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);
}

/**
 * Phone: full-screen page + bottom tab bar.
 * Tablet: icon sidebar (expandable) + page.
 * Desktop: 248px sidebar + page (content max 1120px, centred).
 *
 * The sidebar and tab bar read the URL to highlight the current page; on
 * /chat/[id] that's only known at request time, so they sit in <Suspense>.
 */
export function AppShell({ children }: { children: ReactNode }) {
  useNewChatShortcut();

  return (
    <TooltipProvider delayDuration={300}>
      <GlowBackground />
      <ViewportSync />

      <div className="relative z-10 flex h-[var(--app-h)]">
        <Suspense fallback={<div className="hidden w-16 shrink-0 border-r md:block xl:w-62" />}>
          <Sidebar />
        </Suspense>
        <main className="h-full min-w-0 flex-1">{children}</main>
      </div>

      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
      <Toaster />
    </TooltipProvider>
  );
}
