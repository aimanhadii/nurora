import { Orb } from "@/components/ui/Orb";
import { QUICK_ACTIONS } from "./QuickChips";

/** First-visit chat: the big orb, a greeting, and four suggestions. */
export function ChatEmpty({
  name,
  subtitle,
  onPick,
}: {
  name: string;
  subtitle: string;
  onPick: (text: string) => void;
}) {
  return (
    <div className="flex flex-1 animate-fade-in flex-col items-center justify-center gap-8 py-8">
      <Orb size={88} animated />
      <div className="text-center">
        <p className="text-base text-muted-foreground">{name ? `Hi, ${name}` : "Hi there"}</p>
        <h2 className="mt-2 font-display text-3xl md:text-4xl">
          How can I help today?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid w-full grid-cols-2 gap-3">
        {QUICK_ACTIONS.map(({ text, description, Icon }) => (
          <button
            key={text}
            type="button"
            onClick={() => onPick(text)}
            className="flex min-h-32 flex-col items-start gap-3 rounded-xl border bg-card p-4 text-left shadow-sm outline-none transition-[translate,box-shadow,background-color] duration-200 hover:bg-accent/40 focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-98 [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-md"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <Icon className="size-4" strokeWidth={1.5} />
            </span>
            <span>
              <span className="block text-sm font-medium">{text}</span>
              <span className="mt-1 block text-meta text-muted-foreground">{description}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
