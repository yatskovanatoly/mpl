import RoundWithData from "../RoundWithData"

export const revalidate = 60

const Page = async ({ params }: { params: Promise<{ round: string }> }) => {
  const { round } = await params
  const roundNum = Number(round)

  return <RoundWithData round={roundNum} />
}

export default Page
