// Per-user profile (name, tone, check-in times). localStorage for now,
// behind these functions so Supabase can replace it in Slice 2.

import { useSyncExternalStore } from "react";
import { PROFILES_KEY } from "./auth-script";
import { getSession, useSession } from "./auth";

export type Tone = "gentle" | "hype" | "islamic" | "chill";
export type NotificationChoice = "granted" | "denied" | "later" | "unsupported";

export type Profile = {
  name: string;
  tone: Tone;
  /** "HH:mm" in the user's timezone. */
  briefTime: string;
  checkinTime: string;
  notifications: NotificationChoice | null;
  /** Set when onboarding is finished or skipped; it's then never shown again. */
  onboardedAt: string | null;
};

export const DEFAULT_PROFILE: Profile = {
  name: "",
  tone: "gentle",
  briefTime: "07:30",
  checkinTime: "21:30",
  notifications: null,
  onboardedAt: null,
};

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedProfiles: Record<string, Profile> = {};

function readProfiles(): Record<string, Profile> {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(PROFILES_KEY);
  } catch {
    // ignore
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedProfiles = raw ? JSON.parse(raw) : {};
    } catch {
      cachedProfiles = {};
    }
  }
  return cachedProfiles;
}

/** The signed-in user's profile (defaults filled in), or null when logged out. */
export function getProfile(): Profile | null {
  const session = getSession();
  if (!session) return null;
  const stored = readProfiles()[session.userId];
  return stored ? { ...DEFAULT_PROFILE, ...stored } : DEFAULT_PROFILE;
}

export function updateProfile(patch: Partial<Profile>) {
  const session = getSession();
  if (!session) return;
  const profiles = readProfiles();
  const next = { ...profiles, [session.userId]: { ...DEFAULT_PROFILE, ...profiles[session.userId], ...patch } };
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked.
  }
  listeners.forEach((listener) => listener());
}

export function completeOnboarding(patch: Partial<Profile> = {}) {
  updateProfile({ ...patch, onboardedAt: new Date().toISOString() });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The signed-in user's profile; undefined while loading, null when logged out. */
export function useProfile(): Profile | null | undefined {
  const session = useSession();
  const profiles = useSyncExternalStore(subscribe, readProfiles, () => undefined);
  if (session === undefined || profiles === undefined) return undefined;
  if (session === null) return null;
  const stored = profiles[session.userId];
  return stored ? { ...DEFAULT_PROFILE, ...stored } : DEFAULT_PROFILE;
}

/** First name for greetings, or "" if the user didn't give one. */
export function useDisplayName(): string {
  return useProfile()?.name.trim() ?? "";
}
