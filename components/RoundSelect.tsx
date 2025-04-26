"use client"

import { Rounds } from "@/lib/types"
import { useParams, useRouter } from "next/navigation"
import { ChangeEvent, FC, useState } from "react"

const RoundSelect: FC<Rounds> = ({ rounds, currentRound }) => {
  const params = useParams<{ round: string }>()
  const initialRound = params.round ?? currentRound
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    const index = event.target.selectedIndex
    let round = Number(value)

    if (!Number(value)) {
      round = index > 0 ? Number(rounds.at(-2)) + 1 : Number(rounds.at(1)) - 1
    }

    setLoading(true)
    router.push(`/games/${round}`)
  }

  return (
    <div
      aria-disabled={loading}
      className={`${loading && "muted pointer-events-none"}`}
    >
      Раунд:
      <select defaultValue={initialRound} onChange={handleChange}>
        {rounds.map((round, i) => (
          <option key={i + round} value={round}>
            {round}
          </option>
        ))}
      </select>
    </div>
  )
}

export default RoundSelect
