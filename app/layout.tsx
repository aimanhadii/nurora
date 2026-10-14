import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { themeScript } from "@/lib/theme-script";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
  // Lets the app draw under the iPhone notch / home bar; we pad with safe-area insets.
  viewportFit: "cover",
  // Android: shrink the layout when the keyboard opens instead of covering it.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The inline script changes data-theme before React loads, hence
    // suppressHydrationWarning on <html>.
    <html
      lang="en"
      data-theme="light"
      className={`${geist.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
