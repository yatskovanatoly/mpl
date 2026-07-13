"use client"

import CalendarLegSelect from "@/components/CalendarLegSelect"
import CalendarRoundCard from "@/components/CalendarRoundCard"
import SaveScreenshot from "@/components/SaveScreenshot"
import {
  CALENDAR_CARD,
  CALENDAR_LAYOUT,
  CALENDAR_LEG_HEADER,
  CALENDAR_PAGE,
} from "@/lib/calendar-layout"
import { CalendarLeg } from "@/lib/calendar-legs"
import RoundContext from "@/lib/round-context"
import { CalendarData } from "@/lib/types"
import { useRef, useState } from "react"

const Calendar = ({
  rounds,
  leg,
}: CalendarData & { leg: CalendarLeg }) => {
  const [loading, setLoading] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)

  return (
    <RoundContext.Provider value={{ loading, setLoading }}>
      <div className={CALENDAR_PAGE}>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-1 text-[var(--foreground)] sm:px-2 lg:px-3">
          <div className={CALENDAR_LEG_HEADER}>
            <CalendarLegSelect leg={leg} />
          </div>
          {rounds.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-8 text-center text-sm">
              <p>Нет данных о турах</p>
              <p className="muted text-xs">
                Сезон ещё не начался или матчи не опубликованы
              </p>
            </div>
          ) : (
            <div
              ref={captureRef}
              className={`${CALENDAR_LAYOUT} bg-[var(--background)]`}
            >
              {rounds.map(({ round, date, games }) => (
                <CalendarRoundCard
                  key={round}
                  className={CALENDAR_CARD}
                  round={round}
                  date={date}
                  games={games}
                />
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0">
          <SaveScreenshot
            targetRef={captureRef}
            filename={`mpl-calendar-krug-${leg}.png`}
          />
        </div>
      </div>
    </RoundContext.Provider>
  )
}

export default Calendar
