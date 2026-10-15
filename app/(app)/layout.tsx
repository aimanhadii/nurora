import { AuthGate } from "@/components/auth/AuthGate";
import { AppShell } from "@/components/layout/AppShell";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
