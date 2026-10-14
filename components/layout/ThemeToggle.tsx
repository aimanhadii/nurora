"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import {
  setThemePreference,
  useThemePreference,
  type ThemePreference,
} from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

/** Three-way switch for the sidebar. */
export function ThemeSegmented() {
  const current = useThemePreference();

  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex rounded-xl bg-surface-2 p-1"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = current === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={`${label} theme`}
            title={label}
            onClick={() => setThemePreference(value)}
            className={`flex h-8 flex-1 items-center justify-center rounded-lg transition-colors ${
              active
                ? "bg-surface text-fg shadow-sm ring-1 ring-line"
                : "text-muted hover:text-fg"
            }`}
          >
            <Icon className="size-4" strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}

/** Single button that cycles system → light → dark, for small headers. */
export function ThemeCycleButton() {
  const current = useThemePreference();
  const index = OPTIONS.findIndex((o) => o.value === current);
  const { label, Icon } = OPTIONS[index];
  const next = OPTIONS[(index + 1) % OPTIONS.length];

  return (
    <button
      type="button"
      onClick={() => setThemePreference(next.value)}
      aria-label={`Theme: ${label}. Switch to ${next.label}`}
      className="flex size-11 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg active:scale-90"
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </button>
  );
}
