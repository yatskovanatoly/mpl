import ThemeConfigurator from "@/components/ThemeConfigurator"
import ThemeToggle from "@/components/ThemeToggle"
import NavigationTabs from "@/components/NavigationTabs"
import RouteSkeleton from "@/components/RouteSkeleton"
import SwipeNavigation from "@/components/SwipeNavigation"
import {
  FIXED_TOP_CLASS,
  HEADER_SPACER_CLASS,
  TABS_CONTENT_GAP_CLASS,
} from "@/lib/layout-spacing"
import {
  CUSTOM_THEME_STORAGE_KEY,
  customThemeFields,
  hexColorPattern,
} from "@/lib/custom-theme"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Roboto } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import { Suspense } from "react"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="custom-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: customThemeScript }}
        />
      </head>
      <body className={`${roboto.className} antialiased`}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <div className="flex min-h-dvh w-full flex-col items-center justify-start px-3 pb-28 sm:px-4 sm:pb-4">
            <Link
              href="/games"
              aria-label="Moscow Punk-rock League games"
              className={`fixed left-2 z-40 size-7 sm:left-4 sm:size-10 ${FIXED_TOP_CLASS}`}
            >
              <Image
                src="/mpl.png"
                alt="Moscow Punk-rock League"
                width={40}
                height={40}
                priority
                className="h-full w-full object-contain"
              />
            </Link>
            <NavigationTabs />
            <div className={`fixed right-3 z-40 sm:right-6 ${FIXED_TOP_CLASS}`}>
              <ThemeToggle />
            </div>
            <ThemeConfigurator />
            <div className={HEADER_SPACER_CLASS} aria-hidden />
            <SwipeNavigation className={TABS_CONTENT_GAP_CLASS}>
              <Suspense fallback={<RouteSkeleton />}>{children}</Suspense>
            </SwipeNavigation>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

const roboto = Roboto({
  subsets: ["cyrillic"],
})

const customThemeScript = `
(() => {
  try {
    const rawTheme = localStorage.getItem(${JSON.stringify(CUSTOM_THEME_STORAGE_KEY)});
    if (!rawTheme) return;

    const theme = JSON.parse(rawTheme);
    const fields = ${JSON.stringify(customThemeFields.map((field) => field.variable))};
    const hexColor = new RegExp(${JSON.stringify(hexColorPattern)});

    const toHex = (value) => {
      if (typeof value !== "string") return null;
      const color = value.trim();
      if (hexColor.test(color)) return color.toLowerCase();
      const rgb = color.match(/^rgba?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})/i);
      if (!rgb) return null;
      const hex = [rgb[1], rgb[2], rgb[3]].map((channel) => {
        const n = Number(channel);
        if (n > 255) return null;
        return n.toString(16).padStart(2, "0");
      });
      if (hex.some((part) => part === null)) return null;
      return "#" + hex.join("");
    };

    for (const field of fields) {
      const color = toHex(theme?.[field]);
      if (color) {
        document.documentElement.style.setProperty(field, color);
      }
    }
  } catch {}
})();
`

export const metadata: Metadata = {
  title: "Moscow Punk-rock League",
}
