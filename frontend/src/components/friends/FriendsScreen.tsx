"use client"

import { ArrowLeft, Search, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useLanguage } from "@/components/language-provider"
import { FRIENDS_CHANGE_EVENT } from "./friends-storage"
import { friendsApi } from "@/lib/friends-api"
import type { FriendSnapshot } from "./friends-types"
import { FriendCard } from "./FriendCard"
import { FriendsNavigation } from "./FriendsNavigation"

type FriendsScreenProps = { active: "friends" | "requests" | "suggestions" }

export default function FriendsScreen({ active }: FriendsScreenProps) {
  const { isVietnamese } = useLanguage()
  const [snapshot, setSnapshot] = useState<FriendSnapshot>({ friends: [], requests: [], suggestions: [] })
  const [query, setQuery] = useState("")

  useEffect(() => {
    const sync = () => { void friendsApi.getSnapshot().then(setSnapshot).catch(() => undefined) }
    sync()
    window.addEventListener(FRIENDS_CHANGE_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(FRIENDS_CHANGE_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  const people = snapshot[active]
  const filteredPeople = people.filter((friend) => friend.name.toLowerCase().includes(query.trim().toLowerCase()))
  const title = active === "friends" ? (isVietnamese ? "Bạn bè của tôi" : "My friends") : active === "requests" ? (isVietnamese ? "Lời mời kết bạn" : "Friend requests") : (isVietnamese ? "Gợi ý cho bạn" : "People you may know")
  const description = active === "friends" ? (isVietnamese ? "Những người bạn đã kết nối trong cộng đồng nấu ăn." : "People you are connected with in the cooking community.") : active === "requests" ? (isVietnamese ? "Xem và xử lý những lời mời đang chờ." : "Review and manage your pending requests.") : (isVietnamese ? "Tìm thêm những người có cùng cảm hứng vào bếp." : "Discover more people who share your kitchen passion.")

  async function handleAction(id: string) {
    if (active === "requests") await friendsApi.updateRequest(id, "accepted")
    if (active === "suggestions") await friendsApi.sendRequest(id)
    setSnapshot(await friendsApi.getSnapshot())
  }

  async function handleDecline(id: string) {
    await friendsApi.updateRequest(id, "declined")
    setSnapshot(await friendsApi.getSnapshot())
  }

  return <main className="min-h-screen bg-[#fbfaf7] text-[#17352d]"><header className="sticky top-0 z-30 border-b border-[#dbe5dd] bg-[#fbfaf7]/95 backdrop-blur-md"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 lg:px-12"><Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-[-0.04em]"><span className="flex size-8 items-center justify-center rounded-full bg-[#17352d] text-[#f3d7a3]"><Users className="size-4" /></span>mise<span className="text-[#d97742]">.</span></Link><Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#527066] hover:text-[#d97742]"><ArrowLeft className="size-4" />{isVietnamese ? "Trang chủ" : "Home"}</Link></div></header><div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12 lg:px-12"><div className="mb-6"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d97742]"><Users className="size-4" />{isVietnamese ? "Kết nối cộng đồng" : "Your community"}</p><h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#527066]">{description}</p></div><FriendsNavigation active={active} isVietnamese={isVietnamese} snapshot={snapshot} /><div className="relative mt-6 max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#789087]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isVietnamese ? "Tìm trong danh sách..." : "Search this list..."} aria-label={isVietnamese ? "Tìm trong danh sách" : "Search this list"} className="h-10 w-full rounded-full border border-[#c5d2cc] bg-white pl-9 pr-4 text-sm outline-none focus:border-[#d97742]" /></div><section className="mt-6"><div className="grid gap-3 sm:grid-cols-2">{filteredPeople.map((friend) => <FriendCard key={friend.id} friend={friend} isVietnamese={isVietnamese} action={active === "friends" ? "decline" : active === "requests" ? "accept" : "add"} onAction={handleAction} onDecline={handleDecline} />)}</div>{filteredPeople.length === 0 && <div className="rounded-2xl border border-dashed border-[#c5d2cc] p-12 text-center text-sm text-[#789087]">{query ? (isVietnamese ? "Không tìm thấy người phù hợp." : "No matching people found.") : active === "friends" ? (isVietnamese ? "Bạn chưa có bạn bè nào." : "You do not have any friends yet.") : active === "requests" ? (isVietnamese ? "Bạn đã xem hết lời mời." : "You are all caught up.") : (isVietnamese ? "Không còn gợi ý mới." : "No new suggestions right now.")}</div>}</section></div></main>
}
