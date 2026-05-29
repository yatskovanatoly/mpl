export const CUSTOM_THEME_STORAGE_KEY = "mpl-custom-theme"

export const customThemeFields = [
  { label: "Фон", variable: "--background" },
  { label: "Текст", variable: "--foreground" },
  { label: "Шапка", variable: "--panel" },
  { label: "Строка A", variable: "--row-a" },
  { label: "Строка B", variable: "--row-b" },
  { label: "Кнопка", variable: "--button-bg" },
] as const

export const hexColorPattern = "^#[0-9a-fA-F]{6}$"
export const hexColorRegex = /^#[0-9a-fA-F]{6}$/i

export type ThemeVariable = (typeof customThemeFields)[number]["variable"]
export type ThemeColors = Record<ThemeVariable, string>

export function normalizeColorToHex(color: string): string | null {
  const trimmed = color.trim()
  if (hexColorRegex.test(trimmed)) {
    return trimmed.toLowerCase()
  }

  const short = trimmed.match(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/i)
  if (short) {
    return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase()
  }

  const rgb = trimmed.match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i,
  )
  if (rgb) {
    const channels = [rgb[1], rgb[2], rgb[3]].map((value) => {
      const channel = Number(value)
      if (channel > 255) return null
      return channel.toString(16).padStart(2, "0")
    })
    if (channels.some((value) => value === null)) return null
    return `#${channels.join("")}`
  }

  return null
}
