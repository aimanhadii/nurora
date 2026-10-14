/**
 * The glowing backdrop behind every glass surface. One fixed layer for the
 * whole app (not per component), so the GPU only paints it once.
 */
export function GlowBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[var(--glow-opacity)]"
    >
      {/* Crimson, top-left */}
      <div
        className="absolute -top-[22vmax] -left-[18vmax] size-[62vmax] animate-drift-a rounded-full blur-[90px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, var(--glow-red-2) 0%, var(--glow-red-1) 38%, transparent 68%)",
        }}
      />
      {/* Deeper crimson, upper centre */}
      <div
        className="absolute top-[8vh] left-[38vw] size-[34vmax] animate-drift-c rounded-full opacity-70 blur-[100px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, var(--glow-red-1) 0%, transparent 65%)",
        }}
      />
      {/* Teal, bottom-right */}
      <div
        className="absolute -right-[20vmax] -bottom-[24vmax] size-[60vmax] animate-drift-b rounded-full blur-[90px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, var(--glow-teal-2) 0%, var(--glow-teal-1) 40%, transparent 68%)",
        }}
      />
    </div>
  );
}
