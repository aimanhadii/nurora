import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teman",
  description: "Your daily companion",
};

export const viewport: Viewport = {
  themeColor: "#fff1f2",
  // Lets the app draw under the iPhone notch / home bar; we pad with safe-area insets.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
