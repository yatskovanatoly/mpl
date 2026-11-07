"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, useTransition } from "react"

const SeasonSelect = ({ seasons }: { seasons: string[] }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const selected = searchParams.get("season") ?? seasons[0] ?? ""

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("season", event.target.value)
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  if (seasons.length < 2) return null

  return (
    <label className="flex items-center">
      <select
        value={selected}
        aria-label="Выбрать сезон"
        onChange={handleChange}
        disabled={isPending}
        className="max-w-[8.5rem] cursor-pointer rounded bg-[var(--button-bg)] px-2 py-1 text-xs sm:max-w-[10rem] sm:text-sm"
      >
        {seasons.map((season) => (
          <option key={season} value={season}>
            {formatSeason(season)}
          </option>
        ))}
      </select>
    </label>
  )
}

const formatSeason = (season: string) => {
  const match = season.match(/^\d{2}-(\d{4}),\s*\d{2}-(\d{4})$/)
  return match ? `${match[1]}/${match[2].slice(-2)}` : season
}

export default SeasonSelect
