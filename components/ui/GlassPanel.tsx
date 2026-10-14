import type { ComponentProps, ElementType } from "react";

const STRENGTH = {
  /** Frosted panel with backdrop blur. */
  regular: "glass",
  /** Thicker, darker frost for menus and sheets on top of content. */
  strong: "glass-strong",
  /** Same look without blur, for many small items (rows, bubbles). */
  flat: "glass-flat",
};

type Strength = keyof typeof STRENGTH;

type GlassPanelProps<T extends ElementType> = {
  as?: T;
  strength?: Strength;
  className?: string;
} & Omit<ComponentProps<T>, "as" | "strength" | "className">;

/**
 * The one glass surface used everywhere. Pick the element with `as`
 * (div, aside, header, li, …) and add radius/padding via className.
 */
export function GlassPanel<T extends ElementType = "div">({
  as,
  strength = "regular",
  className = "",
  ...props
}: GlassPanelProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={`${STRENGTH[strength as Strength]} ${className}`}
      {...props}
    />
  );
}
