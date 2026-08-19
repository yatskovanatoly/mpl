"use client"

import {
  CALENDAR_AUTO_GRID_MEDIA,
  CalendarGrid,
  computeCalendarGrid,
} from "@/lib/calendar-layout"
import { RefObject, useEffect, useLayoutEffect, useState } from "react"

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

const isSameGrid = (a: CalendarGrid | null, b: CalendarGrid) =>
  a?.columns === b.columns && a.rows === b.rows && a.fillHeight === b.fillHeight

/** Picks the column/row count that lets the cards fill the available space. */
const useCalendarGrid = (
  ref: RefObject<HTMLElement | null>,
  count: number,
  maxGames: number,
): CalendarGrid | null => {
  const [grid, setGrid] = useState<CalendarGrid | null>(null)

  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node || count <= 0) return

    const media = window.matchMedia(CALENDAR_AUTO_GRID_MEDIA)

    const measure = () => {
      const styles = getComputedStyle(node)
      const next = computeCalendarGrid({
        width: node.clientWidth,
        height: media.matches ? node.clientHeight : 0,
        columnGap: parseFloat(styles.columnGap) || 0,
        rowGap: parseFloat(styles.rowGap) || 0,
        count,
        maxGames,
      })

      setGrid((current) => (isSameGrid(current, next) ? current : next))
    }

    const observer = new ResizeObserver(measure)
    observer.observe(node)
    media.addEventListener("change", measure)
    measure()

    return () => {
      observer.disconnect()
      media.removeEventListener("change", measure)
    }
  }, [ref, count, maxGames])

  return grid
}

export default useCalendarGrid
