import type { ReactNode } from "react";

export function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <header className="border-b border-rose-100 bg-white/80 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 backdrop-blur">
      <h1 className="text-lg font-semibold text-stone-800">{title}</h1>
      {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
    </header>
  );
}
