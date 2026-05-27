import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "前端面試題庫",
  description: "用 Markdown 管理與閱讀前端面試 Q&A。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
