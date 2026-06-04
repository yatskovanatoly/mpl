"use client"

import { GamesSkeleton, StandingsSkeleton } from "@/components/LoadingSkeletons"
import { usePathname } from "next/navigation"

const RouteSkeleton = () => {
  const pathname = usePathname()

  if (pathname.startsWith("/table")) {
    return <StandingsSkeleton />
  }

  return <GamesSkeleton />
}

export default RouteSkeleton
