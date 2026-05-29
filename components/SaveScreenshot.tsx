"use client"

import RoundContext from "@/lib/round-context"
import { toBlob } from "html-to-image"
import {
  FC,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

const COPY_ATTEMPTS = 3
const RETRY_DELAY_MS = 300

const SaveScreenshot: FC<{
  targetRef: RefObject<HTMLDivElement | null>
  filename: string
}> = ({ targetRef, filename }) => {
  const { loading } = useContext(RoundContext)
  const [downloading, setDownloading] = useState(false)
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "error">(
    "idle",
  )
  const [showCopiedHint, setShowCopiedHint] = useState(false)
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const disabled = loading || downloading || copyStatus === "copying"

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current)
    }
  }, [])

  const capture = useCallback(async () => {
    if (!targetRef.current) return null
    return toBlob(targetRef.current, {
      cacheBust: true,
      includeQueryParams: true,
      pixelRatio: 3,
    })
  }, [targetRef])

  const download = useCallback(async () => {
    setDownloading(true)
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
      setDownloading(false)
    }
  }, [capture, filename])

  const showCopied = useCallback(() => {
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current)
    setShowCopiedHint(true)
    hintTimeoutRef.current = setTimeout(() => {
      setShowCopiedHint(false)
      hintTimeoutRef.current = null
    }, 1800)
  }, [])

  const copyToClipboard = useCallback(async () => {
    let lastError: unknown

    for (let attempt = 0; attempt < COPY_ATTEMPTS; attempt += 1) {
      try {
        const blob = await capture()
        if (!blob) throw new Error("Could not capture image")

        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ])
        return
      } catch (error) {
        lastError = error
        if (attempt < COPY_ATTEMPTS - 1) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
        }
      }
    }

    throw lastError
  }, [capture])

  const copy = useCallback(async () => {
    setCopyStatus("copying")
    setShowCopiedHint(false)
    try {
      await copyToClipboard()
      setCopyStatus("idle")
      showCopied()
    } catch {
      setCopyStatus("error")
    }
  }, [copyToClipboard, showCopied])

  const copyLabel =
    copyStatus === "copying"
      ? "Копирую..."
      : copyStatus === "error"
        ? "Ошибка, повторить"
        : "Копировать"

  return (
    <div className="relative flex gap-2 pt-2">
      {showCopiedHint && (
        <div className="absolute -top-8 right-0 rounded bg-neutral-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-900">
          Изображение скопировано
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={download}
        className="rounded bg-neutral-200 px-3 py-1 text-sm disabled:opacity-40 dark:bg-stone-700"
      >
        {downloading ? "Сохраняю..." : "Скачать PNG"}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={copy}
        className="rounded bg-neutral-200 px-3 py-1 text-sm disabled:opacity-40 dark:bg-stone-700"
      >
        {copyLabel}
      </button>
    </div>
  )
}

export default SaveScreenshot
