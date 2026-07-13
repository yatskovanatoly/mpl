"use client"

import CalendarRoundCard from "@/components/CalendarRoundCard"
import SaveScreenshot from "@/components/SaveScreenshot"
import { CALENDAR_CARD, CALENDAR_LAYOUT } from "@/lib/calendar-layout"
import RoundContext from "@/lib/round-context"
import { CalendarData } from "@/lib/types"
import { useRef, useState } from "react"

const Calendar = ({ rounds }: CalendarData) => {
  const [loading, setLoading] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)

  return (
    <RoundContext.Provider value={{ loading, setLoading }}>
      <div className="flex w-full min-w-0 flex-col">
        <div ref={captureRef} className="flex w-full justify-center bg-[var(--background)] px-1 sm:px-2 text-[var(--foreground)]">
          {rounds.length === 0 ? (
            <div className="flex w-full min-w-0 flex-col items-center justify-center gap-1 rounded-sm bg-[var(--panel)] px-4 py-8 text-center text-sm">
              <p>Нет данных о турах</p>
              <p className="muted text-xs">
                Сезон ещё не начался или матчи не опубликованы
              </p>
            </div>
          ) : (
            <div className={CALENDAR_LAYOUT}>
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
        <SaveScreenshot targetRef={captureRef} filename="mpl-calendar.png" />
      </div>
    </RoundContext.Provider>
  )
}

export default Calendar
