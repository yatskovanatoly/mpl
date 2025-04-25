import ThemeToggle from "@/components/ThemeToggle"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <div className="flex min-h-dvh flex-col items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
            <div className="fixed top-2 right-4">
              <ThemeToggle />
            </div>
            {children}
          </div>
        </ThemeProvider>
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
