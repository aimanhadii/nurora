// crypto.randomUUID only exists on https/localhost, and the phone hits
// the dev server over plain http on the LAN, so fall back gracefully.
export function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
}
