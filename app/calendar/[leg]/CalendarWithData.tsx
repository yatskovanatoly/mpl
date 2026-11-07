import Calendar from "@/components/Calendar"
import SeasonSelect from "@/components/SeasonSelect"
import { filterRoundsByLeg, parseCalendarLeg } from "@/lib/calendar-legs"
import { getCalendarData } from "@/lib/supabase-data"

const CalendarWithData = async ({
  leg,
  season,
  seasons,
}: {
  leg: string
  season?: string
  seasons: string[]
}) => {
  const legNum = parseCalendarLeg(leg)
  const calendar = await getCalendarData(season)
  const rounds = filterRoundsByLeg(calendar.rounds, legNum)

  return (
    <div className="w-full">
      <SeasonSelect seasons={seasons} selected={season ?? ""} />
      <Calendar rounds={rounds} leg={legNum} season={season} />
    </div>
  )
}

export default CalendarWithData
