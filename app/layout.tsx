import type React from "react"
import type { Metadata } from "next"
import { Noto_Serif_SC } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "每日复盘笔记",
  description: "记录你的学习与成长，每日复盘，持续进步",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSerifSC.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
