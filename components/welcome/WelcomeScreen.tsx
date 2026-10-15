import Link from "next/link";
import { BellRing, CalendarCheck, Sparkles, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Orb } from "@/components/ui/Orb";
import { GlowBackground } from "@/components/layout/GlowBackground";
import { DemoChat } from "./DemoChat";
import { SignInCard } from "./SignInCard";

const FEATURES: { title: string; description: string; Icon: LucideIcon }[] = [
  { title: "Plans your day", description: "Turns a quick message into a schedule.", Icon: CalendarCheck },
  { title: "Reminds you on time", description: "A gentle nudge before things are due.", Icon: BellRing },
  { title: "Cheers you on", description: "A morning note and an evening check-in.", Icon: Sparkles },
];

function Features() {
  return (
    <ul className="space-y-4">
      {FEATURES.map(({ title, description, Icon }) => (
        <li key={title} className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <Icon className="size-[18px]" strokeWidth={1.5} />
          </span>
          <span>
            <span className="block text-sm font-medium">{title}</span>
            <span className="block text-meta text-muted-foreground">{description}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function Footer() {
  return (
    <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 text-meta text-muted-foreground">
      <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-foreground md:min-h-0">
        Privacy
      </Link>
      <Link href="/terms" className="inline-flex min-h-11 items-center hover:text-foreground md:min-h-0">
        Terms
      </Link>
      <span className="ml-auto">© 2026 Nurora</span>
    </footer>
  );
}

/**
 * Public landing + sign-in. Desktop: pitch on the left, sign-in card on
 * the right. Phone: pitch scrolls; sign-in is pinned to the bottom, within
 * thumb reach.
 */
export function WelcomeScreen() {
  return (
    <div className="relative min-h-dvh">
      <GlowBackground />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-280 flex-col px-4 pt-[calc(env(safe-area-inset-top)+16px)] md:px-6 lg:px-8 lg:pt-8">
        <header className="flex items-center gap-3">
          <Orb size={32} />
          <span className="font-display text-lg">nurora</span>
        </header>

        <main className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 lg:py-12">
          <section className="space-y-8">
            <div className="space-y-5">
              <Orb size={72} animated className="hidden lg:block" />
              <h1 className="font-display text-4xl text-balance lg:text-5xl">
                A little light for your day.
              </h1>
              <p className="max-w-lg text-base text-muted-foreground">
                Tell Nurora what&apos;s on your plate, in English or Malay. It plans your day, reminds
                you, and cheers you on.
              </p>
            </div>
            <DemoChat className="max-w-lg" />
            <Features />
          </section>

          {/* Desktop: sign-in card beside the pitch. */}
          <Card className="hidden lg:flex lg:p-8">
            <SignInCard variant="card" />
          </Card>
        </main>

        <div className="pb-6 lg:pb-8">
          <Footer />
        </div>

        {/* Phone/tablet: sign-in stays pinned to the bottom (thumb reach) while
            the pitch scrolls; sticky, so it never covers the footer. */}
        <div className="sticky bottom-0 z-20 -mx-4 border-t bg-background/85 backdrop-blur-lg md:-mx-6 lg:hidden">
          <div className="mx-auto max-w-md px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+12px)]">
            <SignInCard variant="compact" />
          </div>
        </div>
      </div>
    </div>
  );
}
