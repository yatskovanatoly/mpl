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
    setStatus("Тема сохранена")
  }

  const resetTheme = () => {
    localStorage.removeItem(STORAGE_KEY)
    clearTheme()

    const currentTheme = readCurrentTheme()
    setColors(currentTheme)
    setStatus("Тема сброшена")
  }

  const copyJson = async () => {
    await navigator.clipboard.writeText(json)
    setStatus("JSON скопирован")
  }

  const toggleOpen = () => {
    if (!open) setColors(readCurrentTheme())
    setOpen(!open)
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:items-end sm:justify-end sm:p-0 sm:pb-[calc(3.25rem+max(0.5rem,env(safe-area-inset-bottom)))] sm:pr-4">
          <button
            type="button"
            aria-label="Закрыть настройку темы"
            className="absolute inset-0 bg-black/20 sm:bg-transparent"
            onClick={() => setOpen(false)}
          />
          <section
            aria-label="Настройка темы"
            id="theme-configuration"
            className="relative z-10 w-full max-w-[22rem] rounded-xl border border-black/10 bg-[var(--panel)] text-[var(--foreground)] shadow-2xl dark:border-white/10"
          >
            <div className="border-b border-black/5 p-3 dark:border-white/10">
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

            <div className="p-3">
              <div className="grid gap-1.5">
                {themeFields.map((field) => (
                  <label
                    key={field.variable}
                    className="grid grid-cols-[minmax(0,1fr)_2rem_4.5rem] items-center gap-2 text-xs min-[360px]:text-sm"
                  >
                    <span className="truncate">{field.label}</span>
                    <input
                      type="color"
                      value={colors[field.variable]}
                      onChange={handleColorChange(field.variable)}
                      className="size-7 cursor-pointer rounded border border-black/20 bg-transparent dark:border-white/20"
                    />
                    <code className="text-xs opacity-70">
                      {colors[field.variable]}
                    </code>
                  </label>
                ))}
              </div>

              <div className="mt-2.5 text-xs font-medium opacity-80">
                <span>JSON (текст)</span>
                <div className="relative mt-1">
                  <textarea
                    readOnly
                    value={json}
                    className="h-24 w-full resize-none rounded border border-black/10 bg-[var(--background)] p-2 pr-10 font-mono text-[10px] leading-tight text-[var(--foreground)] sm:text-xs dark:border-white/10"
                  />
                  <button
                    type="button"
                    onClick={copyJson}
                    className="absolute top-2 right-2 rounded p-1 text-[var(--foreground)] opacity-70 hover:bg-black/10 hover:opacity-100 dark:hover:bg-white/10"
                    aria-label="Скопировать JSON"
                    title="Скопировать JSON"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2">
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
              </div>

              <p className="mt-1.5 h-4 text-xs opacity-70">{status}</p>
            </div>
          </section>
        </div>
      )}

      <button
        type="button"
        onClick={toggleOpen}
        className="fixed right-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-50 rounded-full bg-[var(--button-bg)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-lg sm:right-4 sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-2 sm:text-sm"
        aria-expanded={open}
        aria-controls="theme-configuration"
      >
        ⚙︎ Тема
      </button>
    </>
  )
}
