"use client"

import { useSyncExternalStore } from "react"
import LandingPage from "@/components/landing-page/landing-page"
import Dashboard from "@/components/dashboard"

function subscribeAuth(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

function getAuthSnapshot() {
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")
  return Boolean(token && user)
}

function getAuthServerSnapshot() {
  return false
}

export default function Home() {
  const isLoggedIn = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot
  )

  if (isLoggedIn) {
    return <Dashboard />
  }

  return <LandingPage />
}
