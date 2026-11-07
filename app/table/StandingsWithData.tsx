import Standings from "@/components/Standings"
import SeasonSelect from "@/components/SeasonSelect"
import { getStandings } from "@/lib/supabase-data"

const StandingsWithData = async ({
  season,
  seasons,
}: {
  season?: string
  seasons: string[]
}) => {
  const standings = await getStandings(season)

  return (
    <div className="w-full">
      <SeasonSelect seasons={seasons} selected={season ?? ""} />
      <Standings standings={standings.standings} />
    </div>
  )
}

export default StandingsWithData
