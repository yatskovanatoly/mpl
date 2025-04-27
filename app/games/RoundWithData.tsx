import Round from "@/components/Round"
import getData, { getRounds } from "@/lib/harvest-data"

const RoundWithData = async ({ round }: { round?: number }) => {
  const games = await getData(round)
  const rounds = await getRounds(round)

  return <Round games={games} rounds={rounds} />
}

export default RoundWithData
