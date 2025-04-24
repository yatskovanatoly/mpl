export type Team = {
	id?: string
	team: string
	logo?: string
}

export type Result = {
	home: Team
	away: Team
	score: string
}

export type Rounds = {
	rounds: string[]
	currentRound: string | undefined
}

export type ParamsWithRound = {
	params: Promise<{ round: string }>
}