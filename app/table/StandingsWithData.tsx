import Standings from "@/components/Standings"
import { getStandings } from "@/lib/supabase-data"

const StandingsWithData = async ({ season }: { season?: string }) => {
  const standings = await getStandings(season)

  return <Standings standings={standings.standings} />
}

export default StandingsWithData
