"use client"

import Games from "@/components/Games"
import RoundSelect from "@/components/RoundSelect"
import SaveScreenshot from "@/components/SaveScreenshot"
import RoundContext from "@/lib/round-context"
import { RoundData, Rounds } from "@/lib/types"
import { useRef, useState } from "react"

export default function Round({
  rounds,
  games,
}: {
  rounds: Rounds
  games: RoundData
}) {
  const [loading, setLoading] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)

  return (
    <RoundContext.Provider value={{ loading, setLoading }}>
      <div
        aria-disabled={loading}
        className={`${loading && "muted pointer-events-none"} flex w-full min-w-0 flex-col items-center`}
      >
        <div
          ref={captureRef}
          className="flex w-full max-w-[40rem] min-w-0 flex-col items-stretch"
        >
          <div className="flex w-full min-w-0 flex-col items-center justify-center gap-1 bg-[var(--panel)] px-1 py-1.5 sm:gap-2 sm:px-4 sm:py-2">
            <RoundSelect
              rounds={rounds.rounds}
              currentRound={rounds.currentRound}
            />
            <small className="muted">{games.date}</small>
          </div>
          <Games games={games.games} />
        </div>
        <SaveScreenshot
          targetRef={captureRef}
          filename={`mpl-round-${rounds.currentRound}.png`}
        />
      </div>
    </RoundContext.Provider>
  )
}
