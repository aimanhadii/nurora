"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile";

/** On public pages: a signed-in user goes to /home (or /onboarding if unfinished). */
export function RedirectIfSignedIn() {
  const router = useRouter();
  const profile = useProfile();

  useEffect(() => {
    if (profile) router.replace(profile.onboardedAt ? "/home" : "/onboarding");
  }, [profile, router]);

  return null;
}
