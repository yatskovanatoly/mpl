import {
  CALENDAR_CARD,
  CALENDAR_LAYOUT,
  CALENDAR_LEG_HEADER,
} from "@/lib/calendar-layout"

const SKELETON_GAMES_COUNT = 7
const SKELETON_STANDINGS_COUNT = 14
const SKELETON_CALENDAR_ROUNDS = 13
const SKELETON_CALENDAR_GAMES = 7

const TABLE_GRID =
  "grid-cols-[1.125rem_minmax(0,1fr)_9.375rem_3rem] sm:grid-cols-[2rem_minmax(0,1fr)_14.75rem_4.5rem]"

const STATS_GRID =
  "grid-cols-[repeat(8,minmax(0,1.0625rem))] sm:grid-cols-[repeat(8,1.625rem)]"

const SkeletonBlock = ({ className }: { className: string }) => (
  <div
    className={`animate-pulse rounded bg-[var(--foreground)] opacity-15 ${className}`}
  />
)

export const GamesSkeleton = () => (
  <div className="flex w-full min-w-0 flex-col items-center" aria-busy="true">
    <div className="flex w-full max-w-[40rem] min-w-0 flex-col items-stretch">
      <div className="flex w-full min-w-0 flex-col items-center justify-center gap-1 bg-[var(--panel)] px-1 py-1.5 sm:gap-2 sm:px-4 sm:py-2">
        <SkeletonBlock className="h-5 w-24" />
        <SkeletonBlock className="h-3 w-32" />
      </div>
      <div className="flex w-full flex-col">
        {Array.from({ length: SKELETON_GAMES_COUNT }, (_, index) => (
          <div
            key={index}
            className={`grid h-24 grid-cols-[2fr_1fr_2fr] items-center p-4 max-sm:h-20 max-sm:p-3 ${
              index % 2 ? "bg-[var(--row-b)]" : "bg-[var(--row-a)]"
            }`}
          >
            <div className="flex items-center justify-between gap-4 sm:gap-6">
              <SkeletonBlock className="h-4 w-24 max-sm:w-16 sm:h-5 sm:w-36" />
              <SkeletonBlock className="size-12 max-sm:size-8" />
            </div>
            <div className="flex justify-center">
              <SkeletonBlock className="h-6 w-14 sm:h-8 sm:w-20" />
            </div>
            <div className="flex flex-row-reverse items-center justify-between gap-4 sm:gap-6">
              <SkeletonBlock className="h-4 w-24 max-sm:w-16 sm:h-5 sm:w-36" />
              <SkeletonBlock className="size-12 max-sm:size-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const CalendarSkeleton = () => (
  <div className="flex w-full min-w-0 flex-col md:h-[calc(100dvh-5.75rem)] md:overflow-hidden" aria-busy="true">
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-1 sm:px-2 lg:px-3">
      <div className={CALENDAR_LEG_HEADER}>
        <SkeletonBlock className="h-7 w-[8.5rem] sm:w-[9rem]" />
      </div>
      <div className={`${CALENDAR_LAYOUT} min-h-0 flex-1`}>
        {Array.from({ length: SKELETON_CALENDAR_ROUNDS }, (_, roundIndex) => (
          <div
            key={roundIndex}
            className={`flex min-w-0 shrink-0 flex-col overflow-hidden rounded-sm border border-[var(--foreground)]/10 bg-[var(--row-a)] ${CALENDAR_CARD}`}
          >
            <div className="flex flex-col items-center gap-1 bg-[var(--panel)] px-1.5 py-1">
              <SkeletonBlock className="h-3 w-10 sm:h-3.5 sm:w-12" />
              <SkeletonBlock className="h-2.5 w-16 sm:w-20" />
            </div>
            {Array.from({ length: SKELETON_CALENDAR_GAMES }, (_, index) => (
              <div
                key={index}
                className={`grid grid-cols-[2fr_1fr_2fr] items-center gap-x-1 px-1.5 py-1 sm:px-2 ${
                  index % 2 ? "bg-[var(--row-b)]" : "bg-[var(--row-a)]"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <SkeletonBlock className="h-2.5 w-full" />
                  <SkeletonBlock className="size-3 shrink-0 sm:size-4" />
                </div>
                <SkeletonBlock className="mx-auto h-2.5 w-6" />
                <div className="flex flex-row-reverse items-center justify-between gap-1">
                  <SkeletonBlock className="h-2.5 w-full" />
                  <SkeletonBlock className="size-3 shrink-0 sm:size-4" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const StandingsSkeleton = () => (
  <div className="flex w-full min-w-0 flex-col items-center" aria-busy="true">
    <div className="flex w-full max-w-[40rem] min-w-0 flex-col items-stretch">
      <div
        className={`grid ${TABLE_GRID} items-center gap-x-2 bg-[var(--panel)] px-1 py-1.5 sm:gap-x-4 sm:px-4 sm:py-2`}
      >
        <SkeletonBlock className="h-3 w-3 justify-self-center sm:h-4 sm:w-4" />
        <SkeletonBlock className="h-3 w-20 sm:h-4 sm:w-28" />
        <div className={`grid w-full ${STATS_GRID} gap-x-0.5 sm:gap-x-1`}>
          {Array.from({ length: 8 }, (_, index) => (
            <SkeletonBlock key={index} className="h-3 sm:h-4" />
          ))}
        </div>
        <SkeletonBlock className="h-3 w-8 justify-self-center sm:h-4 sm:w-12" />
      </div>
      {Array.from({ length: SKELETON_STANDINGS_COUNT }, (_, index) => (
        <div
          key={index}
          className={`grid ${TABLE_GRID} min-h-12 items-center gap-x-2 px-1 py-1.5 sm:min-h-16 sm:gap-x-4 sm:px-4 sm:py-2 ${
            index % 2 ? "bg-[var(--row-b)]" : "bg-[var(--row-a)]"
          }`}
        >
          <SkeletonBlock className="h-4 w-3 justify-self-center sm:h-5 sm:w-5" />
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
            <SkeletonBlock className="size-6 shrink-0 sm:size-10" />
            <SkeletonBlock className="h-4 w-24 sm:h-5 sm:w-40" />
          </div>
          <div className={`grid w-full ${STATS_GRID} gap-x-0.5 sm:gap-x-1`}>
            {Array.from({ length: 8 }, (_, statIndex) => (
              <SkeletonBlock key={statIndex} className="h-4 sm:h-5" />
            ))}
          </div>
          <div className="flex justify-center gap-0.5 py-0.5 sm:gap-1.5">
            {Array.from({ length: 5 }, (_, formIndex) => (
              <SkeletonBlock
                key={formIndex}
                className="size-1.5 rounded-full sm:size-2.5"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)
