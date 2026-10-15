import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return <LegalPage title="Privacy" />;
}
