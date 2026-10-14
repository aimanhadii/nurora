import { GlassPanel } from "@/components/ui/GlassPanel";

export function ProgressSummary({
  done,
  total,
  flat,
}: {
  done: number;
  total: number;
  /** Skip the blur when already inside another glass panel. */
  flat?: boolean;
}) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const complete = total > 0 && done === total;
  const message =
    total === 0
      ? "Nothing due today"
      : complete
        ? "All done for today ✨"
        : `${done} of ${total} done today`;

  return (
    <GlassPanel strength={flat ? "flat" : "regular"} className="rounded-panel p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[15px] font-medium">{message}</p>
        {total > 0 && (
          <p className="text-sm text-fg-2 tabular-nums">{percent}%</p>
        )}
      </div>
      <div
        role="progressbar"
        aria-label="Today's progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="mt-4 h-1 rounded-full bg-white/10"
      >
        {/* Crimson while in progress, teal once everything is done. */}
        <div
          className={`h-full rounded-full transition-[width,background-color] duration-700 ease-out ${
            complete
              ? "bg-accent-2 shadow-[0_0_12px_0_var(--accent-2)]"
              : "bg-accent shadow-[0_0_12px_0_var(--accent)]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </GlassPanel>
  );
}
