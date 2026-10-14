import { useId } from "react";
import { CircleCheck } from "lucide-react";
import type { DayCount } from "@/lib/tasks/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StreakDots } from "@/components/shared/StreakDots";

const SIZE = 88;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Ring filled with the aurora gradient (an SVG gradient, same three stops). */
function ProgressRing({ done, total }: { done: number; total: number }) {
  const gradientId = useId();
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
        <defs>
          {/* The SVG is rotated -90° so the arc starts at the top; in the
              unrotated frame "visual top → bottom" is right → left. That
              keeps mint where the arc starts, then teal, then pink. */}
          <linearGradient id={gradientId} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" style={{ stopColor: "var(--aurora-1)" }} />
            <stop offset="55%" style={{ stopColor: "var(--aurora-2)" }} />
            <stop offset="100%" style={{ stopColor: "var(--aurora-3)" }} />
          </linearGradient>
        </defs>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-muted"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-medium tabular-nums">
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
          <p className="text-base font-medium">
            {total === 0
              ? "Free day"
              : left === 0
                ? "All done"
                : `${left} to go`}
          </p>
          <p className="mt-1 text-meta text-muted-foreground">
            {total === 0
              ? "Nothing due today"
              : `${done} of ${total} done today`}
          </p>
        </div>
      </CardContent>
      <div className="mt-auto flex items-center justify-between border-t pt-4">
        <p className="text-meta text-muted-foreground">
          <span className="text-foreground tabular-nums">{streak}-day</span>{" "}
          streak
        </p>
        <StreakDots week={week} />
      </div>
    </Card>
  );
}
