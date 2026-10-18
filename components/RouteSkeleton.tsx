"use client"

import {
  CalendarSkeleton,
  GamesSkeleton,
  StandingsSkeleton,
} from "@/components/LoadingSkeletons"
import { GAMES_LAYOUT_CLASS, GAMES_STANDINGS_CLASS } from "@/lib/layout-spacing"
import { usePathname } from "next/navigation"

const RouteSkeleton = () => {
  const pathname = usePathname()

  if (pathname.startsWith("/table")) {
    return <StandingsSkeleton />
  }

  if (pathname.startsWith("/calendar")) {
    return <CalendarSkeleton />
  }

  return (
    <div className={GAMES_LAYOUT_CLASS}>
      <div className={GAMES_STANDINGS_CLASS}>
        <StandingsSkeleton />
      </div>
      <GamesSkeleton />
    </div>
  )
}

export default RouteSkeleton
