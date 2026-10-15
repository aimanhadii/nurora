import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Orb } from "@/components/ui/Orb";
import { GlowBackground } from "@/components/layout/GlowBackground";

/** Simple public page for legal text (placeholder content for now). */
export function LegalPage({ title }: { title: string }) {
  return (
    <div className="relative min-h-dvh">
      <GlowBackground />
      <div className="relative z-10 mx-auto w-full max-w-180 px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-12 md:px-6 md:pt-8">
        <header className="flex items-center gap-3">
          <Orb size={32} />
          <span className="font-display text-lg">nurora</span>
        </header>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-meta text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} />
          Back
        </Link>
        <h1 className="mt-4 font-display text-4xl">{title}</h1>
        <p className="mt-6 text-base text-muted-foreground">[TO BE WRITTEN]</p>
        <p className="mt-12 text-meta text-muted-foreground">© 2026 Nurora</p>
      </div>
    </div>
  );
}
