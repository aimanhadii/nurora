import { Sparkles } from "lucide-react";

export function ChatWelcome({ name }: { name: string }) {
  return (
    <div className="flex flex-1 animate-fade-in flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-fg">
        <Sparkles className="size-7" strokeWidth={1.75} />
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-tight">
        Hey {name}, I&apos;m Teman
      </h2>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
        Tell me what&apos;s on your plate — English, Malay, or both. I&apos;ll
        keep track so you don&apos;t have to.
      </p>
    </div>
  );
}
