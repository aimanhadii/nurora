"use client";

import { ChevronsUpDown, Monitor, Moon, Sun } from "lucide-react";
import { PLACEHOLDER_PROFILE } from "@/lib/profile";
import {
  setThemePreference,
  useThemePreference,
  type ThemePreference,
} from "@/lib/theme";
import { ContextMenu, useContextMenu, type MenuItem } from "@/components/ui/ContextMenu";

const THEMES: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent"
    >
      {name[0]}
    </span>
  );
}

/**
 * The profile button: a pill in the sidebar, or just the avatar in phone
 * headers. Opens a menu with the theme choice.
 */
export function ProfileMenu({
  variant,
}: {
  variant: "pill" | "pill-collapsed" | "avatar";
}) {
  const menu = useContextMenu();
  const current = useThemePreference();
  const name = PLACEHOLDER_PROFILE.name;

  const items: MenuItem[] = THEMES.map(({ value, label, Icon }) => ({
    label,
    Icon,
    checked: current === value,
    onSelect: () => setThemePreference(value),
  }));

  return (
    <>
      <button
        type="button"
        {...menu.buttonProps}
        aria-label={`${name}: profile and theme`}
        className={
          variant === "pill"
            ? "flex h-12 w-full items-center gap-3 rounded-full border border-border bg-surface-2 pr-3 pl-2 text-left transition hover:border-border-strong"
            : variant === "pill-collapsed"
              ? "flex size-12 items-center justify-center rounded-full border border-border bg-surface-2 transition hover:border-border-strong"
              : "flex size-11 items-center justify-center rounded-full transition active:scale-95"
        }
      >
        <Avatar name={name} />
        {variant === "pill" && (
          <>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">
              {name}
            </span>
            <ChevronsUpDown className="size-4 text-text-3" strokeWidth={1.5} />
          </>
        )}
      </button>
      <ContextMenu
        position={menu.position}
        items={items}
        label="Theme"
        onClose={menu.close}
      />
    </>
  );
}
