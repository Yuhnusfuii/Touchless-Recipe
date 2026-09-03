export const AUTH_SESSION_DURATION = 60 * 60 * 1000
const AUTH_SESSION_EXPIRES_AT_KEY = "touchless-auth-session-expires-at"

export function saveAuthSession() {
  localStorage.setItem(AUTH_SESSION_EXPIRES_AT_KEY, String(Date.now() + AUTH_SESSION_DURATION))
}

export function clearAuthSession() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem(AUTH_SESSION_EXPIRES_AT_KEY)
}

export function getAuthSessionExpiresAt() {
  const value = Number(localStorage.getItem(AUTH_SESSION_EXPIRES_AT_KEY))
  return Number.isFinite(value) && value > 0 ? value : null
}

export function hasValidAuthSession() {
  const hasCredentials = Boolean(localStorage.getItem("token") && localStorage.getItem("user"))
  if (!hasCredentials) return false

  let expiresAt = getAuthSessionExpiresAt()
  if (!expiresAt) {
    saveAuthSession()
    expiresAt = getAuthSessionExpiresAt()
  }

  if (!expiresAt || expiresAt <= Date.now()) {
    clearAuthSession()
    return false
  }

  return true
}