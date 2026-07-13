import Calendar from "@/components/Calendar"
import { filterRoundsByLeg, parseCalendarLeg } from "@/lib/calendar-legs"
import { getCalendarData } from "@/lib/harvest-calendar-data"

const CalendarWithData = async ({ leg }: { leg: string }) => {
  const legNum = parseCalendarLeg(leg)
  const calendar = await getCalendarData()
  const rounds = filterRoundsByLeg(calendar.rounds, legNum)

  return <Calendar rounds={rounds} leg={legNum} />
}

export default CalendarWithData
