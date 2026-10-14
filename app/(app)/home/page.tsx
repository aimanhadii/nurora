import type { Metadata } from "next";
import { ViewTransition } from "react";
import { HomeScreen } from "@/components/home/HomeScreen";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return (
    // Crossfades when switching tabs.
    <ViewTransition enter="auto" exit="auto" default="none">
      <HomeScreen />
    </ViewTransition>
  );
}
