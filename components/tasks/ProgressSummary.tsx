export function ProgressSummary({
  done,
  total,
}: {
  done: number;
  total: number;
}) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const message =
    total === 0
      ? "Nothing due today"
      : done === total
        ? "All done for today ✨"
        : `${done} of ${total} done today`;

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-[15px] font-medium">{message}</p>
        {total > 0 && (
          <p className="text-sm text-muted tabular-nums">{percent}%</p>
        )}
      </div>
      <div
        role="progressbar"
        aria-label="Today's progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
