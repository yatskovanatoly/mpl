'use client'

import { Rounds } from '@/lib/types'
import { useParams, useRouter } from 'next/navigation'
import { ChangeEvent, FC } from 'react'

const RoundSelect: FC<Rounds> = ({ rounds, currentRound }) => {
	const params = useParams<{ round: string }>()
	const round = params.round ?? currentRound
	const router = useRouter()

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value
		const index = event.target.selectedIndex

		if (!Number(value)) {
			console.log(index, Number(rounds.at(-2)), Number(rounds.at(1)))
			router.push(
				`/games/${
					index > 0 ? Number(rounds.at(-2)) + 1 : Number(rounds.at(1)) - 1
				}`
			)
		} else router.push(`/games/${value}`)
	}

	return (
		<select defaultValue={round} onChange={handleChange}>
			{rounds.map((round, i) => (
				<option key={i + round} value={round}>
					{round}
				</option>
			))}
		</select>
	)
}

export default RoundSelect
