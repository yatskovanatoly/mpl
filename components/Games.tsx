"use client"

import { logosMap } from "@/lib/logos-by-id"
import { Game, Team as TeamType } from "@/lib/types"
import { BASE_URL } from "@/lib/urls"
import Image from "next/image"
import { FC } from "react"

const Games: FC<{ games: Game[] }> = ({ games }) => {
  return (
    <div className={`flex max-w-2xl min-w-80 flex-col gap-4`}>
      {games.map(ResultItem)}
    </div>
  )
}

const ResultItem = (result: Game) => {
  const { score, home, away, time } = result

  return (
    <div key={result.home.team} className="grid grid-cols-[2fr_1fr_2fr]">
      <Team {...home} side="home" />
      <div className="text-md self-center transition-[font-size] sm:text-2xl">
        {score ? <Score score={score ?? time} /> : <Time time={time} />}
      </div>
      <Team {...away} side="away" />
    </div>
  )
}

const Team: FC<TeamType & { side: string }> = ({ team, logo, side, id }) => {
  return (
    <div
      className={`flex w-full items-center justify-between gap-4 font-medium max-sm:text-xs sm:gap-6 ${
        side === "home"
          ? "justify-self-start"
          : "flex-row-reverse justify-self-end text-right"
        // following styles might be better:
        // ? "justify-self-end text-right"
        // : "flex-row-reverse justify-self-start"
      }`}
    >
      <span className="w-full">{team}</span>
      <Logo logo={logo} id={id} />
    </div>
  )
}

const Logo: FC<{ id: string; logo?: string }> = ({ id, logo }) => {
  const logoUrl = `${BASE_URL}/${logo}`
  const src = logosMap[id] ?? logoUrl

  if (!src) return null
  return (
    <div className="size-12 shrink-0 transition-all duration-300 max-sm:size-8">
      <Image height={48} width={48} alt={"logo"} src={src} />
    </div>
  )
}

const Score: FC<{ score: string }> = ({ score }) => {
  const sanitized = score.replace(/\s+/g, " ").trim()
  const scoreSplit = sanitized.split(" ")

  return (
    <div className="flex flex-col">
      <div className={`flex w-full justify-center gap-2 font-bold`}>
        {scoreSplit.slice(0, 3).map((item, i) => (
          <div className="text-center" key={i}>
            {item}
          </div>
        ))}
      </div>
      {scoreSplit.length > 3 && (
        <div className="col-span-3 text-center text-sm font-medium opacity-30">
          {scoreSplit[3]}
        </div>
      )}
    </div>
  )
}

const Time: FC<{ time: string | undefined }> = ({ time }) => {
  return (
    <div
      className={`flex w-full items-center justify-center gap-1 text-xs sm:text-sm`}
    >
      <div>🕘</div>
      <div className="muted">{time}</div>
    </div>
  )
}

export default Games
