"use client"

import { navigationTabs } from "@/lib/navigation-tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavigationTabs = () => {
  const pathname = usePathname()

  return (
    <nav className="fixed top-2 left-1/2 z-40 flex -translate-x-1/2 rounded bg-[var(--button-bg)] p-1 text-xs shadow-sm sm:top-4 sm:text-sm">
      {navigationTabs.map((tab) => {
        const active = pathname.startsWith(tab.activePath)

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded px-3 py-1 transition-opacity ${
              active ? "bg-[var(--panel)] font-bold" : "muted hover:opacity-70"
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default NavigationTabs
