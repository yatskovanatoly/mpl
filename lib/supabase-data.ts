import { CalendarData, Game, RoundData, Rounds, Standing, StandingsData } from "./types"

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
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase environment is not configured")
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    next: { revalidate: 60 },
  })
  if (!response.ok) throw new Error(`Supabase ${table} request failed: ${response.status}`)
  return response.json()
}

const mapGame = (row: MatchRow): Game => ({
  home: { id: row.home_id, team: row.home_name, logo: row.home_logo ?? undefined },
  away: { id: row.away_id, team: row.away_name, logo: row.away_logo ?? undefined },
  score: row.home_goals === null || row.away_goals === null ? "" : `${row.home_goals}:${row.away_goals}`,
  time: row.time ?? undefined,
})

const seasonFilter = (season?: string) => season ? `&season=eq.${encodeURIComponent(season)}` : ""

export const getMatchRows = async (season?: string) => getRows<MatchRow>(
  "match_results",
  `select=*&order=round.asc,time.asc${seasonFilter(season)}`,
)

export const getData = async (round?: number): Promise<RoundData> => {
  const rows = await getMatchRows()
  const openRound = rows.find((row) => row.home_goals === null || row.away_goals === null)?.round
  const defaultRound = openRound ?? Math.max(...rows.map((row) => row.round))
  const rowSet = rows.filter((row) => row.round === (round ?? defaultRound))
  return { date: rowSet[0]?.time ?? "", games: rowSet.map(mapGame) }
}

export const getRounds = async (_round?: number): Promise<Rounds> => {
  const rows = await getMatchRows()
  const rounds = [...new Set(rows.map((row) => String(row.round)))].sort((a, b) => Number(a) - Number(b))
  return { rounds, currentRound: rounds.find((round) => rows.some((row) => String(row.round) === round && (row.home_goals === null || row.away_goals === null))) ?? rounds.at(-1) }
}

export const getStandings = async (): Promise<StandingsData> => {
  const rows = await getRows<TeamStatRow>("team_stats", "select=*&order=points.desc,goal_diff.desc,goals_for.desc")
  return { standings: rows.map((row, index): Standing => ({
    position: String(index + 1),
    team: { id: row.team_id, team: row.team_name, logo: row.logo ?? undefined },
    points: String(row.points), games: String(row.played), wins: String(row.wins),
    draws: String(row.draws), losses: String(row.losses), goalsFor: String(row.goals_for),
    goalsAgainst: String(row.goals_against), goalDiff: String(row.goal_diff), form: [],
  })) }
}

export const getCalendarData = async (): Promise<CalendarData> => {
  const rows = await getMatchRows()
  const rounds = new Map<string, MatchRow[]>()
  for (const row of rows) {
    const key = String(row.round)
    rounds.set(key, [...(rounds.get(key) ?? []), row])
  }
  return { rounds: [...rounds].map(([round, games]) => ({
    round,
    date: games[0]?.time ?? "",
    games: games.map(mapGame),
  })) }
}
