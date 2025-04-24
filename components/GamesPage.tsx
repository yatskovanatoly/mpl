import Results from '@/components/Results'
import RoundSelect from '@/components/RoundSelect'
import getData, { getRounds } from '@/lib/harvest-data'
import { Result } from '@/lib/types'

export default async function GamesPage({ round }: { round?: number }) {
	const data: Result[] = await getData(round)
	const { rounds, currentRound } = await getRounds(round)

	return (
		<div className='flex flex-col items-center'>
			<div>
				Раунд: <RoundSelect rounds={rounds} currentRound={currentRound} />
			</div>
			<Results results={data} />
		</div>
	)
}
