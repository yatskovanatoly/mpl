'use client'

import { logosMap } from '@/lib/logos-by-id'
import { Result, Team as TeamType } from '@/lib/types'
import { BASE_URL } from '@/lib/urls'
import Image from 'next/image'
import { FC, useState } from 'react'

const Results: FC<{ results: Result[] }> = ({ results }) => {
	return (
		<div className='w-[500px] flex flex-col gap-4'>
			{results.map(ResultItem)}
		</div>
	)
}

const ResultItem = (result: Result) => {
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

const Logo: FC<{ logo: string | undefined; id?: string }> = ({ logo, id }) => {
	const url = id ? logosMap[id] : `${BASE_URL}/${logo}`
	const [logoUrl, setLogoUrl] = useState(url)

	if (!logo) return null
	return (
		<Image
			height={50}
			width={50}
			alt={'logo'}
			src={logoUrl}
			className=''
			onError={() => setLogoUrl(logoUrl.replace('original', 'large'))}
		/>
	)
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

export default Results
