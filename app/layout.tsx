import ThemeToggle from "@/components/ThemeToggle"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Roboto } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import Image from "next/image"

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
            <Link
              href="/games"
              aria-label="Moscow Punk-rock League games"
              className="fixed top-2 left-2 size-10 sm:top-4 sm:left-4 sm:size-12"
            >
              <Image
                src="/mpl.png"
                alt="Moscow Punk-rock League"
                width={100}
                height={100}
              />
            </Link>
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
