import type { ComponentProps, ElementType } from "react";

const VARIANT = {
  /** Solid card with a soft shadow. */
  card: "surface-card",
  /** List rows: tiny shadow, so folding lists don't clip it. */
  item: "surface-item",
  /** Translucent with backdrop blur: bars that float over content. */
  glass: "surface-glass",
  /** Solid with a bigger shadow: menus, sheets, toasts. */
  raised: "surface-raised",
};

type Variant = keyof typeof VARIANT;

type SurfaceProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  className?: string;
} & Omit<ComponentProps<T>, "as" | "variant" | "className">;

/**
 * The one surface used everywhere. Pick the element with `as`
 * (div, aside, header, li, …) and add radius/padding via className.
 */
export function Surface<T extends ElementType = "div">({
  as,
  variant = "card",
  className = "",
  ...props
}: SurfaceProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={`${VARIANT[variant as Variant]} ${className}`}
      {...props}
    />
  );
}
