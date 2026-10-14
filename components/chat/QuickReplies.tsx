import { ArrowRight, CalendarDays, Plus, Sparkles } from "lucide-react";

export const QUICK_ACTIONS = [
  { text: "Plan my day", description: "See today and what matters most", Icon: CalendarDays },
  { text: "Add a task", description: "Just tell me what and when", Icon: Plus },
  { text: "What's next?", description: "Your next task, right now", Icon: ArrowRight },
  { text: "Hype me up", description: "A little boost for today", Icon: Sparkles },
];

type Props = { onPick: (text: string) => void; disabled?: boolean };

/** 2×2 cards for the empty chat. */
export function QuickActionGrid({ onPick, disabled }: Props) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {QUICK_ACTIONS.map(({ text, description, Icon }) => (
        <button
          key={text}
          type="button"
          disabled={disabled}
          onClick={() => onPick(text)}
          className="surface-card flex min-h-32 flex-col items-start gap-3 rounded-card p-4 text-left transition hover:border-border-strong active:scale-[0.98] disabled:opacity-50"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Icon className="size-[18px]" strokeWidth={1.5} />
          </span>
          <span>
            <span className="block text-[15px] font-semibold">{text}</span>
            <span className="mt-0.5 block text-[13px] leading-snug text-text-2">
              {description}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

/** Small pills above the input once the conversation has started. */
export function QuickReplies({ onPick, disabled }: Props) {
  return (
    // Scrolls sideways on narrow phones instead of widening the page.
    <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-2.5 md:mx-0 md:px-0">
      {QUICK_ACTIONS.map(({ text, Icon }) => (
        <button
          key={text}
          type="button"
          disabled={disabled}
          onClick={() => onPick(text)}
          className="surface-card flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition hover:border-border-strong active:scale-95 disabled:opacity-50"
        >
          <Icon className="size-4 text-accent" strokeWidth={1.5} />
          {text}
        </button>
      ))}
    </div>
  );
}
