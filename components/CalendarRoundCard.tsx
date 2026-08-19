"use client"

import TeamLogo from "@/components/TeamLogo"
import { Game } from "@/lib/types"
import { CSSProperties, FC } from "react"

// Card text scales with the card itself so cards of any size stay filled.
const TITLE_TEXT = "text-[clamp(0.6875rem,5.5cqw,1.125rem)]"
const DATE_TEXT = "text-[clamp(0.5625rem,4cqw,0.875rem)]"
const GAME_TEXT = "text-[clamp(0.5625rem,4.4cqw,0.875rem)]"
const LOGO_SIZE = "size-[clamp(0.75rem,6cqw,1.5rem)]"

const CalendarRoundCard: FC<{
  round: string
  date: string
  games: Game[]
  className?: string
  style?: CSSProperties
}> = ({ round, date, games, className, style }) => {
  return (
    <section
      style={style}
      className={`@container flex min-h-0 min-w-0 flex-col overflow-hidden rounded-sm border border-[var(--foreground)]/10 bg-[var(--row-a)] ${className ?? ""}`}
    >
      <header className="flex shrink-0 flex-col items-center justify-center gap-0.5 bg-[var(--panel)] px-2 py-1">
        <div className={`leading-none font-bold ${TITLE_TEXT}`}>
          Тур {round}
        </div>
        {date && (
          <small className={`muted leading-tight ${DATE_TEXT}`}>{date}</small>
        )}
      </header>
      <ul className="flex min-h-0 flex-1 flex-col">
        {games.map((game, index) => (
          <li
            key={`${game.home.team}-${game.away.team}-${index}`}
            className={`grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-1 px-1.5 py-px leading-tight sm:gap-x-1.5 sm:px-2 lg:gap-x-2 ${GAME_TEXT} ${
              index % 2 ? "bg-[var(--row-b)]" : "bg-[var(--row-a)]"
            }`}
          >
            <div className="flex min-w-0 items-center justify-between gap-0.5 sm:gap-1">
              <span className="min-w-0 font-medium break-words">
                {game.home.team}
              </span>
              <TeamLogo
                id={game.home.id}
                logo={game.home.logo}
                size={24}
                className={`shrink-0 ${LOGO_SIZE}`}
              />
            </div>
            <span
              className={`shrink-0 px-0.5 text-center tabular-nums ${
                game.score ? "font-bold" : "muted"
              }`}
            >
              {game.score || game.time || "—"}
            </span>
            <div className="flex min-w-0 flex-row-reverse items-center justify-between gap-0.5 sm:gap-1">
              <span className="min-w-0 text-right font-medium break-words">
                {game.away.team}
              </span>
              <TeamLogo
                id={game.away.id}
                logo={game.away.logo}
                size={24}
                className={`shrink-0 ${LOGO_SIZE}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CalendarRoundCard
