"use client"

import RoundContext from "@/lib/round-context"
import { toBlob } from "html-to-image"
import { FC, RefObject, useCallback, useContext, useState } from "react"

const SaveScreenshot: FC<{
  targetRef: RefObject<HTMLDivElement | null>
  filename: string
}> = ({ targetRef, filename }) => {
  const { loading } = useContext(RoundContext)
  const [busy, setBusy] = useState(false)
  const disabled = loading || busy

  const capture = useCallback(async () => {
    if (!targetRef.current) return null
    return toBlob(targetRef.current, {
      cacheBust: true,
      includeQueryParams: true,
      pixelRatio: 2,
    })
  }, [targetRef])

  const download = useCallback(async () => {
    setBusy(true)
    try {
      const blob = await capture()
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setBusy(false)
    }
  }, [capture, filename])

  const copy = useCallback(async () => {
    setBusy(true)
    try {
      const blob = await capture()
      if (!blob) return
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ])
    } catch {
      await download()
    } finally {
      setBusy(false)
    }
  }, [capture, download])

  return (
    <div className="flex gap-2 pt-2">
      <button
        type="button"
        disabled={disabled}
        onClick={download}
        className="rounded bg-neutral-200 px-3 py-1 text-sm disabled:opacity-40 dark:bg-stone-700"
      >
        Скачать PNG
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={copy}
        className="rounded bg-neutral-200 px-3 py-1 text-sm disabled:opacity-40 dark:bg-stone-700"
      >
        Копировать
      </button>
    </div>
  )
}

export default SaveScreenshot
