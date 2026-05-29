"use client"

import { ChangeEvent, useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "mpl-custom-theme"

const themeFields = [
  { label: "Фон", variable: "--background" },
  { label: "Текст", variable: "--foreground" },
  { label: "Шапка", variable: "--panel" },
  { label: "Строка A", variable: "--row-a" },
  { label: "Строка B", variable: "--row-b" },
  { label: "Кнопка", variable: "--button-bg" },
] as const

type ThemeVariable = (typeof themeFields)[number]["variable"]
type ThemeColors = Record<ThemeVariable, string>

const hexColor = /^#[0-9a-fA-F]{6}$/

const emptyTheme = themeFields.reduce((theme, field) => {
  theme[field.variable] = "#000000"
  return theme
}, {} as ThemeColors)

const readCurrentTheme = () => {
  const styles = getComputedStyle(document.documentElement)

  return themeFields.reduce((theme, field) => {
    theme[field.variable] =
      styles.getPropertyValue(field.variable).trim() ||
      emptyTheme[field.variable]
    return theme
  }, {} as ThemeColors)
}

const applyTheme = (theme: ThemeColors) => {
  for (const field of themeFields) {
    document.documentElement.style.setProperty(
      field.variable,
      theme[field.variable],
    )
  }
}

const clearTheme = () => {
  for (const field of themeFields) {
    document.documentElement.style.removeProperty(field.variable)
  }
}

const parseStoredTheme = (value: string | null) => {
  if (!value) return null

  try {
    const parsed = JSON.parse(value) as Partial<Record<ThemeVariable, unknown>>
    const theme = { ...emptyTheme }

    for (const field of themeFields) {
      const color = parsed[field.variable]
      if (typeof color !== "string" || !hexColor.test(color)) return null
      theme[field.variable] = color
    }

    return theme
  } catch {
    return null
  }
}

export default function ThemeConfigurator() {
  const [open, setOpen] = useState(false)
  const [colors, setColors] = useState<ThemeColors>(emptyTheme)
  const [status, setStatus] = useState("")

  useEffect(() => {
    const currentTheme = readCurrentTheme()
    const storedTheme = parseStoredTheme(localStorage.getItem(STORAGE_KEY))
    const initialTheme = storedTheme ?? currentTheme

    setColors(initialTheme)
    if (storedTheme) applyTheme(storedTheme)
  }, [])

  const json = useMemo(() => JSON.stringify(colors, null, 2), [colors])

  const handleColorChange =
    (variable: ThemeVariable) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextColors = { ...colors, [variable]: event.target.value }

      setColors(nextColors)
      applyTheme(nextColors)
      setStatus("Предпросмотр темы")
    }

  const saveTheme = () => {
    localStorage.setItem(STORAGE_KEY, json)
    setStatus("Сохранено в localStorage")
  }

  const resetTheme = () => {
    localStorage.removeItem(STORAGE_KEY)
    clearTheme()

    const currentTheme = readCurrentTheme()
    setColors(currentTheme)
    setStatus("Тема сброшена")
  }

  const downloadJson = () => {
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = "mpl-theme.json"
    link.click()
    URL.revokeObjectURL(url)
    setStatus("JSON сохранён")
  }

  const toggleOpen = () => {
    if (!open) setColors(readCurrentTheme())
    setOpen(!open)
  }

  return (
    <div className="fixed right-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-2 z-50 flex max-h-[calc(100dvh-1rem)] flex-col items-end gap-2 sm:right-4 sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:left-auto">
      {open && (
        <>
          <button
            type="button"
            aria-label="Закрыть настройку темы"
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            onClick={() => setOpen(false)}
          />
          <section
            aria-label="Настройка темы"
            id="theme-configuration"
            className="relative z-50 flex max-h-[calc(100dvh-4rem)] w-full max-w-[22rem] flex-col overflow-hidden rounded-xl border border-black/10 bg-[var(--panel)] text-[var(--foreground)] shadow-2xl sm:max-h-[min(32rem,calc(100dvh-5rem))] dark:border-white/10"
          >
            <div className="shrink-0 border-b border-black/5 p-3 sm:p-4 dark:border-white/10">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold">Цвета темы</h2>
                  <p className="text-xs opacity-70">
                    Настройте цвета страницы.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 rounded px-2 py-1 text-lg leading-none hover:bg-black/10 dark:hover:bg-white/10"
                  aria-label="Закрыть настройку темы"
                >
                  x
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2.5 sm:p-4">
              <div className="grid gap-2">
                {themeFields.map((field) => (
                  <label
                    key={field.variable}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-xs min-[360px]:text-sm"
                  >
                    <span className="truncate">{field.label}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <input
                        type="color"
                        value={colors[field.variable]}
                        onChange={handleColorChange(field.variable)}
                        className="size-7 cursor-pointer rounded border border-black/20 bg-transparent min-[360px]:size-8 dark:border-white/20"
                      />
                      <code className="hidden text-xs opacity-70 sm:inline">
                        {colors[field.variable]}
                      </code>
                    </span>
                  </label>
                ))}
              </div>

              <label className="mt-3 block text-xs font-medium opacity-80">
                JSON (текст)
                <textarea
                  readOnly
                  value={json}
                  className="mt-1 h-24 w-full resize-none rounded border border-black/10 bg-[var(--background)] p-2 font-mono text-[10px] leading-tight text-[var(--foreground)] min-[360px]:h-28 sm:h-32 sm:text-xs dark:border-white/10"
                />
              </label>

              <div className="mt-3 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:flex sm:flex-wrap">
                <button
                  type="button"
                  onClick={saveTheme}
                  className="rounded bg-[var(--button-bg)] px-3 py-1.5 text-xs min-[360px]:text-sm"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={resetTheme}
                  className="rounded bg-[var(--button-bg)] px-3 py-1.5 text-xs min-[360px]:text-sm"
                >
                  Сбросить
                </button>
                <button
                  type="button"
                  onClick={downloadJson}
                  className="rounded bg-[var(--button-bg)] px-3 py-1.5 text-xs min-[360px]:col-span-2 min-[360px]:text-sm sm:col-span-1"
                >
                  Сохранить JSON
                </button>
              </div>

              {status && <p className="mt-2 text-xs opacity-70">{status}</p>}
            </div>
          </section>
        </>
      )}

      <button
        type="button"
        onClick={toggleOpen}
        className="relative z-50 rounded-full bg-[var(--button-bg)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-lg sm:px-4 sm:py-2 sm:text-sm"
        aria-expanded={open}
        aria-controls="theme-configuration"
      >
        ⚙︎ Тема
      </button>
    </div>
  )
}
