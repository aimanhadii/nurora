/** Teman's brand: a soft, slowly morphing gradient orb (styles in globals.css). */
export function Orb({
  size = 24,
  thinking = false,
  className = "",
}: {
  size?: number;
  thinking?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      data-thinking={thinking || undefined}
      className={`orb inline-block ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
