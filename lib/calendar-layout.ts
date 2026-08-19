import type { CSSProperties } from "react"

// header (3.75rem) + content gap (1rem) + layout bottom padding (1rem)
export const CALENDAR_PAGE =
  "flex w-full min-w-0 flex-col md:h-[calc(100dvh-5.75rem)] md:overflow-hidden"

/** Viewport width from which the grid fills the whole page height. */
export const CALENDAR_AUTO_GRID_MEDIA = "(min-width: 768px)"

// Columns are doubled (each card spans two tracks) so an incomplete last row
// can be centred exactly, whatever the number of missing cards.
export const CALENDAR_LAYOUT =
  "grid min-h-0 w-full flex-1 grid-cols-4 content-start gap-1.5 min-[480px]:grid-cols-6 min-[480px]:gap-2 md:auto-rows-fr md:grid-cols-8 md:gap-3 xl:grid-cols-10"

export const CALENDAR_CARD = "col-span-2 min-h-0 min-w-0"

export const CALENDAR_LEG_HEADER =
  "mb-2 flex w-full shrink-0 items-center justify-center bg-[var(--panel)] px-2 py-1 sm:mb-3"

export type CalendarGrid = {
  columns: number
  rows: number
  /** Rows share the container height instead of following their content. */
  fillHeight: boolean
}

/** Narrowest card that still shows a readable team name. */
const MIN_CARD_WIDTH = 150
/** Comfortable card proportions, used as the target shape of a card. */
const TARGET_CARD_WIDTH = 190
const CARD_HEADER_HEIGHT = 30
const CARD_GAME_HEIGHT = 16

const EMPTY_CELL_WEIGHT = 1
const NARROW_CARD_WEIGHT = 4

export const computeCalendarGrid = ({
  width,
  height,
  columnGap,
  rowGap,
  count,
  maxGames,
}: {
  width: number
  height: number
  columnGap: number
  rowGap: number
  count: number
  maxGames: number
}): CalendarGrid => {
  if (count <= 0 || width <= 0) {
    return { columns: 1, rows: Math.max(count, 1), fillHeight: false }
  }

  // No fixed height (mobile): only pick how many cards fit across.
  if (height <= 0) {
    const columns = Math.min(
      count,
      Math.max(
        1,
        Math.floor((width + columnGap) / (MIN_CARD_WIDTH + columnGap)),
      ),
    )

    return { columns, rows: Math.ceil(count / columns), fillHeight: false }
  }

  const targetRatio =
    TARGET_CARD_WIDTH /
    (CARD_HEADER_HEIGHT + Math.max(maxGames, 1) * CARD_GAME_HEIGHT)

  let best: CalendarGrid = { columns: 1, rows: count, fillHeight: true }
  let bestScore = Infinity

  for (let columns = 1; columns <= count; columns += 1) {
    const rows = Math.ceil(count / columns)
    const cardWidth = (width - columnGap * (columns - 1)) / columns
    const cardHeight = (height - rowGap * (rows - 1)) / rows
    if (cardWidth <= 0 || cardHeight <= 0) continue

    const shape = Math.abs(Math.log(cardWidth / cardHeight / targetRatio))
    const emptyCells = ((columns * rows - count) / count) * EMPTY_CELL_WEIGHT
    const narrow =
      Math.max(0, (MIN_CARD_WIDTH - cardWidth) / MIN_CARD_WIDTH) *
      NARROW_CARD_WEIGHT
    const score = shape + emptyCells + narrow

    if (score < bestScore) {
      bestScore = score
      best = { columns, rows, fillHeight: true }
    }
  }

  return best
}

export const calendarGridStyle = (
  grid: CalendarGrid | null,
): CSSProperties | undefined => {
  if (!grid) return undefined

  return {
    gridTemplateColumns: `repeat(${grid.columns * 2}, minmax(0, 1fr))`,
    ...(grid.fillHeight
      ? { gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))` }
      : {}),
  }
}

/** Offsets the first card of an incomplete last row so the row stays centred. */
export const calendarCardStyle = (
  grid: CalendarGrid | null,
  index: number,
  count: number,
): CSSProperties | undefined => {
  if (!grid) return undefined

  const lastRowStart = (grid.rows - 1) * grid.columns
  if (index !== lastRowStart) return undefined

  const missing = grid.columns - (count - lastRowStart)
  if (missing <= 0) return undefined

  return { gridColumnStart: 1 + missing }
}
