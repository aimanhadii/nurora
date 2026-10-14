"use client";

import { ChevronsUpDown, Monitor, Moon, Settings, Sun } from "lucide-react";
import { PLACEHOLDER_PROFILE } from "@/lib/profile";
import { setThemePreference, useThemePreference, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function ProfileAvatar({ className }: { className?: string }) {
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-brand-soft text-meta font-medium text-brand-text">
        {PLACEHOLDER_PROFILE.name[0]}
      </AvatarFallback>
    </Avatar>
  );
}

/**
 * Profile + theme menu. "pill" for the expanded sidebar, "icon" for the
 * collapsed rail, "avatar" for phone headers.
 */
export function ProfileMenu({ variant }: { variant: "pill" | "icon" | "avatar" }) {
  const theme = useThemePreference();
  const name = PLACEHOLDER_PROFILE.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${name}: profile and theme`}
        className={cn(
          "flex items-center rounded-full outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40",
          variant === "pill" &&
            "h-12 w-full gap-3 border bg-card pr-3 pl-2 text-left hover:bg-accent aria-expanded:bg-accent",
          variant === "icon" && "size-11 justify-center hover:bg-accent aria-expanded:bg-accent",
          variant === "avatar" && "size-11 justify-center",
        )}
      >
        <ProfileAvatar />
        {variant === "pill" && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{name}</span>
              <span className="block truncate text-xs text-muted-foreground">Kuala Lumpur</span>
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" strokeWidth={1.5} />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === "avatar" ? "end" : "start"}
        side={variant === "avatar" ? "bottom" : "top"}
        className="w-56"
      >
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setThemePreference(value as ThemePreference)}
        >
          {THEMES.map(({ value, label, Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon strokeWidth={1.5} />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Settings strokeWidth={1.5} />
          Settings
          <span className="ml-auto text-xs text-muted-foreground">Soon</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
