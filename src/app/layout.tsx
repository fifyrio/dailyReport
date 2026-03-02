import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const outfit = Outfit({ weight: ["400", "500", "600", "700", "800"], subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "进度追踪",
  description: "每日进度分析仪表盘",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${outfit.className} ${outfit.variable} min-h-screen bg-[#F3F4F6]`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
