import axios from "axios"
import * as cheerio from "cheerio"
import { unstable_cache } from "next/cache"
import { REQUEST_HEADERS } from "./request-headers"
import { BASE_URL, MPL_ID } from "./urls"

const DATA_REVALIDATE_SECONDS = 60

const fetchSeasonListHtml = unstable_cache(
  async () => {
    const response = await axios.get(
      `https://${BASE_URL}/championships/${MPL_ID}/games`,
      { headers: REQUEST_HEADERS },
    )

    return response.data as string
  },
  ["mpl-season-list-html"],
  {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: ["mpl-season-list-html"],
  },
)

const seasonHasGames = async (seasonId: string): Promise<boolean> => {
  const response = await axios.get(
    `https://${BASE_URL}/championships/${MPL_ID}/games?season=${seasonId}`,
    { headers: REQUEST_HEADERS },
  )
  const $ = cheerio.load(response.data)

  return $(".result").length > 0 || $(".ruler_selector a").length > 0
}

export const resolveSeasonId = unstable_cache(
  async (): Promise<string | undefined> => {
    const $ = cheerio.load(await fetchSeasonListHtml())

    if ($(".result").length > 0 || $(".ruler_selector a").length > 0) {
      return undefined
    }

    const seasonIds: string[] = []
    $('a[href*="season="]').each((_, element) => {
      const href = $(element).attr("href") ?? ""
      const match = href.match(/season=(\d+)/)

      if (match && !seasonIds.includes(match[1])) {
        seasonIds.push(match[1])
      }
    })

    for (const seasonId of seasonIds) {
      if (await seasonHasGames(seasonId)) {
        return seasonId
      }
    }

    return undefined
  },
  ["mpl-season-id"],
  {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: ["mpl-season-id"],
  },
)

export const seasonQuery = (seasonId: string | undefined) =>
  seasonId ? `season=${seasonId}` : ""
