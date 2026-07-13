import axios from "axios"
import * as cheerio from "cheerio"
import { unstable_cache } from "next/cache"
import { REQUEST_HEADERS } from "./request-headers"
import { resolveSeasonId } from "./resolve-season"
import { sanitizeTeamName } from "./sanitize-team-name"
import { CalendarData, Game } from "./types"
import { BASE_URL, MPL_ID } from "./urls"

const DATA_REVALIDATE_SECONDS = 60

export const getCalendarData = unstable_cache(
  async (): Promise<CalendarData> => {
    const seasonId = await resolveSeasonId()
    const params = new URLSearchParams({ "configuration[type]": "games" })

    if (seasonId) {
      params.set("season", seasonId)
    }

    const response = await axios.get(
      `https://${BASE_URL}/championships/${MPL_ID}/games?${params.toString()}`,
      { headers: REQUEST_HEADERS },
    )
    const $ = cheerio.load(response.data)
    const rounds: CalendarData["rounds"] = []
    const dateLabels: string[] = []
    const tourSections: { round: string; tableIndex: number }[] = []
    const tables = $("table.championship").toArray()

    tables.forEach((table, tableIndex) => {
      const label = $(table).prevAll("h1").first().text().trim()
      const tourMatch = label.match(/^Тур\s+(\d+)$/)

      if (tourMatch) {
        tourSections.push({ round: tourMatch[1], tableIndex })
        return
      }

      dateLabels.push(label)
    })

    tourSections.sort((a, b) => Number(a.round) - Number(b.round))

    for (const { round, tableIndex } of tourSections) {
      const date = dateLabels[Number(round) - 1] ?? ""
      const games: Game[] = []

      $(tables[tableIndex])
        .find("tr.game")
        .each((_, row) => {
          const $row = $(row)
          const time = $row.find(".date").text().replace(/\s+/g, " ").trim()
          const score = $row.find(".score").text().replace(/\s+/g, " ").trim()
          const homeCell = $row.find(".home")
          const awayCell = $row.find(".away")

          games.push({
            time,
            score,
            home: {
              id: homeCell.attr("name") || "",
              team: sanitizeTeamName(homeCell.text()),
              logo: homeCell
                .find("img")
                .attr("src")
                ?.replace("mini", "large")
                .replace(/^\//, ""),
            },
            away: {
              id: awayCell.attr("name") || "",
              team: sanitizeTeamName(awayCell.text()),
              logo: awayCell
                .find("img")
                .attr("src")
                ?.replace("mini", "large")
                .replace(/^\//, ""),
            },
          })
        })

      if (games.length > 0) {
        rounds.push({ round, date, games })
      }
    }

    if (rounds.length === 0) {
      $("table.championship").each((index, table) => {
        const date = $(table).prevAll("h1").first().text().trim()
        const games: Game[] = []

        $(table)
          .find("tr.game")
          .each((_, row) => {
            const $row = $(row)
            const time = $row.find(".date").text().replace(/\s+/g, " ").trim()
            const score = $row.find(".score").text().replace(/\s+/g, " ").trim()
            const homeCell = $row.find(".home")
            const awayCell = $row.find(".away")

            games.push({
              time,
              score,
              home: {
                id: homeCell.attr("name") || "",
                team: sanitizeTeamName(homeCell.text()),
                logo: homeCell
                  .find("img")
                  .attr("src")
                  ?.replace("mini", "large")
                  .replace(/^\//, ""),
              },
              away: {
                id: awayCell.attr("name") || "",
                team: sanitizeTeamName(awayCell.text()),
                logo: awayCell
                  .find("img")
                  .attr("src")
                  ?.replace("mini", "large")
                  .replace(/^\//, ""),
              },
            })
          })

        if (games.length > 0) {
          rounds.push({
            round: String(index + 1),
            date,
            games,
          })
        }
      })
    }

    return { rounds }
  },
  ["mpl-calendar-data"],
  {
    revalidate: DATA_REVALIDATE_SECONDS,
    tags: ["mpl-calendar-data"],
  },
)
