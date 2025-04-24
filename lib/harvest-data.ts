import axios from 'axios'
import * as cheerio from 'cheerio'
import { Result, Rounds } from './types'
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
	const results: Result[] = []
	const $ = await getCheerio(round)

	try {
		$('.result').each((i, el) => {
			const resultChildren = $(el).children()
			const rowChildren = resultChildren.children()
			const result: Partial<Result> = {}

			rowChildren.each((_, child) => {
				const $child = $(child)
				const img = $child.find('img')
				const imgUrl = img.attr()?.src.replace('mini', 'original').substring(1)
				const clubId = imgUrl?.match(/\d+/)?.[0]
				const className = $child.attr('class')?.split(' ').at(-1)

				if (className === 'home' || className === 'away') {
					result[className] = {
						team: $child.text().trim(),
						logo: imgUrl,
						id: clubId,
					}
				} else if (className === 'score') {
					result.score = $child.text().trim()
				}
			})
			results.push(result as Result)
		})
	} catch (e) {
		console.error(e)
	}
	return results
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
