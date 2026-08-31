"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useSyncExternalStore } from "react"
import { clearAuthSession, getAuthSessionExpiresAt, hasValidAuthSession } from "@/lib/auth-session"

const PUBLIC_PATHS = new Set(["/", "/login", "/register"])

function subscribeAuth(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener("touchless-auth-change", callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener("touchless-auth-change", callback)
  }
}

function getAuthSnapshot() {
  return hasValidAuthSession()
}

function getAuthServerSnapshot() {
  return false
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthenticated = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot)
  const isPublicPath = PUBLIC_PATHS.has(pathname)

  useEffect(() => {
    if (!isAuthenticated) return
    const expiresAt = getAuthSessionExpiresAt()
    if (!expiresAt) return

    const timer = window.setTimeout(() => {
      clearAuthSession()
      window.dispatchEvent(new Event("touchless-auth-change"))
    }, Math.max(0, expiresAt - Date.now()))

    return () => window.clearTimeout(timer)
  }, [isAuthenticated])

  useEffect(() => {
    if (!isPublicPath && !isAuthenticated) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
  }, [isAuthenticated, isPublicPath, pathname, router])

  if (isPublicPath || isAuthenticated) return children
  return null
}
