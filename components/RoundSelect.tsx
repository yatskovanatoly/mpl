"use client"

import { Rounds } from "@/lib/types"
import { useParams, useRouter } from "next/navigation"
import { ChangeEvent, FC, useState } from "react"

const RoundSelect: FC<Rounds> = ({ rounds, currentRound }) => {
  const params = useParams<{ round: string }>()
  const initialRound = params.round ?? currentRound
  const [round, setRound] = useState(initialRound)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  console.log(loading)

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    const index = event.target.selectedIndex
    let round = Number(value)

    if (!Number(value)) {
      round = index > 0 ? Number(rounds.at(-2)) + 1 : Number(rounds.at(1)) - 1
      setRound(round.toString())
    }

    setLoading(true)
    router.push(`/games/${round}`)
  }

  return (
    <div className={`${loading && "muted pointer-events-none"}`}>
      Раунд:
      <select value={round} onChange={handleChange}>
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
