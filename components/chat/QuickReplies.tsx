import { ArrowRight, CalendarDays, Plus, Sparkles } from "lucide-react";

const REPLIES = [
  { text: "Plan my day", Icon: CalendarDays },
  { text: "Add a task", Icon: Plus },
  { text: "What's next?", Icon: ArrowRight },
  { text: "Hype me up", Icon: Sparkles },
];

export function QuickReplies({
  onPick,
  disabled,
}: {
  onPick: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    // Scrolls sideways on narrow phones instead of widening the page.
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
      {REPLIES.map(({ text, Icon }) => (
        <button
          key={text}
          type="button"
          disabled={disabled}
          onClick={() => onPick(text)}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-sm font-medium text-fg transition hover:bg-surface-2 active:scale-95 disabled:opacity-50"
        >
          <Icon className="size-4 text-muted" strokeWidth={1.75} />
          {text}
        </button>
      ))}
    </div>
  );
}
