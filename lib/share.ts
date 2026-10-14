import { showToast } from "./toast";

/** Copies text; falls back to the old execCommand trick on plain http. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the fallback below.
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  return ok;
}

/** Opens the native share sheet when available, otherwise copies. */
export async function shareText(text: string) {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return;
    } catch (error) {
      // User closed the share sheet: nothing to do.
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }
  showToast((await copyText(text)) ? "Copied to clipboard" : "Couldn't copy");
}
