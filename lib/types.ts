export type Team = {
	id: string
	team: string
	logo?: string
}

export type Game = {
	home: Team
	away: Team
	score: string
  time?: string
}

export type Rounds = {
	rounds: string[]
	currentRound: string | undefined
}

export type ParamsWithRound = {
	params: Promise<{ round: string }>
}
