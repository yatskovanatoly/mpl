const CLUB_ABBREVIATION =
  /\bAFC\b\.?|\bFC\b\.?|(?:^|\s)ФК\.?(?=\s|$)|(?:^|\s)ЛФК\.?(?=\s|$)/gi

export function sanitizeTeamName(name: string): string {
  return name.replace(CLUB_ABBREVIATION, " ").replace(/\s+/g, " ").trim()
}
