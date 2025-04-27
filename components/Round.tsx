"use client"

import Games from "@/components/Games"
import RoundSelect from "@/components/RoundSelect"
import RoundContext from "@/lib/round-context"
import { RoundData, Rounds } from "@/lib/types"
import { useState } from "react"

export default function Round({
  rounds,
  games,
}: {
  rounds: Rounds
  games: RoundData
}) {
  const [loading, setLoading] = useState(false)

  return (
    <RoundContext.Provider value={{ loading, setLoading }}>
      <div
        aria-disabled={loading}
        className={`${loading && "muted pointer-events-none"} flex flex-col items-center gap-4`}
      >
        <div className="flex w-full flex-col items-center justify-center gap-1 bg-neutral-200 px-4 py-2 dark:bg-stone-800">
          <RoundSelect
            rounds={rounds.rounds}
            currentRound={rounds.currentRound}
          />
          <small className="muted">{games.date}</small>
        </div>
        <Games games={games.games} />
      </div>
    </RoundContext.Provider>
  )
}
