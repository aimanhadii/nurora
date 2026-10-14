import { ArrowRight, CalendarDays, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const QUICK_ACTIONS = [
  { text: "Plan my day", description: "See today and what matters most", Icon: CalendarDays },
  { text: "Add a task", description: "Just tell me what and when", Icon: Plus },
  { text: "What's next?", description: "Your next task, right now", Icon: ArrowRight },
  { text: "Hype me up", description: "A little boost for today", Icon: Sparkles },
];

/** Horizontally scrolling suggestion pills; the edges fade out. */
export function QuickChips({
  onPick,
  disabled,
}: {
  onPick: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="no-scrollbar fade-x -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
      {QUICK_ACTIONS.map(({ text, Icon }) => (
        <Button
          key={text}
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => onPick(text)}
          className="h-11 shrink-0 rounded-full px-4 md:h-9"
        >
          <Icon className="text-brand" strokeWidth={1.5} />
          {text}
        </Button>
      ))}
    </div>
  );
}
