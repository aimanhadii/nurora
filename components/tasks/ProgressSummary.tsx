import { Surface } from "@/components/ui/Surface";

export function ProgressSummary({ done, total }: { done: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const message =
    total === 0
      ? "Nothing due today"
      : done === total
        ? "All done for today ✨"
        : `${done} of ${total} done today`;

  return (
    <Surface className="rounded-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[15px] font-semibold">{message}</p>
        {total > 0 && (
          <p className="text-sm text-text-2 tabular-nums">{percent}%</p>
        )}
      </div>
      <div
        role="progressbar"
        aria-label="Today's progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="mt-4 h-1.5 rounded-full bg-surface-2"
      >
        <div
          className="h-full rounded-full bg-accent shadow-active transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </Surface>
  );
}
