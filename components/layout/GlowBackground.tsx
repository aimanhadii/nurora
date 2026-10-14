/**
 * Soft glows at the top and bottom of the page, fading out in the middle.
 * Pure gradients on one fixed layer: no blur filters, nothing animating,
 * so it costs the GPU almost nothing. Colours come from --glow-1/2/3.
 */
export function GlowBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: [
          "radial-gradient(70% 45% at 15% 0%, var(--glow-1), transparent 70%)",
          "radial-gradient(55% 40% at 85% 0%, var(--glow-3), transparent 70%)",
          "radial-gradient(80% 45% at 70% 100%, var(--glow-2), transparent 70%)",
          "radial-gradient(50% 35% at 10% 100%, var(--glow-1), transparent 70%)",
        ].join(","),
      }}
    />
  );
}
