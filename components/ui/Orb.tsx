import { cn } from "@/lib/utils";

/**
 * Ilmora's brand: a soft gradient orb (styles in globals.css).
 * Small orbs are still and glow-free; only the hero and "thinking"
 * orbs animate.
 */
export function Orb({
  size = 24,
  animated = false,
  thinking = false,
  glow = animated,
  className,
}: {
  size?: number;
  animated?: boolean;
  thinking?: boolean;
  glow?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      data-animated={animated || thinking || undefined}
      data-thinking={thinking || undefined}
      data-quiet={!glow || undefined}
      className={cn("orb inline-block", className)}
      style={{ width: size, height: size }}
    />
  );
}
