import type { ApiResponse } from "./api"
import type { FriendSnapshot } from "@/components/friends/friends-types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

function authHeaders() {
  const token = localStorage.getItem("token")
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { ...authHeaders(), ...(options?.headers || {}) } })
  const result = await response.json().catch(() => ({})) as ApiResponse<T>
  if (!response.ok || !result.success || result.data === undefined) throw new Error(result.message || "Unable to load friends")
  return result.data
}

export const friendsApi = {
  getSnapshot: () => request<FriendSnapshot>("/friends"),
  sendRequest: (recipientId: string) => request("/friends/requests", { method: "POST", body: JSON.stringify({ recipientId }) }),
  updateRequest: (requestId: string, status: "accepted" | "declined") => request(`/friends/requests/${encodeURIComponent(requestId)}`, { method: "PATCH", body: JSON.stringify({ status }) }),
}
