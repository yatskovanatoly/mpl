import RoundWithData from "../RoundWithData"
import { getSeasons } from "@/lib/supabase-data"

export const revalidate = 60

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ round: string }>
  searchParams: Promise<{ season?: string }>
}) => {
  const [{ round }, { season: requestedSeason }, seasons] = await Promise.all([
    params,
    searchParams,
    getSeasons(),
  ])
  const roundNum = Number(round)
  const season = seasons.includes(requestedSeason ?? "")
    ? requestedSeason
    : seasons[0]

  return <RoundWithData round={roundNum} season={season} />
}

export default Page
