"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BellRing, Check } from "lucide-react";
import {
  completeOnboarding,
  DEFAULT_PROFILE,
  useProfile,
  type NotificationChoice,
  type Profile,
  type Tone,
} from "@/lib/profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Orb } from "@/components/ui/Orb";
import { GlowBackground } from "@/components/layout/GlowBackground";

const STEPS = 4;

const TONES: { value: Tone; label: string; example: string }[] = [
  { value: "gentle", label: "Gentle", example: "Go easy on yourself today. Small steps still count." },
  { value: "hype", label: "Hype", example: "You've got this. Let's go make today count!" },
  { value: "islamic", label: "Islamic", example: "Bismillah. Do your best, and leave the rest to Allah." },
  { value: "chill", label: "Chill", example: "No rush. One thing at a time, you're doing fine." },
];

type Draft = Pick<Profile, "name" | "tone" | "briefTime" | "checkinTime">;

/** Four short steps after sign-up. Shown once; Skip finishes with what's filled in. */
export function OnboardingFlow() {
  const router = useRouter();
  const profile = useProfile();
  const id = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [notifications, setNotifications] = useState<NotificationChoice | null>(null);

  // Not signed in → welcome. Already onboarded → home.
  useEffect(() => {
    if (profile === null) router.replace("/");
    else if (profile?.onboardedAt) router.replace("/home");
  }, [profile, router]);

  // Move focus to the new step's heading (screen readers announce it).
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const values: Draft = draft ?? {
    name: profile?.name ?? DEFAULT_PROFILE.name,
    tone: profile?.tone ?? DEFAULT_PROFILE.tone,
    briefTime: profile?.briefTime ?? DEFAULT_PROFILE.briefTime,
    checkinTime: profile?.checkinTime ?? DEFAULT_PROFILE.checkinTime,
  };
  const set = (patch: Partial<Draft>) => setDraft({ ...values, ...patch });

  function finish(choice: NotificationChoice | null = notifications) {
    completeOnboarding({ ...values, name: values.name.trim(), notifications: choice });
    router.replace("/home");
  }

  function next(e?: FormEvent) {
    e?.preventDefault();
    if (step < STEPS - 1) setStep(step + 1);
  }

  async function enableNotifications() {
    if (!("Notification" in window) || !window.isSecureContext) {
      setNotifications("unsupported");
      return;
    }
    const result = await Notification.requestPermission();
    setNotifications(result === "granted" ? "granted" : "denied");
  }

  if (!profile || profile.onboardedAt) return <div className="min-h-dvh" />;

  const heading = (text: string) => (
    <h1 ref={headingRef} tabIndex={-1} className="font-display text-3xl outline-none md:text-4xl">
      {text}
    </h1>
  );

  return (
    <div className="relative min-h-dvh">
      <GlowBackground />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-[calc(env(safe-area-inset-bottom)+16px)] md:pt-8">
        <header className="flex items-center gap-3">
          <Orb size={32} />
          <span className="flex-1 font-display text-lg">nurora</span>
          <Button variant="ghost" className="h-11 md:h-9" onClick={() => finish()}>
            Skip
          </Button>
        </header>

        <div className="mt-8 flex items-center gap-2" aria-hidden="true">
          {Array.from({ length: STEPS }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-6 bg-brand" : i < step ? "w-1.5 bg-brand/50" : "w-1.5 bg-foreground/15",
              )}
            />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Step {step + 1} of {STEPS}
        </p>

        <form onSubmit={next} className="mt-6 flex flex-1 flex-col md:flex-none">
          <div key={step} className="flex-1 animate-fade-in space-y-6 md:flex-none">
            {step === 0 && (
              <>
                {heading("What should I call you?")}
                <div className="space-y-2">
                  <label htmlFor={`${id}-name`} className="block text-sm font-medium">
                    Your name
                  </label>
                  <Input
                    id={`${id}-name`}
                    value={values.name}
                    onChange={(e) => set({ name: e.target.value })}
                    placeholder="e.g. Aiman"
                    autoComplete="given-name"
                    maxLength={40}
                  />
                  <p className="text-meta text-muted-foreground">I&apos;ll use it in greetings.</p>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                {heading("How should I talk to you?")}
                <fieldset className="grid gap-3 sm:grid-cols-2">
                  <legend className="sr-only">Tone</legend>
                  {TONES.map((tone) => (
                    <label
                      key={tone.value}
                      className="group relative flex cursor-pointer flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-foreground/20 has-checked:border-brand has-checked:bg-brand-soft has-focus-visible:ring-3 has-focus-visible:ring-ring/40"
                    >
                      <input
                        type="radio"
                        name={`${id}-tone`}
                        value={tone.value}
                        checked={values.tone === tone.value}
                        onChange={() => set({ tone: tone.value })}
                        className="sr-only"
                      />
                      <span className="flex items-center justify-between text-sm font-medium">
                        {tone.label}
                        <Check className="size-4 text-brand opacity-0 group-has-checked:opacity-100" strokeWidth={2} />
                      </span>
                      <span className="font-display text-base text-muted-foreground">{tone.example}</span>
                    </label>
                  ))}
                </fieldset>
              </>
            )}

            {step === 2 && (
              <>
                {heading("When should I check in?")}
                <div className="grid gap-4 sm:grid-cols-2">
                  <TimeField
                    id={`${id}-brief`}
                    label="Morning brief"
                    hint="Your plan for the day"
                    value={values.briefTime}
                    onChange={(briefTime) => set({ briefTime })}
                  />
                  <TimeField
                    id={`${id}-checkin`}
                    label="Evening check-in"
                    hint="Wrap up and plan tomorrow"
                    value={values.checkinTime}
                    onChange={(checkinTime) => set({ checkinTime })}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {heading("Turn on reminders")}
                <div className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <BellRing className="size-[18px]" strokeWidth={1.5} />
                  </span>
                  <p className="text-sm text-muted-foreground">
                    A nudge before tasks are due, plus your morning brief and evening check-in.
                  </p>
                </div>
                <NotificationNote choice={notifications} />
              </>
            )}
          </div>

          {/* Last step, before choosing: the main action gets its own full-width
              row so three buttons never squeeze off a narrow screen. */}
          {step === STEPS - 1 && notifications === null && (
            <Button type="button" className="mt-8 h-11 w-full" onClick={enableNotifications}>
              Enable notifications
            </Button>
          )}
          <div className={cn("flex items-center gap-3", step === STEPS - 1 && notifications === null ? "mt-3" : "mt-8")}>
            <Button
              type="button"
              variant="ghost"
              className={cn("h-11", step === 0 && "invisible")}
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
            <div className="ml-auto">
              {step < STEPS - 1 ? (
                <Button type="submit" className="h-11 px-6">
                  Continue
                </Button>
              ) : notifications === null ? (
                <Button type="button" variant="ghost" className="h-11" onClick={() => finish("later")}>
                  Maybe later
                </Button>
              ) : (
                <Button type="button" className="h-11 px-6" onClick={() => finish()}>
                  Finish
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function TimeField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2 rounded-xl border bg-card p-4 shadow-sm">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <Input id={id} type="time" value={value} onChange={(e) => onChange(e.target.value)} required />
      <p className="text-meta text-muted-foreground">{hint}</p>
    </div>
  );
}

function NotificationNote({ choice }: { choice: NotificationChoice | null }) {
  const notes: Partial<Record<NotificationChoice, ReactNode>> = {
    granted: "You're all set. Notifications are on.",
    denied: "Notifications are blocked. You can allow them later in your browser's site settings.",
    unsupported:
      "This browser can't show notifications here yet. On iPhone, add Nurora to your Home Screen first; you can turn them on later.",
  };
  if (!choice || !notes[choice]) return null;
  return (
    <p role="status" className="text-sm text-muted-foreground">
      {notes[choice]}
    </p>
  );
}
