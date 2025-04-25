'use client'

import { logosMap } from '@/lib/logos-by-id'
import { Game, Team as TeamType } from '@/lib/types'
import { BASE_URL } from '@/lib/urls'
import Image from 'next/image'
import { FC } from 'react'

const Games: FC<{ games: Game[] }> = ({ games }) => {
	return (
		<div className='w-[500px] flex flex-col gap-4'>{games.map(ResultItem)}</div>
	)
}

const ResultItem = (result: Game) => {
	const { score, home, away } = result

	return (
		<div key={result.home.team} className='grid grid-cols-3 w-full'>
			<Team {...home} side='home' />
			<Score score={score} />
			<Team {...away} side='away' />
		</div>
	)
}

const Team: FC<TeamType & { side: string }> = ({ team, logo, side, id }) => {
	return (
		<div
			className={`items-center flex gap-4 w-full justify-between ${
				side === 'home'
					? 'justify-self-start'
					: 'justify-self-end text-right flex-row-reverse'
			}`}
		>
			{team}
			<Logo logo={logo} id={id} />
		</div>
	)
}

const Logo: FC<{ id: string; logo?: string }> = ({ id, logo }) => {
	const logoUrl = `${BASE_URL}/${logo}`
	const src = logosMap[id] ?? logoUrl

	if (!src) return null
	return <Image height={50} width={50} alt={'logo'} src={src} />
}

const Score: FC<{ score: string }> = ({ score }) => {
	if (!score) return <div className='grow' />

	const sanitized = score.replace(/\s+/g, ' ').trim()
	const scoreSplit = sanitized.split(' ')

	return (
		<div
			className={`w-16 items-center grid grid-cols-3 justify-self-center text-2xl font-bold m-auto`}
		>
			{scoreSplit.slice(0, 3).map((item, i) => (
				<div className='text-center' key={i}>
					{item}
				</div>
			))}
			{scoreSplit.length > 3 && (
				<div className='col-span-3 text-center text-sm opacity-30'>
					{scoreSplit[3]}
				</div>
			)}
		</div>
	)
}

export default Games
