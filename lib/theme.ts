import { useSyncExternalStore } from "react";
import { DARK_QUERY, THEME_STORAGE_KEY } from "./theme-script";

export type ThemePreference = "light" | "dark" | "system";

const listeners = new Set<() => void>();
let switchTimer: ReturnType<typeof setTimeout> | undefined;

function readPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "dark" || value === "system") return value;
  } catch {
    // Storage blocked: use the default.
  }
  return "light";
}

export function setThemePreference(preference: ThemePreference) {
  try {
    if (preference === "light") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Still apply it for this visit.
  }

  const root = document.documentElement;
  const dark =
    preference === "dark" ||
    (preference === "system" && window.matchMedia(DARK_QUERY).matches);

  // Fade colours for a moment instead of snapping (see .theme-switching).
  root.classList.add("theme-switching");
  clearTimeout(switchTimer);
  switchTimer = setTimeout(() => root.classList.remove("theme-switching"), 400);

  root.dataset.theme = dark ? "dark" : "light";
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // "System" can flip on its own when the phone switches to dark mode.
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", listener);
  };
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, readPreference, () => "light");
}

/** The theme actually showing right now ("system" resolved). */
export function useResolvedTheme(): "light" | "dark" {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => "light",
  );
}
