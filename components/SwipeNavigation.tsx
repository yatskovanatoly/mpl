"use client"

import { navigationTabs } from "@/lib/navigation-tabs"
import { usePathname, useRouter } from "next/navigation"
import { type ReactNode, useCallback, useRef } from "react"

const SWIPE_THRESHOLD_PX = 60
const MOBILE_MAX_WIDTH_PX = 640

const SwipeNavigation = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (window.innerWidth > MOBILE_MAX_WIDTH_PX) return

    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (window.innerWidth > MOBILE_MAX_WIDTH_PX || !touchStart.current) return

      const touch = event.changedTouches[0]
      const deltaX = touch.clientX - touchStart.current.x
      const deltaY = touch.clientY - touchStart.current.y
      touchStart.current = null

      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return
      if (Math.abs(deltaY) >= Math.abs(deltaX)) return

      const currentIndex = navigationTabs.findIndex((tab) =>
        pathname.startsWith(tab.activePath),
      )
      if (currentIndex < 0) return

      if (deltaX < 0 && currentIndex < navigationTabs.length - 1) {
        router.push(navigationTabs[currentIndex + 1].href)
        return
      }

      if (deltaX > 0 && currentIndex > 0) {
        router.push(navigationTabs[currentIndex - 1].href)
      }
    },
    [pathname, router],
  )

  return (
    <div
      className="w-full min-w-0 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}

export default SwipeNavigation
