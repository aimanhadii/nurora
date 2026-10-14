import type { DayCount } from "@/lib/tasks/stats";
import { cn } from "@/lib/utils";

/**
 * Last 7 days as dots. Filled days each show their own slice of the
 * aurora gradient, so together the row reads as one mint → teal → pink band.
 */
export function StreakDots({ week, size = "md" }: { week: DayCount[]; size?: "sm" | "md" }) {
  return (
    <div className="flex shrink-0 gap-1" aria-hidden="true">
      {week.map((d, i) => (
        <span
          key={d.key}
          className={cn(
            "rounded-full",
            size === "sm" ? "size-1.5" : "size-2",
            d.count > 0 ? "bg-aurora" : "bg-foreground/15",
          )}
          style={
            d.count > 0
              ? { backgroundSize: "700% 100%", backgroundPosition: `${(i / 6) * 100}% 0` }
              : undefined
          }
        />
      ))}
    </div>
  );
}
