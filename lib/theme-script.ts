// Server-safe theme constants. Kept apart from lib/theme.ts (which uses
// React hooks) so the root layout, a Server Component, can import them.

export const THEME_STORAGE_KEY = "teman:theme";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Inlined into <head> so the saved theme is applied before the first
 * paint (no flash). Light is the default; "system" follows the phone.
 */
export const themeScript = `(function(){var m=window.matchMedia("${DARK_QUERY}");function a(){var p;try{p=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}var d=p==="dark"||(p==="system"&&m.matches);document.documentElement.dataset.theme=d?"dark":"light"}a();m.addEventListener("change",a)})()`;
