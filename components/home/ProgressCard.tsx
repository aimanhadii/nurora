import { CircleCheck } from "lucide-react";
import type { DayCount } from "@/lib/tasks/stats";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SIZE = 88;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({ done, total }: { done: number; total: number }) {
  const fraction = total === 0 ? 0 : done / total;
  return (
    <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
        role="img"
        aria-label={`${done} of ${total} tasks done today`}
      >
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-muted" />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          className="stroke-brand transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-xl font-medium tabular-nums">
        {done}/{total}
      </span>
    </div>
  );
}

export function ProgressCard({
  done,
  total,
  streak,
  week,
  className,
}: {
  done: number;
  total: number;
  streak: number;
  week: DayCount[];
  className?: string;
}) {
  const left = total - done;
  return (
    <Card interactive className={className}>
      <CardHeader>
        <CardTitle>
          <CircleCheck className="size-4" strokeWidth={1.5} />
          Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-5">
        <ProgressRing done={done} total={total} />
        <div className="min-w-0">
          <p className="text-xl font-semibold tracking-tight">
            {total === 0 ? "Free day" : left === 0 ? "All done" : `${left} to go`}
          </p>
          <p className="mt-1 text-meta text-muted-foreground">
            {total === 0 ? "Nothing due today" : `${done} of ${total} done today`}
          </p>
        </div>
      </CardContent>
      <div className="mt-auto flex items-center justify-between border-t pt-4">
        <p className="text-sm font-medium">
          <span aria-hidden="true">🔥 </span>
          {streak}-day streak
        </p>
        {/* Last 7 days: filled = at least one task done. */}
        <div className="flex gap-1" aria-hidden="true">
          {week.map((d) => (
            <span
              key={d.key}
              className={cn("size-2 rounded-full", d.count > 0 ? "bg-brand" : "bg-foreground/15")}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
