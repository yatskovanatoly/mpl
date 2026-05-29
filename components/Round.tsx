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
        className={`${loading && "muted pointer-events-none"} flex flex-col items-center`}
      >
        <div ref={captureRef} className="flex flex-col items-center">
          <div className="flex w-full flex-col items-center justify-center gap-1 bg-neutral-200 px-4 py-2 sm:p-4 dark:bg-stone-800">
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
