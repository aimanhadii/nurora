import { Sparkles } from "lucide-react";

export function ChatWelcome({ name }: { name: string }) {
  return (
    <div className="flex flex-1 animate-fade-in flex-col items-center justify-center px-6 py-12 text-center">
      <div className="accent-fill flex size-16 items-center justify-center rounded-[22px] shadow-[0_0_48px_-8px_var(--accent)]">
        <Sparkles className="size-8" strokeWidth={1.5} />
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-tight">
        Hey {name}, I&apos;m Teman
      </h2>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-fg-2">
        Tell me what&apos;s on your plate — English, Malay, or both. I&apos;ll
        keep track so you don&apos;t have to.
      </p>
    </div>
  );
}
