import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ThemeToggle from "@/components/ThemeToggle"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-dvh flex-col items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
          <div className="fixed top-2 right-4">
            <ThemeToggle />
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MPL results",
}
