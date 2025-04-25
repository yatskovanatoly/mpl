"use client"

import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      className="scale-150"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <div className="scale-100 rotate-0 transition-all dark:hidden dark:scale-0 dark:-rotate-90">
        🌞
      </div>
      <div className="hidden scale-0 rotate-290 transition-all dark:block dark:scale-100 dark:rotate-0">
        🌙
      </div>
    </button>
  )
}
