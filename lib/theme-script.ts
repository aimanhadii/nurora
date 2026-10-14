// Server-safe theme constants. Kept apart from lib/theme.ts (which uses
// React hooks) so the root layout, a Server Component, can import them.

export const THEME_STORAGE_KEY = "ilmora:theme";
/** The key used before the app was renamed; migrated once, then removed. */
export const LEGACY_THEME_STORAGE_KEY = "teman:theme";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Inlined into <head> so the saved theme is applied before the first
 * paint (no flash). Light is the default; "system" follows the phone.
 * Also moves a theme saved under the old app name to the new key.
 */
export const themeScript = `(function(){var m=window.matchMedia("${DARK_QUERY}");try{var o=localStorage.getItem("${LEGACY_THEME_STORAGE_KEY}");if(o!==null){if(localStorage.getItem("${THEME_STORAGE_KEY}")===null)localStorage.setItem("${THEME_STORAGE_KEY}",o);localStorage.removeItem("${LEGACY_THEME_STORAGE_KEY}")}}catch(e){}function a(){var p;try{p=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}var d=p==="dark"||(p==="system"&&m.matches);document.documentElement.dataset.theme=d?"dark":"light"}a();m.addEventListener("change",a)})()`;
