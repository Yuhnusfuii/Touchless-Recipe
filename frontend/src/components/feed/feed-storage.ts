import type { RecipeItem } from "@/lib/api"
import type { UserData } from "@/lib/api"

import type { FeedPost } from "./feed-types"

export const FEED_POSTS_KEY = "touchless-feed-posts"
export const FEED_POSTS_CHANGE_EVENT = "touchless-feed-posts-change"
export const FEED_FAVORITES_KEY = "touchless-feed-favorite-posts"
export const FEED_FAVORITES_CHANGE_EVENT = "touchless-feed-favorite-posts-change"
export const FEED_NOTIFICATIONS_KEY = "touchless-feed-notifications"
export const FEED_NOTIFICATIONS_CHANGE_EVENT = "touchless-feed-notifications-change"

export type FeedNotificationType = "like" | "share" | "save"

export type FeedNotification = {
  id: string
  type: FeedNotificationType
  postId: string
  postTitle: string
  createdAt: number
  read: boolean
}

export function getStoredUser(): UserData | null {
  try {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) as UserData : null
  } catch {
    return null
  }
}

export function createRecipePost(recipe: RecipeItem, isVietnamese: boolean): FeedPost {
  const user = getStoredUser()
  return {
    id: `recipe-${recipe.id}-${Date.now()}`,
    author: user?.name || "You",
    initials: getInitials(user?.name || "You"),
    avatar: user?.image,
    role: isVietnamese ? "Đầu bếp tại gia" : "Home cook",
    time: isVietnamese ? "Vừa chia sẻ" : "Just shared",
    title: recipe.title,
    body: recipe.description || (isVietnamese ? "Một công thức đáng thử từ căn bếp của tôi." : "A recipe worth trying from my kitchen."),
    image: recipe.imageUrl,
    tags: [recipe.category, recipe.area].filter(Boolean),
    likes: 0,
    comments: [],
  }
}

export function saveFeedPost(post: FeedPost) {
  const stored = localStorage.getItem(FEED_POSTS_KEY)
  const posts = stored ? JSON.parse(stored) as FeedPost[] : []
  localStorage.setItem(FEED_POSTS_KEY, JSON.stringify([post, ...posts]))
  window.dispatchEvent(new Event(FEED_POSTS_CHANGE_EVENT))
}

export function getSharedFeedPosts(): FeedPost[] {
  try {
    const stored = localStorage.getItem(FEED_POSTS_KEY)
    return stored ? JSON.parse(stored) as FeedPost[] : []
  } catch {
    return []
  }
}

export function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
}

export function getFavoriteFeedPosts(): FeedPost[] {
  try {
    const stored = localStorage.getItem(FEED_FAVORITES_KEY)
    return stored ? JSON.parse(stored) as FeedPost[] : []
  } catch {
    return []
  }
}

export function isFavoriteFeedPost(id: string) {
  return getFavoriteFeedPosts().some((post) => post.id === id)
}

export function toggleFavoriteFeedPost(post: FeedPost) {
  const favorites = getFavoriteFeedPosts()
  const exists = favorites.some((item) => item.id === post.id)
  const next = exists ? favorites.filter((item) => item.id !== post.id) : [post, ...favorites]
  localStorage.setItem(FEED_FAVORITES_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(FEED_FAVORITES_CHANGE_EVENT))
  return !exists
}

export function getFeedNotifications(): FeedNotification[] {
  try {
    const stored = localStorage.getItem(FEED_NOTIFICATIONS_KEY)
    return stored ? JSON.parse(stored) as FeedNotification[] : []
  } catch {
    return []
  }
}

export function addFeedNotification(post: FeedPost, type: FeedNotificationType) {
  const notifications = getFeedNotifications()
  const notification: FeedNotification = {
    id: `notification-${type}-${post.id}-${Date.now()}`,
    type,
    postId: post.id,
    postTitle: post.title,
    createdAt: Date.now(),
    read: false,
  }
  localStorage.setItem(FEED_NOTIFICATIONS_KEY, JSON.stringify([notification, ...notifications].slice(0, 50)))
  window.dispatchEvent(new Event(FEED_NOTIFICATIONS_CHANGE_EVENT))
}

export function markFeedNotificationsRead() {
  const notifications = getFeedNotifications()
  localStorage.setItem(FEED_NOTIFICATIONS_KEY, JSON.stringify(notifications.map((notification) => ({ ...notification, read: true }))))
  window.dispatchEvent(new Event(FEED_NOTIFICATIONS_CHANGE_EVENT))
}