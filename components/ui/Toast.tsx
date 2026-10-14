"use client";

import { dismissToast, useToast } from "@/lib/toast";
import { GlassPanel } from "./GlassPanel";

export function Toast() {
  const toast = useToast();

  return (
    // Always in the page so screen readers hear new messages.
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--nav-h)+6.5rem)] z-40 flex justify-center px-4 md:bottom-28"
    >
      {toast && (
        <GlassPanel
          key={toast.id}
          strength="strong"
          className="pointer-events-auto flex min-h-11 animate-message-in items-center gap-3 rounded-full py-1.5 pr-1.5 pl-5 text-sm"
        >
          <span>{toast.message}</span>
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.run();
                dismissToast();
              }}
              className="h-9 rounded-full px-4 font-semibold text-accent hover:bg-glass-hover"
            >
              {toast.action.label}
            </button>
          )}
        </GlassPanel>
      )}
    </div>
  );
}
