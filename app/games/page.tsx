import RoundWithData from "./RoundWithData"
import { getSeasons } from "@/lib/supabase-data"

export const revalidate = 60

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>
}) => {
  const [{ season: requestedSeason }, seasons] = await Promise.all([
    searchParams,
    getSeasons(),
  ])
  const season = seasons.includes(requestedSeason ?? "")
    ? requestedSeason
    : seasons[0]
  return <RoundWithData season={season} />
}

export default Page
