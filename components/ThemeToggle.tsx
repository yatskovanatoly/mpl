"use client"
import { useTheme } from "@/hooks/useTheme"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button className="scale-150" onClick={toggleTheme}>
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  )
}
