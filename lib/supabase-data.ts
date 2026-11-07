import {
  CalendarData,
  Game,
  RoundData,
  Rounds,
  Standing,
  StandingsData,
} from "./types"

type MatchRow = {
  game_id: number
  season: string | null
  round: number
  match_date: string | null
  time: string | null
  home_id: string
  home_name: string
  home_logo: string | null
  away_id: string
  away_name: string
  away_logo: string | null
  home_goals: number | null
  away_goals: number | null
  note: string | null
}

type TeamStatRow = {
  season: string
  team_id: string
  team_name: string
  logo: string | null
  played: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
  goal_diff: number
  points: number
}

const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "")
const supabaseKey = process.env.SUPABASE_ANON_KEY?.replace(/\s/g, "")

const getRows = async <T>(table: string, query: string): Promise<T[]> => {
  if (!supabaseUrl || !supabaseKey)
    throw new Error("Supabase environment is not configured")
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    next: { revalidate: 60 },
  })
  if (!response.ok)
    throw new Error(`Supabase ${table} request failed: ${response.status}`)
  return response.json()
}

const mapGame = (row: MatchRow): Game => ({
  home: {
    id: row.home_id,
    team: row.home_name,
    logo: row.home_logo ?? undefined,
  },
  away: {
    id: row.away_id,
    team: row.away_name,
    logo: row.away_logo ?? undefined,
  },
  score:
    row.home_goals === null || row.away_goals === null
      ? ""
      : `${row.home_goals}:${row.away_goals}`,
  time: row.time ?? undefined,
})

const seasonFilter = (season?: string) =>
  season ? `&season=eq.${encodeURIComponent(season)}` : ""

export const getSeasons = async (): Promise<string[]> => {
  const rows = await getRows<Pick<MatchRow, "season">>(
    "match_results",
    "select=season&order=season.desc",
  )
  const seasons = [
    ...new Set(
      rows
        .map(({ season }) => season)
        .filter((season): season is string => Boolean(season)),
    ),
  ]
  return seasons.sort((left, right) => {
    const leftStart = left.match(/^(\d{2})-(\d{4})/)
    const rightStart = right.match(/^(\d{2})-(\d{4})/)
    const leftValue = leftStart
      ? Number(leftStart[2]) * 100 + Number(leftStart[1])
      : 0
    const rightValue = rightStart
      ? Number(rightStart[2]) * 100 + Number(rightStart[1])
      : 0
    return rightValue - leftValue || right.localeCompare(left)
  })
}

export const getMatchRows = async (season?: string) =>
  getRows<MatchRow>(
    "match_results",
    `select=*&order=round.asc,time.asc${seasonFilter(season)}`,
  )

export const getData = async (
  round?: number,
  season?: string,
): Promise<RoundData> => {
  const rows = await getMatchRows(season)
  const openRound = rows.find(
    (row) => row.home_goals === null || row.away_goals === null,
  )?.round
  const defaultRound = openRound ?? Math.max(...rows.map((row) => row.round))
  const rowSet = rows.filter((row) => row.round === (round ?? defaultRound))
  return { date: rowSet[0]?.time ?? "", games: rowSet.map(mapGame) }
}

export const getRounds = async (season?: string): Promise<Rounds> => {
  const rows = await getMatchRows(season)
  const rounds = [...new Set(rows.map((row) => String(row.round)))].sort(
    (a, b) => Number(a) - Number(b),
  )
  return {
    rounds,
    currentRound:
      rounds.find((round) =>
        rows.some(
          (row) =>
            String(row.round) === round &&
            (row.home_goals === null || row.away_goals === null),
        ),
      ) ?? rounds.at(-1),
  }
}

export const getStandings = async (season?: string): Promise<StandingsData> => {
  const [rows, matches] = await Promise.all([
    getRows<TeamStatRow>(
      "team_stats",
      `select=*&order=points.desc,goal_diff.desc,goals_for.desc${seasonFilter(season)}`,
    ),
    getMatchRows(season),
  ])
  const formByTeam = new Map<
    string,
    { round: number; time: string; form: Standing["form"][number] }[]
  >()

  const addForm = (
    teamId: string,
    round: number,
    time: string,
    result: Standing["form"][number]["result"],
    title: string,
  ) => {
    const teamForm = formByTeam.get(teamId) ?? []
    teamForm.push({ round, time, form: { result, title } })
    formByTeam.set(teamId, teamForm)
  }

  for (const match of matches) {
    if (match.home_goals === null || match.away_goals === null) continue
    const score = `${match.home_goals}:${match.away_goals}`
    const homeResult =
      match.home_goals > match.away_goals
        ? "win"
        : match.home_goals < match.away_goals
          ? "loss"
          : "draw"
    const awayResult =
      homeResult === "win" ? "loss" : homeResult === "loss" ? "win" : "draw"
    addForm(
      match.home_id,
      match.round,
      match.match_date ?? match.time ?? "",
      homeResult,
      `Тур ${match.round}: ${score} vs ${match.away_name}`,
    )
    addForm(
      match.away_id,
      match.round,
      match.match_date ?? match.time ?? "",
      awayResult,
      `Тур ${match.round}: ${match.away_goals}:${match.home_goals} vs ${match.home_name}`,
    )
  }

  for (const teamForm of formByTeam.values()) {
    teamForm.sort(
      (left, right) =>
        left.round - right.round || left.time.localeCompare(right.time),
    )
  }

  return {
    standings: rows.map(
      (row, index): Standing => ({
        position: String(index + 1),
        team: {
          id: row.team_id,
          team: row.team_name,
          logo: row.logo ?? undefined,
        },
        points: String(row.points),
        games: String(row.played),
        wins: String(row.wins),
        draws: String(row.draws),
        losses: String(row.losses),
        goalsFor: String(row.goals_for),
        goalsAgainst: String(row.goals_against),
        goalDiff: String(row.goal_diff),
        form: (formByTeam.get(row.team_id) ?? [])
          .slice(-5)
          .map(({ form }) => form),
      }),
    ),
  }
}

export const getCalendarData = async (
  season?: string,
): Promise<CalendarData> => {
  const rows = await getMatchRows(season)
  const rounds = new Map<string, MatchRow[]>()
  for (const row of rows) {
    const key = String(row.round)
    rounds.set(key, [...(rounds.get(key) ?? []), row])
  }
  return {
    rounds: [...rounds].map(([round, games]) => ({
      round,
      date: games[0]?.time ?? "",
      games: games.map(mapGame),
    })),
  }
}
