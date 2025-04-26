import ThemeToggle from "@/components/ThemeToggle"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Fira_Sans } from "next/font/google"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fira.variable} antialiased`}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <div className="font-fira-sans flex min-h-dvh flex-col items-center justify-center p-6">
            <div className="fixed top-4 right-6">
              <ThemeToggle />
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

const fira = Fira_Sans({
  subsets: ["cyrillic"],
  variable: "--font-fira-sans",
  weight: "500",
})

export const metadata: Metadata = {
  title: "MPL results",
}
