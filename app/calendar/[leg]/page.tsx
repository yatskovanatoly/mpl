import CalendarWithData from "./CalendarWithData"

export const revalidate = 60

const Page = async ({ params }: { params: Promise<{ leg: string }> }) => {
  const { leg } = await params

  return <CalendarWithData leg={leg} />
}

export default Page
