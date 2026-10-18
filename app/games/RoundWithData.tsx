import Round from "@/components/Round"
import Standings from "@/components/Standings"
import getData, { getRounds, getStandings } from "@/lib/harvest-data"
import { GAMES_LAYOUT_CLASS, GAMES_STANDINGS_CLASS } from "@/lib/layout-spacing"

const RoundWithData = async ({ round }: { round?: number }) => {
  const [games, rounds, standings] = await Promise.all([
    getData(round),
    getRounds(round),
    getStandings(),
  ])

  return (
    <div className={GAMES_LAYOUT_CLASS}>
      <div className={GAMES_STANDINGS_CLASS}>
        <Standings standings={standings.standings} />
      </div>
      <Round games={games} rounds={rounds} />
    </div>
  )
}

export default RoundWithData
