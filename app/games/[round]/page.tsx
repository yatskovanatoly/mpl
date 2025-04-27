import RoundWithData from "../RoundWithData"

const Page = async ({ params }: { params: Promise<{ round: string }> }) => {
  const { round } = await params
  const roundNum = Number(round)

  return <RoundWithData round={roundNum} />
}

export default Page
