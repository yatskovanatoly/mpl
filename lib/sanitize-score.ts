// Unplayed games come back with a placeholder score ("— : —") instead of an
// empty cell, so a cell made only of dashes means "no score yet".
const SCORE_PLACEHOLDER = /^[\s\-–—:?]*$/

export function sanitizeScore(score: string): string {
  const sanitized = score.replace(/\s+/g, " ").trim()

  return SCORE_PLACEHOLDER.test(sanitized) ? "" : sanitized
}
