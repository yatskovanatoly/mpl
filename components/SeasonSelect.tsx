"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, useTransition } from "react"

const SeasonSelect = ({
  seasons,
  selected,
}: {
  seasons: string[]
  selected: string
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("season", event.target.value)
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  if (seasons.length < 2) return null

  return (
    <label className="flex items-center justify-center gap-2 py-1 text-xs sm:text-sm">
      <span>Сезон:</span>
      <select
        value={selected}
        onChange={handleChange}
        disabled={isPending}
        className="max-w-[15rem] rounded bg-[var(--button-bg)] px-2 py-1"
      >
        {seasons.map((season) => (
          <option key={season} value={season}>
            {season}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SeasonSelect
