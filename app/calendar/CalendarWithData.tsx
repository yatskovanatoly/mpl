import Calendar from "@/components/Calendar"
import { getCalendarData } from "@/lib/harvest-calendar-data"

const CalendarWithData = async () => {
  const calendar = await getCalendarData()

  return <Calendar rounds={calendar.rounds} />
}

export default CalendarWithData
