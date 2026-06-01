"use client"

import { logosMap } from "@/lib/logos-by-id"
import Image from "next/image"
import { FC } from "react"

const TeamLogo: FC<{
  id: string
  logo?: string
  size?: number
  className?: string
}> = ({ id, logo, size = 48, className }) => {
  const logoUrl = logo ? `/api/team-logo/${logo}` : undefined
  const src = logosMap[id] ?? logoUrl

  if (!src) return null

  return (
    <div className={`shrink-0 ${className ?? ""}`}>
      <Image
        height={size}
        width={size}
        alt="logo"
        src={src}
        className="h-full w-full object-contain"
      />
    </div>
  )
}

export default TeamLogo
