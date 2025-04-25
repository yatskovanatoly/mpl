import axios from 'axios'
import * as cheerio from 'cheerio'
import { Game, Rounds } from './types'
import { MPL_ID, MYCHAMP_URL } from './urls'

const getCheerio = async (round?: number): Promise<cheerio.CheerioAPI> => {
	const response = await axios.get(
		`${MYCHAMP_URL}/${MPL_ID}/games` +
			`${round ? `?round=${round.toString()}` : ''}`
	)
	const $ = cheerio.load(response.data)

	return $
}

const getData = async (round?: number) => {
	const games: Game[] = []
	const $ = await getCheerio(round)

	try {
		$('.result').each((i, el) => {
			const row = $(el).find('.row').children()
			const time = $(el).parent().find('.date').text()
			const game: Partial<Game> = {}

			row.each((_, child) => {
				const $child = $(child)
				const img = $child.find('img')
				const imgUrl = img.attr()?.src.replace('mini', 'large').substring(1)
				const className = $child.attr('class')?.split(' ').at(-1)

				if (className === 'home' || className === 'away') {
					const id = $child.find('a').attr()!.href.split('/').at(-1)!

					game[className] = {
						id,
						team: $child.text().trim(),
						logo: imgUrl,
					}
				} else if (className === 'score') {
					game.score = $child.text().trim()
				}
				game.time = !game.score ? time : undefined
			})
			games.push(game as Game)
		})
	} catch (e) {
		console.error(e)
	}
	return games
}

export const getRounds = async (round?: number): Promise<Rounds> => {
	const rounds: string[] = []
	let currentRound
	const $ = await getCheerio(round)

	try {
		$('.ruler_selector a, .ruler_selector .current').each((i, el) => {
			rounds.push($(el).text().trim())
		})
		$('.ruler_selector .current').each((i, el) => {
			currentRound = $(el).text().trim()
		})
	} catch (e) {
		console.error(e)
	}
	return { rounds, currentRound }
}

export default getData
