"use client"

import NavButton from "@/components/NavButton"
import { CalendarLeg } from "@/lib/calendar-legs"
import RoundContext from "@/lib/round-context"
import { useRouter, useSearchParams } from "next/navigation"
import { FC, useContext } from "react"

const CalendarLegSelect: FC<{ leg: CalendarLeg; season?: string }> = ({
  leg,
  season,
}) => {
  const { setLoading } = useContext(RoundContext)
  const router = useRouter()
  const searchParams = useSearchParams()

  const goTo = (next: CalendarLeg) => {
    setLoading(true)
    const selectedSeason = season ?? searchParams.get("season")
    router.push(
      `/calendar/${next}${selectedSeason ? `?season=${encodeURIComponent(selectedSeason)}` : ""}`,
    )
  }

  return (
    <div className="flex w-full justify-center">
      <div className="grid grid-cols-[1.75rem_1fr_1.75rem] items-center sm:grid-cols-[2rem_1fr_2rem]">
        <div className="flex justify-center">
          {leg === 2 ? (
            <NavButton label="Круг 1" onClick={() => goTo(1)}>
              ‹
            </NavButton>
          ) : null}
        </div>
        <span className="text-center text-xs font-medium sm:text-sm">
          Круг {leg}
        </span>
        <div className="flex justify-center">
          {leg === 1 ? (
            <NavButton label="Круг 2" onClick={() => goTo(2)}>
              ›
            </NavButton>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CalendarLegSelect
