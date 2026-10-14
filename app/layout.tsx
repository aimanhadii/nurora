import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { themeScript } from "@/lib/theme-script";
import "./globals.css";

// UI text.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Times, counts, countdowns.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display serif for a few warm moments (greeting, hero titles, quotes).
// Variable font: weight, optical size and the SOFT axis are all tunable.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  title: { default: "Ilmora", template: "%s · Ilmora" },
  description: "Your AI daily companion.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafc" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  // Lets the app draw under the iPhone notch / home bar; we pad with safe-area insets.
  viewportFit: "cover",
  // Android: shrink the layout when the keyboard opens instead of covering it.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The inline script sets data-theme before React loads, hence
    // suppressHydrationWarning on <html>.
    <html
      lang="en"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
