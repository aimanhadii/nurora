import { BottomNav } from "@/components/ui/BottomNav";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-rose-50">
      <main className="min-h-0 flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
