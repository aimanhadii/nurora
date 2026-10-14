// Server-safe theme constants. Kept apart from lib/theme.ts (which uses
// React hooks) so the root layout, a Server Component, can import them.

export const THEME_STORAGE_KEY = "nurora:theme";
/** Keys used under the app's earlier names (newest first); migrated once, then removed. */
export const LEGACY_THEME_STORAGE_KEYS = ["ilmora:theme", "teman:theme"];
export const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Inlined into <head> so the saved theme is applied before the first
 * paint (no flash). Light is the default; "system" follows the phone.
 * Also moves a theme saved under an old app name to the current key.
 */
export const themeScript = `(function(){var m=window.matchMedia("${DARK_QUERY}");try{${JSON.stringify(LEGACY_THEME_STORAGE_KEYS)}.forEach(function(k){var o=localStorage.getItem(k);if(o!==null){if(localStorage.getItem("${THEME_STORAGE_KEY}")===null)localStorage.setItem("${THEME_STORAGE_KEY}",o);localStorage.removeItem(k)}})}catch(e){}function a(){var p;try{p=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}var d=p==="dark"||(p==="system"&&m.matches);document.documentElement.dataset.theme=d?"dark":"light"}a();m.addEventListener("change",a)})()`;
