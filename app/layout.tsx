import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teman",
  description: "Your daily companion",
};

export const viewport: Viewport = {
  themeColor: "#07080a",
  colorScheme: "dark",
  // Lets the app draw under the iPhone notch / home bar; we pad with safe-area insets.
  viewportFit: "cover",
  // Android: shrink the layout when the keyboard opens instead of covering it.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
