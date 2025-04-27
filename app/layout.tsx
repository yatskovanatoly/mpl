import ThemeToggle from "@/components/ThemeToggle"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Roboto } from "next/font/google"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <div className="flex min-h-dvh flex-col items-center justify-center p-4">
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

const roboto = Roboto({
  subsets: ["cyrillic"],
})

export const metadata: Metadata = {
  title: "Moscow Punk-rock League",
}
