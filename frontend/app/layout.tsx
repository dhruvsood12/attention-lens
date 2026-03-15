import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "AttentionLens — Predict attention before you post",
  description:
    "Multimodal ML that predicts how much attention your content will capture. Test headlines, thumbnails, and captions before you post.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
