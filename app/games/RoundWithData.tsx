import Round from "@/components/Round"
import Standings from "@/components/Standings"
import { getData, getRounds, getStandings } from "@/lib/supabase-data"
import { GAMES_LAYOUT_CLASS, GAMES_STANDINGS_CLASS } from "@/lib/layout-spacing"

const RoundWithData = async ({
  round,
  season,
}: {
  round?: number
  season?: string
}) => {
  const [games, rounds, standings] = await Promise.all([
    getData(round, season),
    getRounds(season),
    getStandings(season),
  ])

  return (
    <div className={GAMES_LAYOUT_CLASS}>
      <div className={GAMES_STANDINGS_CLASS}>
        <Standings standings={standings.standings} />
      </div>
      <Round games={games} rounds={rounds} season={season} />
    </div>
  )
}

export default RoundWithData
