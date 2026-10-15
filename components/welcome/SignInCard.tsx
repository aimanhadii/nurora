"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { signInWithEmail, signInWithGoogle, type SignInResult } from "@/lib/auth";
import { getProfile } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "./GoogleIcon";

type Mode = "signup" | "login";

/**
 * Google + email sign-in. "card" (desktop) shows the email field straight
 * away; "compact" (phones, pinned to the bottom) reveals it on tap.
 */
export function SignInCard({ variant }: { variant: "card" | "compact" }) {
  const router = useRouter();
  const id = useId();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showEmail, setShowEmail] = useState(variant === "card");

  function finish(result: SignInResult) {
    if (!result.ok) {
      setError(result.error);
      return;
    }
    // New accounts (or ones that never finished onboarding) go to onboarding.
    router.replace(getProfile()?.onboardedAt ? "/home" : "/onboarding");
  }

  function handleEmail(e: FormEvent) {
    e.preventDefault();
    finish(signInWithEmail(email, mode));
  }

  const isLogin = mode === "login";

  return (
    <div className="space-y-4">
      {variant === "card" && (
        <div className="space-y-1">
          <h2 className="font-display text-xl">{isLogin ? "Welcome back" : "Get started"}</h2>
          <p className="text-meta text-muted-foreground">
            {isLogin ? "Log in to pick up where you left off." : "Create your account in a few seconds."}
          </p>
        </div>
      )}

      <Button variant="outline" className="h-11 w-full gap-3" onClick={() => finish(signInWithGoogle())}>
        <GoogleIcon className="size-5" />
        Continue with Google
      </Button>

      {showEmail ? (
        <form onSubmit={handleEmail} className="space-y-3" noValidate>
          {variant === "card" && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground" aria-hidden="true">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor={`${id}-email`} className="block text-sm font-medium">
              Email
            </label>
            <Input
              id={`${id}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              autoFocus={variant === "compact"}
            />
            {error && (
              <p id={`${id}-error`} role="alert" className="text-meta text-destructive">
                {error}
              </p>
            )}
          </div>
          <Button type="submit" className="h-11 w-full gap-2">
            <Mail strokeWidth={1.5} />
            {isLogin ? "Log in with email" : "Continue with email"}
          </Button>
        </form>
      ) : (
        <Button className="h-11 w-full gap-2" onClick={() => setShowEmail(true)}>
          <Mail strokeWidth={1.5} />
          Continue with email
        </Button>
      )}

      <p className={cn("text-center text-meta text-muted-foreground", variant === "compact" && "pb-1")}>
        {isLogin ? "New here? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setMode(isLogin ? "signup" : "login");
            setShowEmail(true);
            setError(null);
          }}
          className="inline-flex min-h-11 items-center font-medium text-brand-text underline-offset-4 outline-none hover:underline focus-visible:underline md:min-h-0"
        >
          {isLogin ? "Create an account" : "Log in"}
        </button>
      </p>
    </div>
  );
}
