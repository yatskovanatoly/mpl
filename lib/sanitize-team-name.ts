const CLUB_ABBREVIATION =
  /\bAFC\b\.?|\bFC\b\.?|(?:^|\s)ФК\.?(?=\s|$)|(?:^|\s)ЛФК\.?(?=\s|$)/gi

// Admin-only edit links rendered next to team names on mychamp.ru.
const EDIT_LINK_LABEL = /(?:^|\s)(?:изменить|редактировать)(?=\s|$)/gi

export function sanitizeTeamName(name: string): string {
  return name
    .replace(EDIT_LINK_LABEL, " ")
    .replace(CLUB_ABBREVIATION, " ")
    .replace(/\s+/g, " ")
    .trim()
}
