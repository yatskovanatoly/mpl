import Calendar from "@/components/Calendar"
import { filterRoundsByLeg, parseCalendarLeg } from "@/lib/calendar-legs"
import { getCalendarData } from "@/lib/supabase-data"

const CalendarWithData = async ({
  leg,
  season,
}: {
  leg: string
  season?: string
}) => {
  const legNum = parseCalendarLeg(leg)
  const calendar = await getCalendarData(season)
  const rounds = filterRoundsByLeg(calendar.rounds, legNum)

  return <Calendar rounds={rounds} leg={legNum} season={season} />
}

export default CalendarWithData
