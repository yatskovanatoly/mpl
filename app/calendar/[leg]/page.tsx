import CalendarWithData from "./CalendarWithData"
import { getSeasons } from "@/lib/supabase-data"

export const revalidate = 60

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ leg: string }>
  searchParams: Promise<{ season?: string }>
}) => {
  const [{ leg }, { season: requestedSeason }, seasons] = await Promise.all([
    params,
    searchParams,
    getSeasons(),
  ])
  const season = seasons.includes(requestedSeason ?? "")
    ? requestedSeason
    : seasons[0]

  return <CalendarWithData leg={leg} season={season} seasons={seasons} />
}

export default Page
