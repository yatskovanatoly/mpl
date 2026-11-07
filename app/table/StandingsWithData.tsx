import Standings from "@/components/Standings"
import { getStandings } from "@/lib/supabase-data"

const StandingsWithData = async () => {
  const standings = await getStandings()

  return <Standings standings={standings.standings} />
}

export default StandingsWithData
