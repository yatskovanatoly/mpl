import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null
    const initial =
      stored ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    setTheme(initial)

    if (initial === "light") {
      document.body.classList.add("light")
    } else {
      document.body.classList.remove("light")
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)

    if (next === "light") {
      document.body.classList.add("light")
    } else {
      document.body.classList.remove("light")
    }

    localStorage.setItem("theme", next)
  }

  return { theme, toggleTheme }
}
