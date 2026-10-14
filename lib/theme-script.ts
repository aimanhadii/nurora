// Server-safe theme constants. Kept apart from lib/theme.ts (which uses
// React hooks) so the root layout, a Server Component, can import them.

export const THEME_STORAGE_KEY = "teman:theme";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Inlined into <head> so the right theme is set before the first paint
 * (no white flash in dark mode). Also follows OS changes while "system".
 */
export const themeScript = `(function(){var m=window.matchMedia("${DARK_QUERY}");function a(){var p;try{p=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}var d=p==="dark"||(p!=="light"&&m.matches);document.documentElement.dataset.theme=d?"dark":"light"}a();m.addEventListener("change",a)})()`;
