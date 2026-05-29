import axios from "axios"
import * as cheerio from "cheerio"
import { unstable_cache } from "next/cache"
import { Game, RoundData, Rounds } from "./types"
import { BASE_URL, MPL_ID } from "./urls"

const fetchRoundHtml = unstable_cache(
  async (roundKey: string) => {
    const response = await axios.get(
      `https://${BASE_URL}/championships/${MPL_ID}/games` +
        `${roundKey === "current" ? "" : `?round=${roundKey}`}`,
    )

    return response.data as string
  },
  ["mpl-round-html"],
  {
    revalidate: 60,
    tags: ["mpl-round-html"],
  },
)

const getCheerio = async (round?: number): Promise<cheerio.CheerioAPI> => {
  const html = await fetchRoundHtml(round?.toString() ?? "current")
  const $ = cheerio.load(html)

  return $
}

const getData = async (round?: number): Promise<RoundData> => {
  const games: Game[] = []
  const $ = await getCheerio(round)
  const date = $(".category2").text().trim() || ""

  try {
    $(".result").each((i, el) => {
      const row = $(el).find(".row").children()
      const time = $(el).parent().find(".date").text().trim()
      const game: Partial<Game> = {}

      row.each((_, child) => {
        const $child = $(child)
        const img = $child.find("img")
        const imgUrl = img.attr()?.src.replace("mini", "large").substring(1)
        const className = $child.attr("class")?.split(" ").at(-1)

        if (className === "home" || className === "away") {
          const id = $child.find("a").attr()!.href.split("/").at(-1)!

          game[className] = {
            id,
            team: $child.text().trim(),
            logo: imgUrl,
          }
        } else if (className === "score") {
          game.score = $child.text().trim()
        }
        game.time = !game.score ? time : undefined
      })
      games.push(game as Game)
    })
  } catch (e) {
    console.error(e)
  }
  return { date, games }
}

export const getRounds = async (round?: number): Promise<Rounds> => {
  const rounds: string[] = []
  let currentRound
  const $ = await getCheerio(round)

  try {
    $(".ruler_selector a, .ruler_selector .current").each((i, el) => {
      rounds.push($(el).text().trim())
    })
    $(".ruler_selector .current").each((i, el) => {
      currentRound = $(el).text().trim()
    })
  } catch (e) {
    console.error(e)
  }
  return { rounds, currentRound }
}

export default getData
