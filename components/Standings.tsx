"use client"

import SaveScreenshot from "@/components/SaveScreenshot"
import TeamLogo from "@/components/TeamLogo"
import RoundContext from "@/lib/round-context"
import { StandingsData } from "@/lib/types"
import { useRef, useState } from "react"

const TABLE_GRID =
  "grid-cols-[0.875rem_minmax(0,1fr)_repeat(8,minmax(0,1.0625rem))_minmax(2.75rem,3rem)] sm:grid-cols-[1.5rem_minmax(0,1fr)_repeat(8,1.75rem)_4rem]"

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
                className={`grid ${TABLE_GRID} min-h-12 items-center gap-x-0.5 gap-y-1 px-1 py-1.5 text-[0.6875rem] tabular-nums sm:min-h-16 sm:gap-x-2 sm:gap-y-2 sm:px-4 sm:py-2 sm:text-sm ${
                  index % 2 ? "bg-[var(--row-b)]" : "bg-[var(--row-a)]"
                }`}
              >
                <div className="text-center font-bold">{standing.position}</div>
                <div className="flex min-w-0 items-center gap-1.5 font-medium sm:gap-3">
                  <TeamLogo
                    id={standing.team.id}
                    logo={standing.team.logo}
                    size={40}
                    className="size-6 shrink-0 sm:size-10"
                  />
                  <span className="min-w-0 truncate leading-tight sm:overflow-visible sm:whitespace-normal">
                    {standing.team.team}
                  </span>
                </div>
                <Stat value={standing.points} className="font-bold" />
                <Stat value={standing.games} />
                <Stat value={standing.wins} />
                <Stat value={standing.draws} />
                <Stat value={standing.losses} />
                <Stat value={standing.goalsFor} />
                <Stat value={standing.goalsAgainst} />
                <Stat value={standing.goalDiff} />
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
  <div
    className={`grid ${TABLE_GRID} items-center gap-x-0.5 bg-[var(--panel)] px-1 py-1.5 text-[0.625rem] font-bold uppercase opacity-80 sm:gap-x-2 sm:px-4 sm:py-2 sm:text-xs`}
  >
    <div />
    <div>Команда</div>
    <div className="text-center">О</div>
    <div className="text-center">И</div>
    <div className="text-center">В</div>
    <div className="text-center">Н</div>
    <div className="text-center">П</div>
    <div className="text-center">ГЗ</div>
    <div className="text-center">ГП</div>
    <div className="text-center">+/-</div>
    <div className="px-0.5 text-center leading-none sm:px-1">Форма</div>
  </div>
)

const Stat = ({ value, className }: { value: string; className?: string }) => (
  <div className={`text-center ${className ?? ""}`}>{value}</div>
)

const FormDots = ({
  form,
}: {
  form: StandingsData["standings"][number]["form"]
}) => (
  <div className="flex justify-center gap-0.5 px-0.5 py-0.5 sm:gap-1.5 sm:px-1">
    {form.map((result, index) => (
      <span
        key={`${result}-${index}`}
        className={`block size-1.5 shrink-0 rounded-full sm:size-2.5 ${
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
