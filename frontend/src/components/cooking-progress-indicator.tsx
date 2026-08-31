"use client"

import { ChefHat, Clock3 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type CookingProgress = {
  recipeTitle: string
  stepIndex: number
  totalSteps: number
  timerSeconds: number
  isTimerRunning: boolean
  timerEndAt?: number | null
}

const PROGRESS_KEY = "active_cooking_progress"

function readProgress(): CookingProgress | null {
  const stored = localStorage.getItem(PROGRESS_KEY)
  if (!stored) return null
  try {
    const progress = JSON.parse(stored) as CookingProgress
    if (progress.isTimerRunning && progress.timerEndAt) {
      progress.timerSeconds = Math.max(0, Math.ceil((progress.timerEndAt - Date.now()) / 1000))
      if (progress.timerSeconds === 0) progress.isTimerRunning = false
    }
    return progress
  } catch {
    return null
  }
}

export function CookingProgressIndicator() {
  const pathname = usePathname()
  const router = useRouter()
  const [progress, setProgress] = useState<CookingProgress | null>(null)

  useEffect(() => {
    const refresh = () => setProgress(readProgress())
    refresh()
    window.addEventListener("storage", refresh)
    window.addEventListener("cooking-progress-change", refresh)
    const interval = window.setInterval(refresh, 1000)
    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener("cooking-progress-change", refresh)
      window.clearInterval(interval)
    }
  }, [])

  if (!progress || pathname === "/playground") return null

  const minutes = Math.floor(progress.timerSeconds / 60)
  const seconds = progress.timerSeconds % 60
  const time = `${minutes}:${seconds.toString().padStart(2, "0")}`

  return (
    <button
      type="button"
      onClick={() => router.push("/playground")}
      title={`${progress.recipeTitle} - ${progress.isTimerRunning ? time : "paused"}`}
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full border-2 border-[#f3d7a3] bg-[#17352d] text-[#f3d7a3] shadow-xl transition hover:scale-105 hover:bg-[#254b40] focus:outline-none focus:ring-2 focus:ring-[#d97742] focus:ring-offset-2"
      aria-label={`Continue cooking ${progress.recipeTitle}`}
    >
      <ChefHat className="size-6" />
      <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#d97742] text-[10px] font-bold text-white">
        {progress.stepIndex + 1}
      </span>
      <span className="absolute -bottom-2 right-0 flex items-center gap-0.5 rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#17352d] shadow">
        <Clock3 className="size-2.5" />{time}
      </span>
    </button>
  )
}