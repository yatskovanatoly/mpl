import GamesPage from '@/components/GamesPage'

export default function Page({ params }: { params: { round: string } }) {
	const round = Number(params.round)
	return <GamesPage round={isNaN(round) ? undefined : round} />
}
