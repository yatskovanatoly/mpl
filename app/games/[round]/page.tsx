import GamesPage from "@/components/Round"

export default async function Page({
  params,
}: {
  params: Promise<{ round: string }>
}) {
  const { round } = await params
  const roundNum = Number(round)

  return <GamesPage round={roundNum} />
}
