import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "실시간 주식 시세 - Stock Tracker",
  description: "미국 및 한국 인기 주식의 실시간 주가를 확인하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}
