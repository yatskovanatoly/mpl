"use client"

import Games from "@/components/Games"
import NavButton from "@/components/NavButton"
import RoundSelect from "@/components/RoundSelect"
import SaveScreenshot from "@/components/SaveScreenshot"
import RoundContext from "@/lib/round-context"
import { RoundData, Rounds } from "@/lib/types"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const current = Number(rounds.currentRound)
  // The ruler lists several rounds around the current one, so its neighbours
  // are present whenever they exist.
  const hasRound = (round: number) => rounds.rounds.includes(String(round))
  const prevRound = hasRound(current - 1) ? current - 1 : null
  const nextRound = hasRound(current + 1) ? current + 1 : null

  const goTo = (round: number) => {
    setLoading(true)
    router.push(`/games/${round}`)
  }

  return (
    <RoundContext.Provider value={{ loading, setLoading }}>
      <div
        aria-disabled={loading}
        className={`${loading && "pointer-events-none opacity-[0.33]"} flex w-full min-w-0 flex-col items-center`}
      >
        <div
          ref={captureRef}
          className="flex w-full max-w-[40rem] min-w-0 flex-col items-stretch bg-[var(--background)] text-[var(--foreground)]"
        >
          <div className="grid w-full min-w-0 grid-cols-[1.75rem_1fr_1.75rem] items-center bg-[var(--panel)] px-1 py-1.5 sm:grid-cols-[2rem_1fr_2rem] sm:px-4 sm:py-2">
            <div className="flex justify-center">
              {prevRound !== null && (
                <NavButton
                  label={`Тур ${prevRound}`}
                  onClick={() => goTo(prevRound)}
                >
                  ‹
                </NavButton>
              )}
            </div>
            <div className="flex min-w-0 flex-col items-center justify-center gap-1 sm:gap-2">
              <RoundSelect
                rounds={rounds.rounds}
                currentRound={rounds.currentRound}
              />
              <small className="muted">{games.date}</small>
            </div>
            <div className="flex justify-center">
              {nextRound !== null && (
                <NavButton
                  label={`Тур ${nextRound}`}
                  onClick={() => goTo(nextRound)}
                >
                  ›
                </NavButton>
              )}
            </div>
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
