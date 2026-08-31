import type { ApiResponse } from "./api"
import type { FeedPost } from "@/components/feed/feed-types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

function authHeaders() {
  const token = localStorage.getItem("token")
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { ...authHeaders(), ...(options?.headers || {}) } })
  const result = await response.json().catch(() => ({})) as ApiResponse<T>
  if (!response.ok || !result.success || result.data === undefined) throw new Error(result.message || "Unable to load feed")
  return result.data
}

export type CreateFeedPost = { body: string; image?: string; title?: string; tags?: string[] }

export const feedApi = {
  getPosts: (search?: string) => request<FeedPost[]>(search ? `/feed?search=${encodeURIComponent(search)}` : "/feed"),
  createPost: (post: CreateFeedPost) => request<FeedPost>("/feed", { method: "POST", body: JSON.stringify(post) }),
}