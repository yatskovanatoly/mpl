"use client"

import SaveScreenshot from "@/components/SaveScreenshot"
import TeamLogo from "@/components/TeamLogo"
import RoundContext from "@/lib/round-context"
import { StandingsData } from "@/lib/types"
import { useRef, useState } from "react"

const Standings = ({ standings }: StandingsData) => {
  const [loading, setLoading] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)

  return (
    <RoundContext.Provider value={{ loading, setLoading }}>
      <div className="flex w-full min-w-0 flex-col items-center">
        <div
          ref={captureRef}
          className="flex w-full max-w-[40rem] min-w-0 flex-col items-stretch"
        >
          <div className="flex w-full flex-col">
            <Header />
            {standings.map((standing, index) => (
              <div
                key={standing.team.id || standing.team.team}
                className={`grid min-h-16 grid-cols-[1.25rem_minmax(0,1fr)_1.75rem_2.75rem] items-center gap-x-1.5 gap-y-2 px-2 py-2 text-sm ${
                  index % 2 ? "bg-[var(--row-b)]" : "bg-[var(--row-a)]"
                } sm:grid-cols-[1.5rem_minmax(0,1fr)_repeat(8,1.75rem)_3.5rem] sm:gap-x-2 sm:px-4`}
              >
                <div className="text-center font-bold">{standing.position}</div>
                <div className="flex min-w-0 items-center gap-3 font-medium">
                  <TeamLogo
                    id={standing.team.id}
                    logo={standing.team.logo}
                    size={40}
                    className="size-8 shrink-0 sm:size-10"
                  />
                  <span className="min-w-0 truncate leading-tight sm:overflow-visible sm:whitespace-normal">
                    {standing.team.team}
                  </span>
                </div>
                <Stat value={standing.points} className="font-bold" />
                <MobileRecord
                  games={standing.games}
                  wins={standing.wins}
                  draws={standing.draws}
                  losses={standing.losses}
                />
                <DesktopStat value={standing.games} />
                <DesktopStat value={standing.wins} />
                <DesktopStat value={standing.draws} />
                <DesktopStat value={standing.losses} />
                <DesktopStat value={standing.goalsFor} />
                <DesktopStat value={standing.goalsAgainst} />
                <DesktopStat value={standing.goalDiff} />
                <FormDots form={standing.form} />
              </div>
            ))}
          </div>
        </div>
        <SaveScreenshot targetRef={captureRef} filename="mpl-table.png" />
      </div>
    </RoundContext.Provider>
  )
}

const Header = () => (
  <div className="grid grid-cols-[1.25rem_minmax(0,1fr)_1.75rem_2.75rem] gap-x-1.5 bg-[var(--panel)] px-2 py-2 text-xs font-bold uppercase opacity-80 sm:grid-cols-[1.5rem_minmax(0,1fr)_repeat(8,1.75rem)_3.5rem] sm:gap-x-2 sm:px-4 items-center">
    <div />
    <div>Команда</div>
    <div className="text-center">О</div>
    <div className="text-center sm:hidden">И-В-Н-П</div>
    <div className="hidden text-center sm:block">И</div>
    <div className="hidden text-center sm:block">В</div>
    <div className="hidden text-center sm:block">Н</div>
    <div className="hidden text-center sm:block">П</div>
    <div className="hidden text-center sm:block">ГЗ</div>
    <div className="hidden text-center sm:block">ГП</div>
    <div className="hidden text-center sm:block">+/-</div>
    <div className="hidden text-center sm:block">Форма</div>
  </div>
)

const Stat = ({ value, className }: { value: string; className?: string }) => (
  <div className={`text-center ${className ?? ""}`}>{value}</div>
)

const DesktopStat = ({ value }: { value: string }) => (
  <div className="hidden text-center sm:block">{value}</div>
)

const MobileRecord = ({
  games,
  wins,
  draws,
  losses,
}: {
  games: string
  wins: string
  draws: string
  losses: string
}) => (
  <div className="text-center text-[0.65rem] leading-tight sm:hidden">
    {games}-{wins}-{draws}-{losses}
  </div>
)

const FormDots = ({
  form,
}: {
  form: StandingsData["standings"][number]["form"]
}) => (
  <div className="hidden justify-center gap-1 sm:flex">
    {form.map((result, index) => (
      <span
        key={`${result}-${index}`}
        className={`size-2.5 rounded-full ${
          result === "win"
            ? "bg-green-500"
            : result === "draw"
              ? "bg-yellow-400"
              : "bg-red-500"
        }`}
        title={result}
      />
    ))}
  </div>
)

export default Standings
