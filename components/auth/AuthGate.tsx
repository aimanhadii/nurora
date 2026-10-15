"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile";

/**
 * Guards app pages during in-app navigation: logged out → "/", not yet
 * onboarded → "/onboarding". (Full page loads are already redirected
 * before paint by the script in lib/auth-script.ts.) Children render
 * meanwhile, so their loading skeletons still show on first paint.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const profile = useProfile();

  useEffect(() => {
    if (profile === null) router.replace("/");
    else if (profile && !profile.onboardedAt) router.replace("/onboarding");
  }, [profile, router]);

  return children;
}
