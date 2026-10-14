import { Orb } from "@/components/ui/Orb";
import { QuickActionGrid } from "./QuickReplies";

export function ChatWelcome({
  name,
  subtitle,
  onPick,
  disabled,
}: {
  name: string;
  subtitle: string;
  onPick: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-1 animate-fade-in flex-col items-center justify-center gap-8 py-8">
      <Orb size={96} />
      <div className="text-center">
        <p className="text-xl font-medium text-text-2 md:text-2xl">Hi, {name}</p>
        <h2 className="mt-1 text-[28px] leading-tight font-bold tracking-tight md:text-4xl">
          How can I help today?
        </h2>
        <p className="mt-3 text-sm text-text-2">{subtitle}</p>
      </div>
      <QuickActionGrid onPick={onPick} disabled={disabled} />
    </div>
  );
}
