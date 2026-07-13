"use client"

import TeamLogo from "@/components/TeamLogo"
import { Game } from "@/lib/types"
import { FC } from "react"

const CalendarRoundCard: FC<{
  round: string
  date: string
  games: Game[]
  className?: string
}> = ({ round, date, games, className }) => {
  return (
    <section
      className={`flex min-w-0 flex-col overflow-hidden rounded-sm border border-[var(--foreground)]/10 bg-[var(--row-a)] ${className ?? ""}`}
    >
      <header className="flex shrink-0 flex-col items-center justify-center gap-0.5 bg-[var(--panel)] px-2 py-1 text-center lg:py-1.5">
        <div className="text-[0.6875rem] font-bold leading-none sm:text-xs lg:text-sm">
          Тур {round}
        </div>
        {date && (
          <small className="muted text-[0.5625rem] leading-tight sm:text-[0.625rem] lg:text-xs">
            {date}
          </small>
        )}
      </header>
      <ul className="flex min-h-0 flex-1 flex-col justify-evenly overflow-hidden">
        {games.map((game, index) => (
          <li
            key={`${game.home.team}-${game.away.team}-${index}`}
            className={`grid min-h-0 grid-cols-[2fr_1fr_2fr] items-center gap-x-1 px-1.5 py-px text-[0.5625rem] leading-tight sm:gap-x-1.5 sm:px-2 sm:py-0.5 sm:text-[0.625rem] lg:gap-x-2 lg:px-2 lg:text-xs xl:px-2.5 xl:text-sm ${
              index % 2 ? "bg-[var(--row-b)]" : "bg-[var(--row-a)]"
            }`}
          >
            <div className="flex min-w-0 items-center justify-between gap-0.5 sm:gap-1">
              <span className="min-w-0 truncate font-medium">{game.home.team}</span>
              <TeamLogo
                id={game.home.id}
                logo={game.home.logo}
                size={20}
                className="size-3 shrink-0 sm:size-3.5 lg:size-4 xl:size-5"
              />
            </div>
            <span className="shrink-0 px-0.5 text-center font-bold tabular-nums">
              {game.score || game.time || "—"}
            </span>
            <div className="flex min-w-0 flex-row-reverse items-center justify-between gap-0.5 sm:gap-1">
              <span className="min-w-0 truncate text-right font-medium">
                {game.away.team}
              </span>
              <TeamLogo
                id={game.away.id}
                logo={game.away.logo}
                size={20}
                className="size-3 shrink-0 sm:size-3.5 lg:size-4 xl:size-5"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CalendarRoundCard
