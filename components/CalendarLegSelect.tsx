"use client"

import { CalendarLeg } from "@/lib/calendar-legs"
import RoundContext from "@/lib/round-context"
import { useRouter } from "next/navigation"
import { FC, useContext } from "react"

const NavButton: FC<{
  label: string
  onClick: () => void
  children: string
}> = ({ label, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="flex size-7 items-center justify-center rounded bg-[var(--button-bg)] text-base font-bold leading-none transition hover:opacity-80"
  >
    {children}
  </button>
)

const CalendarLegSelect: FC<{ leg: CalendarLeg }> = ({ leg }) => {
  const { setLoading } = useContext(RoundContext)
  const router = useRouter()

  const goTo = (next: CalendarLeg) => {
    setLoading(true)
    router.push(`/calendar/${next}`)
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
