import axios from "axios"
import * as cheerio from "cheerio"
import { Game, Round } from "./types"
import { MPL_ALL_GAMES } from "./urls"

const getCheerio = async (): Promise<cheerio.CheerioAPI> => {
  const response = await axios.get(`https://${MPL_ALL_GAMES}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
  const $ = cheerio.load(response.data)

  return $
}

const getData = async (): Promise<Round[]> => {
  const $ = await getCheerio()

  const rounds: Round[] = []

  try {
    $(".championship")
      .children()
      .each((i, el) => {
        const El = $(el)
        const stage = El.parent().prev().text().trim() || ""

        const round: Round = {
          stage,
          games: [],
        }

        El.find(".game").each((i, el) => {
          const El = $(el)

          const getText = (selector: string) =>
            El.find(selector).text().replace(/\s+/g, " ").trim()

          const time = getText(".date")
          const score = getText(".score")
          const home = getText(".home")
          const away = getText(".away")
          const homeId = El.find(".home").attr("name") || ""
          const awayId = El.find(".home").attr("name") || ""

          const game: Game = {
            time,
            home: {
              id: homeId,
              team: home,
            },
            score,
            away: {
              id: awayId,
              team: away,
            },
          }

          round.games.push(game)
        })
        rounds.push(round)
      })
  } catch (e) {
    console.error(e)
  }
  return rounds
}

getData()
