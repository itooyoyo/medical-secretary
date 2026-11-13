import type { Metadata } from "next";
import "./globals.css";
import "./components/medical-kit.css";

export const metadata: Metadata = {
  title: "Dr. Ito Medical Hub",
  description: "医療従事者のための医学教育・臨床推論学習プラットフォームです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
