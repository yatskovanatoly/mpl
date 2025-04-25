"use client"

import { logosMap } from "@/lib/logos-by-id"
import { Game, Team as TeamType } from "@/lib/types"
import { BASE_URL } from "@/lib/urls"
import Image from "next/image"
import { FC } from "react"

const Games: FC<{ games: Game[] }> = ({ games }) => {
  return (
    <div className="flex max-w-2xl flex-col gap-4">{games.map(ResultItem)}</div>
  )
}

const ResultItem = (result: Game) => {
  const { score, home, away, time } = result

  return (
    <div key={result.home.team} className="grid grid-cols-3">
      <Team {...home} side="home" />
      <div className="text-md self-center font-bold transition-[font-size] sm:text-2xl">
        {score ? <Score score={score ?? time} /> : <Time time={time} />}
      </div>
      <Team {...away} side="away" />
    </div>
  )
}

const Team: FC<TeamType & { side: string }> = ({ team, logo, side, id }) => {
  return (
    <div
      className={`flex w-full items-center justify-between gap-4 max-sm:text-xs ${
        side === "home"
          ? "justify-self-start"
          : "flex-row-reverse justify-self-end text-right"
      }`}
    >
      {team}
      <Logo logo={logo} id={id} />
    </div>
  )
}

const Logo: FC<{ id: string; logo?: string }> = ({ id, logo }) => {
  const logoUrl = `${BASE_URL}/${logo}`
  const src = logosMap[id] ?? logoUrl

  if (!src) return null
  return (
    <div className="size-12 shrink-0 transition-all duration-300 max-sm:size-6">
      <Image height={48} width={48} alt={"logo"} src={src} />
    </div>
  )
}

const Score: FC<{ score: string }> = ({ score }) => {
  const sanitized = score.replace(/\s+/g, " ").trim()
  const scoreSplit = sanitized.split(" ")

  return (
    <div
      className={`grid w-12 grid-cols-3 items-center justify-center justify-self-center sm:w-16`}
    >
      {scoreSplit.slice(0, 3).map((item, i) => (
        <div className="text-center" key={i}>
          {item}
        </div>
      ))}
      {scoreSplit.length > 3 && (
        <div className="col-span-3 text-center text-sm opacity-30">
          {scoreSplit[3]}
        </div>
      )}
    </div>
  )
}

const Time: FC<{ time: string | undefined }> = ({ time }) => {
  return (
    <div
      className={`flex w-16 items-center justify-between gap-2 justify-self-center text-nowrap sm:w-24`}
    >
      <div>🕘</div>
      <div className="muted">{time}</div>
    </div>
  )
}

export default Games
