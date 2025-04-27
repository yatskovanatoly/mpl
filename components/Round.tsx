import Games from "@/components/Games"
import RoundSelect from "@/components/RoundSelect"
import getData, { getRounds } from "@/lib/harvest-data"

export default async function GamesPage({ round }: { round?: number }) {
  const { date, games } = await getData(round)
  const { rounds, currentRound } = await getRounds(round)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col w-full items-center justify-center px-4 py-2 bg-neutral-200 gap-1 dark:bg-stone-800">
        <RoundSelect rounds={rounds} currentRound={currentRound} />
        <small className="muted">{date}</small>
      </div>
      <Games games={games} />
    </div>
  )
}
