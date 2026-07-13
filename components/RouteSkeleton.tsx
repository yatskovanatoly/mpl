"use client"

import {
  CalendarSkeleton,
  GamesSkeleton,
  StandingsSkeleton,
} from "@/components/LoadingSkeletons"
import { usePathname } from "next/navigation"

const RouteSkeleton = () => {
  const pathname = usePathname()

  if (pathname.startsWith("/table")) {
    return <StandingsSkeleton />
  }

  if (pathname.startsWith("/calendar")) {
    return <CalendarSkeleton />
  }

  return <GamesSkeleton />
}

export default RouteSkeleton
