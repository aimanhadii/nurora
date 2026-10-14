"use client";

import { useEffect } from "react";

/**
 * iOS doesn't shrink the page when the keyboard opens; it slides the page
 * up instead, which can hide the chat input. This watches the *visible*
 * area (visualViewport) and, while the keyboard is up:
 *  - sets --app-h to the visible height so the layout fits above it,
 *  - sets --kb to the keyboard height (used by the bottom sheet),
 *  - adds data-keyboard to <html> (hides the tab bar).
 */
export function ViewportSync() {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const root = document.documentElement;

    function sync() {
      if (!vv) return;
      const keyboard = window.innerHeight - vv.height;
      const open = keyboard > 120;
      root.style.setProperty("--kb", open ? `${keyboard}px` : "0px");
      root.style.setProperty("--app-h", open ? `${vv.height}px` : "100dvh");
      if (open) {
        root.dataset.keyboard = "";
        // Undo iOS sliding the whole page up.
        if (window.scrollY !== 0) window.scrollTo(0, 0);
      } else {
        delete root.dataset.keyboard;
      }
    }

    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
    };
  }, []);

  return null;
}
