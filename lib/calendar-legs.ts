import { CalendarRound } from "./types"

export const CALENDAR_LEGS = [1, 2] as const

export type CalendarLeg = (typeof CALENDAR_LEGS)[number]

export const parseCalendarLeg = (value: string): CalendarLeg =>
  value === "2" ? 2 : 1

export const filterRoundsByLeg = (
  rounds: CalendarRound[],
  leg: CalendarLeg,
): CalendarRound[] => {
  const sorted = [...rounds].sort((a, b) => Number(a.round) - Number(b.round))
  const midpoint = Math.ceil(sorted.length / 2)

  if (leg === 1) {
    return sorted.slice(0, midpoint)
  }

  return sorted.slice(midpoint)
}
