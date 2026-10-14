import { BarChart3 } from "lucide-react";
import type { DayCount } from "@/lib/tasks/stats";
import { cn } from "@/lib/utils";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Tasks completed on each of the last 7 days. */
export function WeekCard({ days, className }: { days: DayCount[]; className?: string }) {
  const total = days.reduce((sum, d) => sum + d.count, 0);
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <Card interactive className={className}>
      <CardHeader>
        <CardTitle>
          <BarChart3 className="size-4" strokeWidth={1.5} />
          This week
        </CardTitle>
        <CardAction>
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {total} done
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ol className="flex h-32 items-end gap-2" aria-label="Tasks done per day">
          {days.map((d) => (
            <li key={d.key} className="flex h-full flex-1 flex-col items-center gap-2">
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {d.count || ""}
              </span>
              <div className="flex w-full flex-1 items-end justify-center">
                <div
                  className={cn(
                    "w-full max-w-8 rounded-md transition-[height] duration-500 ease-out",
                    d.isToday ? "bg-brand" : d.count ? "bg-foreground/15" : "bg-muted",
                  )}
                  // A sliver for empty days so the week still reads as 7 slots.
                  style={{ height: d.count ? `${(d.count / max) * 100}%` : 4 }}
                  title={`${d.count} done`}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  d.isToday ? "text-brand" : "text-muted-foreground",
                )}
              >
                <span className="sr-only">{d.count} done on </span>
                {d.label}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
