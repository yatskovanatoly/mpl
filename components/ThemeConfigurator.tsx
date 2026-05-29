"use client"

import {
  CUSTOM_THEME_STORAGE_KEY,
  customThemeFields,
  normalizeColorToHex,
} from "@/lib/custom-theme"
import type { ThemeColors, ThemeVariable } from "@/lib/custom-theme"
import { ChangeEvent, useEffect, useMemo, useState } from "react"

const emptyTheme = customThemeFields.reduce((theme, field) => {
  theme[field.variable] = "#000000"
  return theme
}, {} as ThemeColors)

const stringifyTheme = (theme: ThemeColors) => JSON.stringify(theme, null, 2)

const readCurrentTheme = () => {
  const styles = getComputedStyle(document.documentElement)

  return customThemeFields.reduce((theme, field) => {
    const raw =
      styles.getPropertyValue(field.variable).trim() ||
      emptyTheme[field.variable]
    theme[field.variable] =
      normalizeColorToHex(raw) ?? emptyTheme[field.variable]
    return theme
  }, {} as ThemeColors)
}

const applyTheme = (theme: ThemeColors) => {
  for (const field of customThemeFields) {
    document.documentElement.style.setProperty(
      field.variable,
      theme[field.variable],
    )
  }
}

const clearTheme = () => {
  for (const field of customThemeFields) {
    document.documentElement.style.removeProperty(field.variable)
  }
}

const parseStoredTheme = (value: string | null, fallback: ThemeColors) => {
  if (!value) return null

  const result = parseThemeJson(value, fallback)
  return result.theme
}

const parseThemeJson = (value: string, fallback: ThemeColors) => {
  if (!value.trim()) {
    return { theme: null, error: "JSON пустой" }
  }

  try {
    const parsed = JSON.parse(value) as unknown
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { theme: null, error: "JSON должен быть объектом" }
    }

    const storedTheme = parsed as Partial<Record<ThemeVariable, unknown>>
    const theme = { ...fallback }
    let hasStoredColor = false

    for (const field of customThemeFields) {
      const color = storedTheme[field.variable]
      if (color === undefined) continue
      if (typeof color !== "string") {
        return {
          theme: null,
          error: `${field.label}: нужен цвет #rrggbb`,
        }
      }
      const normalized = normalizeColorToHex(color)
      if (!normalized) {
        return {
          theme: null,
          error: `${field.label}: нужен цвет #rrggbb`,
        }
      }
      theme[field.variable] = normalized
      hasStoredColor = true
    }

    return hasStoredColor
      ? { theme, error: "" }
      : { theme: null, error: "Нет цветов темы" }
  } catch {
    return { theme: null, error: "Некорректный JSON" }
  }
}

const readStoredTheme = (fallback: ThemeColors) => {
  try {
    return parseStoredTheme(
      localStorage.getItem(CUSTOM_THEME_STORAGE_KEY),
      fallback,
    )
  } catch {
    return null
  }
}

export default function ThemeConfigurator() {
  const [open, setOpen] = useState(false)
  const [colors, setColors] = useState<ThemeColors>(emptyTheme)
  const [jsonBaseColors, setJsonBaseColors] = useState<ThemeColors>(emptyTheme)
  const [jsonText, setJsonText] = useState(stringifyTheme(emptyTheme))
  const [savedJson, setSavedJson] = useState("")
  const [status, setStatus] = useState("")

  const parseResult = useMemo(
    () => parseThemeJson(jsonText, jsonBaseColors),
    [jsonText, jsonBaseColors],
  )
  const jsonError = parseResult.error
  const canSave =
    !!parseResult.theme &&
    stringifyTheme(parseResult.theme) !== savedJson

  useEffect(() => {
    const currentTheme = readCurrentTheme()
    const storedTheme = readStoredTheme(currentTheme)
    const initialTheme = storedTheme ?? currentTheme
    const initialJson = stringifyTheme(initialTheme)

    setColors(initialTheme)
    setJsonBaseColors(initialTheme)
    setJsonText(initialJson)
    setSavedJson(initialJson)
    if (storedTheme) applyTheme(storedTheme)
  }, [])

  const handleColorChange =
    (variable: ThemeVariable) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextColors = { ...colors, [variable]: event.target.value }

      setColors(nextColors)
      setJsonBaseColors(nextColors)
      setJsonText(stringifyTheme(nextColors))
      applyTheme(nextColors)
      setStatus("Предпросмотр темы")
    }

  const handleJsonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    setJsonText(value)

    const result = parseThemeJson(value, jsonBaseColors)
    if (!result.theme) {
      setStatus("")
      return
    }

    setColors(result.theme)
    applyTheme(result.theme)
    setStatus("Предпросмотр темы")
  }

  const saveTheme = () => {
    if (!parseResult.theme || !canSave) return

    const nextJson = stringifyTheme(parseResult.theme)

    try {
      localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, nextJson)
      setColors(parseResult.theme)
      setJsonBaseColors(parseResult.theme)
      setJsonText(nextJson)
      setSavedJson(nextJson)
      applyTheme(parseResult.theme)
      setStatus("Тема сохранена")
    } catch {
      setStatus("Не удалось сохранить тему")
    }
  }

  const resetTheme = () => {
    try {
      localStorage.removeItem(CUSTOM_THEME_STORAGE_KEY)
    } catch {
      setStatus("Не удалось очистить хранилище")
      return
    }

    clearTheme()

    const currentTheme = readCurrentTheme()
    const nextJson = stringifyTheme(currentTheme)
    setColors(currentTheme)
    setJsonBaseColors(currentTheme)
    setJsonText(nextJson)
    setSavedJson(nextJson)
    setStatus("Тема сброшена")
  }

  const copyJson = async () => {
    await navigator.clipboard.writeText(jsonText)
    setStatus("JSON скопирован")
  }

  const toggleOpen = () => {
    if (!open) {
      const currentTheme = readCurrentTheme()
      setColors(currentTheme)
      setJsonBaseColors(currentTheme)
      setJsonText(stringifyTheme(currentTheme))
    }
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
                {customThemeFields.map((field) => (
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
                    value={jsonText}
                    onChange={handleJsonChange}
                    aria-invalid={!!jsonError}
                    className={`h-24 w-full resize-none rounded border bg-[var(--background)] p-2 pr-10 font-mono text-[10px] leading-tight text-[var(--foreground)] sm:text-xs ${
                      jsonError
                        ? "border-red-500 dark:border-red-400"
                        : "border-black/10 dark:border-white/10"
                    }`}
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
                  disabled={!canSave}
                  className="rounded bg-[var(--button-bg)] px-3 py-1.5 text-xs min-[360px]:text-sm disabled:cursor-not-allowed disabled:opacity-40"
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

              <p
                className={`mt-1.5 min-h-4 text-xs ${
                  jsonError
                    ? "text-red-600 dark:text-red-400"
                    : "opacity-70"
                }`}
              >
                {jsonError || status}
              </p>
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
