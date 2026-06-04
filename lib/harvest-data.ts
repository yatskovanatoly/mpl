import axios from "axios"
import * as cheerio from "cheerio"
import { unstable_cache } from "next/cache"
import { sanitizeTeamName } from "./sanitize-team-name"
import {
  Game,
  RoundData,
  Rounds,
  Standing,
  StandingForm,
  StandingsData,
} from "./types"
import { BASE_URL, MPL_ID } from "./urls"

const DATA_REVALIDATE_SECONDS = 60

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
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: ["mpl-round-html"],
  },
)

const getCheerio = async (round?: number): Promise<cheerio.CheerioAPI> => {
  const html = await fetchRoundHtml(round?.toString() ?? "current")
  const $ = cheerio.load(html)

  return $
}

const fetchStandingsHtml = unstable_cache(
  async () => {
    const response = await axios.get(
      `https://${BASE_URL}/championships/${MPL_ID}/show_table`,
    )

    return response.data as string
  },
  ["mpl-standings-html"],
  {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: ["mpl-standings-html"],
  },
)

const getStandingsCheerio = async (): Promise<cheerio.CheerioAPI> => {
  const html = await fetchStandingsHtml()
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
            team: sanitizeTeamName($child.text().trim()),
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

export const getStandings = async (): Promise<StandingsData> => {
  const standings: Standing[] = []
  const $ = await getStandingsCheerio()

  try {
    const table = $("table")
      .toArray()
      .map((el) => $(el))
      .find(($table) => {
        const firstRowText = $table.find("tr").first().text()

        return /Команда|Team/i.test(firstRowText)
      })

    if (!table) return { standings }

    table.find("tr").each((_, row) => {
      const cells = $(row).find("td")

      if (cells.length < 10) return

      const cellText = (index: number) => $(cells[index]).text().trim()
      const teamCell = $(cells[1])
      const teamLink = teamCell.find("a").first()
      const href = teamLink.attr("href") ?? ""
      const id = href.split("/").filter(Boolean).at(-1) ?? ""
      const logo = teamCell
        .find("img")
        .attr("src")
        ?.replace("mini", "large")
        .replace(/^\//, "")
      const form = $(cells[11])
        .find(".circlewin, .circledraw, .circlelose")
        .toArray()
        .map((formEl) => {
          const $formEl = $(formEl)
          const className = $formEl.attr("class") ?? ""
          let result: StandingForm["result"] = "loss"

          if (className.includes("circlewin")) result = "win"
          else if (className.includes("circledraw")) result = "draw"

          return {
            result,
            title: $formEl.attr("title")?.trim() ?? "",
          }
        })

      standings.push({
        position: cellText(0),
        team: {
          id,
          team: sanitizeTeamName(
            teamLink.text().trim() || teamCell.text().trim(),
          ),
          logo,
        },
        points: cellText(2),
        games: cellText(3),
        wins: cellText(4),
        draws: cellText(5),
        losses: cellText(6),
        goalsFor: cellText(7),
        goalsAgainst: cellText(8),
        goalDiff: cellText(9),
        form,
      })
    })
  } catch (e) {
    console.error(e)
  }

  return { standings }
}

export default getData
