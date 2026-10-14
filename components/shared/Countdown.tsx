import { countdown } from "@/lib/tasks/stats";
import { cn } from "@/lib/utils";

/**
 * Quiet countdown line: "in 42 min", "in 1h 05m", "starting now".
 * Muted 13px text; only the numbers take the accent colour.
 */
export function Countdown({
  dueAt,
  now,
  className,
}: {
  dueAt: string;
  now: Date;
  className?: string;
}) {
  const value = countdown(dueAt, now);
  return (
    <p className={cn("text-meta text-muted-foreground tabular-nums", className)}>
      {value === "now" ? (
        <span className="text-brand-text">starting now</span>
      ) : (
        <>
          in{" "}
          {value.split(/(\d+)/).map((part, i) =>
            /^\d+$/.test(part) ? (
              <span key={i} className="font-medium text-brand-text">
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </>
      )}
    </p>
  );
}
