"use client"

import { FIXED_TOP_CLASS } from "@/lib/layout-spacing"
import { navigationTabs } from "@/lib/navigation-tabs"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MouseEvent, useEffect, useState, useTransition } from "react"

const NavigationTabs = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const [invalidatingCache, setInvalidatingCache] = useState(false)
  const [isPending, startTransition] = useTransition()
  const updating = invalidatingCache || isPending || pendingHref !== null

  useEffect(() => {
    setPendingHref(null)
  }, [pathname])

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    active: boolean,
  ) => {
    if (
      active ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return
    }

    event.preventDefault()
    setPendingHref(href)
    startTransition(() => {
      router.push(href)
    })
  }

  const refreshData = async () => {
    if (updating) return

    setInvalidatingCache(true)
    try {
      const response = await fetch("/api/revalidate-data", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Could not refresh cached data")
      }

      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      console.error(error)
    } finally {
      setInvalidatingCache(false)
    }
  }

  return (
    <div className={`fixed left-1/2 z-40 -translate-x-1/2 ${FIXED_TOP_CLASS}`}>
      <nav
        className="flex rounded bg-[var(--button-bg)] p-1 text-xs shadow-sm sm:text-sm"
        aria-busy={updating ? "true" : undefined}
      >
        {navigationTabs.map((tab) => {
          const active = pathname.startsWith(tab.activePath)
          const pending = pendingHref === tab.href

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              aria-busy={pending ? "true" : undefined}
              onClick={(event) => handleClick(event, tab.href, active)}
              className={`flex items-center gap-1.5 rounded px-3 py-1 transition-opacity ${
                active
                  ? "bg-[var(--panel)] font-bold"
                  : "muted hover:opacity-70"
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
      <button
        type="button"
        aria-label="Обновить данные"
        aria-busy={updating ? "true" : undefined}
        disabled={updating}
        onClick={refreshData}
        className="absolute top-0 left-full ml-2 flex size-8 items-center justify-center rounded text-[var(--foreground)] transition hover:bg-[var(--button-bg)] hover:opacity-70 disabled:cursor-wait sm:size-9 cursor-pointer"
      >
        <CircleArrowIcon
          className={`size-4 sm:size-5 ${updating ? "muted animate-spin" : ""}`}
        />
      </button>
    </div>
  )
}

const CircleArrowIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </svg>
)

export default NavigationTabs
