import Games from '@/components/Games'
import RoundSelect from '@/components/RoundSelect'
import getData, { getRounds } from '@/lib/harvest-data'
import { Game } from '@/lib/types'

export default async function GamesPage({ round }: { round?: number }) {
	const data: Game[] = await getData(round)
	const { rounds, currentRound } = await getRounds(round)

	return (
		<div className='flex flex-col items-center'>
			<div>
				Раунд: <RoundSelect rounds={rounds} currentRound={currentRound} />
			</div>
			<Games games={data} />
		</div>
	)
}
