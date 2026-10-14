export function TaskCheckbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    // The button is 44px for easy tapping; the visible circle is smaller.
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className="group/check -m-2 flex size-11 shrink-0 items-center justify-center rounded-full"
    >
      <span
        className={`flex size-[22px] items-center justify-center rounded-full border-[1.5px] transition-colors duration-200 group-active/check:scale-90 ${
          checked
            ? "animate-pop border-accent bg-accent text-accent-fg"
            : "border-line-strong group-hover/check:border-muted"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={24}
              className="animate-draw"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
