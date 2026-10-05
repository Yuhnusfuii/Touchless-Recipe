import { Bell, ChefHat, Compass, Heart, Search, UserRound } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useLanguage } from "@/components/language-provider"
import { FEED_NOTIFICATIONS_CHANGE_EVENT, getFeedNotifications, markFeedNotificationsRead, type FeedNotification } from "./feed-storage"

export function FeedHeader() {
  const { isVietnamese } = useLanguage()
  const [notifications, setNotifications] = useState<FeedNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const syncNotifications = () => setNotifications(getFeedNotifications())
    syncNotifications()
    window.addEventListener(FEED_NOTIFICATIONS_CHANGE_EVENT, syncNotifications)
    window.addEventListener("storage", syncNotifications)
    return () => {
      window.removeEventListener(FEED_NOTIFICATIONS_CHANGE_EVENT, syncNotifications)
      window.removeEventListener("storage", syncNotifications)
    }
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  function notificationText(notification: FeedNotification) {
    const action = isVietnamese
      ? { like: "đã thích", share: "đã chia sẻ", save: "đã lưu" }[notification.type]
      : { like: "liked", share: "shared", save: "saved" }[notification.type]
    return isVietnamese ? `Ai đó ${action} bài viết của bạn` : `Someone ${action} your post`
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#dbe5dd] bg-[#fbfaf7]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-8 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-[-0.04em]">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#17352d] text-[#f3d7a3]"><ChefHat className="size-4" /></span>
          CookAI<span className="text-[#d97742]">.</span>
        </Link>
        <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#527066]" />
          <input aria-label={isVietnamese ? "Tìm bài viết" : "Search posts"} placeholder={isVietnamese ? "Tìm cảm hứng, công thức..." : "Search inspiration, recipes..."} className="h-10 w-full rounded-full border border-[#c5d2cc] bg-white pl-9 pr-4 text-sm outline-none focus:border-[#d97742] focus:ring-2 focus:ring-[#d97742]/15" />
        </div>
        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link href="/feed" aria-label={isVietnamese ? "Khám phá" : "Explore"} className="flex size-9 items-center justify-center rounded-full bg-[#e4ece2] text-[#17352d]"><Compass className="size-4" /></Link>
          <Link href="/favorites" aria-label={isVietnamese ? "Yêu thích" : "Favorites"} className="hidden size-9 items-center justify-center rounded-full text-[#527066] hover:bg-[#e4ece2] sm:flex"><Heart className="size-4" /></Link>
          <div className="relative">
            <button type="button" aria-label={isVietnamese ? "Thông báo" : "Notifications"} aria-expanded={isOpen} onClick={() => setIsOpen((current) => !current)} className="relative flex size-9 items-center justify-center rounded-full text-[#527066] hover:bg-[#e4ece2]"><Bell className="size-4" />{unreadCount > 0 && <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-[#d97742] text-[9px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}</button>
            {isOpen && <div className="absolute right-0 top-12 z-40 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#dbe5dd] bg-white shadow-xl"><div className="flex items-center justify-between border-b border-[#e4ece2] px-4 py-3"><h2 className="text-sm font-bold text-[#17352d]">{isVietnamese ? "Thông báo" : "Notifications"}</h2>{unreadCount > 0 && <button type="button" onClick={markFeedNotificationsRead} className="text-xs font-semibold text-[#d97742]">{isVietnamese ? "Đã đọc hết" : "Mark all read"}</button>}</div>{notifications.length === 0 ? <p className="px-4 py-8 text-center text-sm text-[#789087]">{isVietnamese ? "Chưa có thông báo" : "No notifications yet"}</p> : <div className="max-h-80 overflow-y-auto">{notifications.map((notification) => <div key={notification.id} className={`border-b border-[#f1f5ef] px-4 py-3 ${notification.read ? "bg-white" : "bg-[#fff8ef]"}`}><p className="text-sm text-[#17352d]">{notificationText(notification)}</p><p className="mt-1 truncate text-xs font-semibold text-[#527066]">{notification.postTitle}</p><time className="mt-1 block text-[11px] text-[#789087]">{new Date(notification.createdAt).toLocaleString(isVietnamese ? "vi-VN" : "en-US")}</time></div>)}</div>}</div>}
          </div>
          <Link href="/profile" aria-label={isVietnamese ? "Hồ sơ" : "Profile"} className="flex size-9 items-center justify-center rounded-full bg-[#d97742] text-xs font-bold text-white"><UserRound className="size-4" /></Link>
        </nav>
      </div>
    </header>
  )
}