/**
 * A soft aurora at the very top of the page (mint left, pink right, plus
 * teal in dark mode), fading out within --glow-h. The rest stays plain.
 * Pure gradients on one fixed layer, so it costs the GPU almost nothing.
 */
export function GlowBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-(--glow-h)"
      style={{
        background: [
          "radial-gradient(60% 100% at 10% 0%, var(--glow-a), transparent 70%)",
          "radial-gradient(55% 100% at 90% 0%, var(--glow-b), transparent 70%)",
          "radial-gradient(45% 90% at 50% 0%, var(--glow-c), transparent 70%)",
        ].join(","),
        // Fade the whole glow out toward its bottom edge.
        maskImage: "linear-gradient(to bottom, black 30%, transparent)",
      }}
    />
  );
}
