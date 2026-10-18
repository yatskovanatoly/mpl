"use client"

import { FC } from "react"

const NavButton: FC<{
  label: string
  onClick: () => void
  children: string
}> = ({ label, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="flex size-7 cursor-pointer items-center justify-center rounded text-base leading-none font-bold transition-colors hover:bg-[var(--button-bg)]"
  >
    {children}
  </button>
)

export default NavButton
