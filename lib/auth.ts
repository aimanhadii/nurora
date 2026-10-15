// FAKE authentication, backed by localStorage. Components only use the
// functions and hook below, so Supabase Auth can replace this file in
// Slice 2 without touching the UI.

import { useSyncExternalStore } from "react";
import { ACCOUNTS_KEY, SESSION_KEY } from "./auth-script";
import { newId } from "./id";

export type AuthProvider = "google" | "email";

export type Session = {
  userId: string;
  email: string;
  provider: AuthProvider;
  signedInAt: string;
};

type Account = { userId: string; email: string; createdAt: string };

export type SignInResult =
  | { ok: true; session: Session; isNewUser: boolean }
  | { ok: false; error: string };

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedSession: Session | null = null;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked: the session just won't survive a reload.
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

/** The signed-in user, or null. (Always null on the server.) */
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  // Re-parse only when the stored value changes, so the hook gets a stable object.
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(SESSION_KEY);
  } catch {
    // ignore
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedSession = raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      cachedSession = null;
    }
  }
  return cachedSession;
}

function startSession(email: string, provider: AuthProvider, mode: "signup" | "login"): SignInResult {
  const accounts = readJson<Record<string, Account>>(ACCOUNTS_KEY, {});
  const key = email.toLowerCase();
  const existing = accounts[key];

  if (!existing && mode === "login" && provider === "email") {
    return { ok: false, error: "We couldn't find an account with that email." };
  }

  const account = existing ?? { userId: newId(), email, createdAt: new Date().toISOString() };
  if (!existing) writeJson(ACCOUNTS_KEY, { ...accounts, [key]: account });

  const session: Session = {
    userId: account.userId,
    email: account.email,
    provider,
    signedInAt: new Date().toISOString(),
  };
  writeJson(SESSION_KEY, session);
  emit();
  return { ok: true, session, isNewUser: !existing };
}

/** Fake Google sign-in: always succeeds as the same demo Google account. */
export function signInWithGoogle(): SignInResult {
  return startSession("you@gmail.com", "google", "signup");
}

/** Fake email sign-in. "signup" creates the account if needed; "login" needs it to exist. */
export function signInWithEmail(email: string, mode: "signup" | "login" = "signup"): SignInResult {
  const clean = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  return startSession(clean, "email", mode);
}

export function signOut() {
  writeJson(SESSION_KEY, null);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Signing in or out in another tab.
  const onStorage = (e: StorageEvent) => e.key === SESSION_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** undefined while loading (server / first render), then Session or null. */
export function useSession(): Session | null | undefined {
  return useSyncExternalStore(subscribe, getSession, () => undefined);
}
