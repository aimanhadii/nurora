import { useSyncExternalStore } from "react";

/** True when the CSS media query matches. Always false on the server. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (listener) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Tablet and up (≥768px): dialogs instead of bottom sheets. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 48rem)");
}
