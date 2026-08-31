"use client"

import { ArrowLeft, Search, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { acceptFriendRequest, FRIENDS_CHANGE_EVENT, getFriendSnapshot, sendFriendRequest } from "./friends-storage"
import type { FriendSnapshot } from "./friends-types"
import { FriendCard } from "./FriendCard"

export default function FriendsPage() {
  const { isVietnamese } = useLanguage()
  const [snapshot, setSnapshot] = useState<FriendSnapshot>({ friends: [], requests: [], suggestions: [] })
  const [query, setQuery] = useState("")

  useEffect(() => {
    const sync = () => setSnapshot(getFriendSnapshot())
    sync()
    window.addEventListener(FRIENDS_CHANGE_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(FRIENDS_CHANGE_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  const filterFriends = <T extends { name: string }>(friends: T[]) => friends.filter((friend) => friend.name.toLowerCase().includes(query.trim().toLowerCase()))

  return <main className="min-h-screen bg-[#fbfaf7] text-[#17352d]"><header className="sticky top-0 z-30 border-b border-[#dbe5dd] bg-[#fbfaf7]/95 backdrop-blur-md"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 lg:px-12"><Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-[-0.04em]"><span className="flex size-8 items-center justify-center rounded-full bg-[#17352d] text-[#f3d7a3]"><Users className="size-4" /></span>mise<span className="text-[#d97742]">.</span></Link><Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#527066] hover:text-[#d97742]"><ArrowLeft className="size-4" />{isVietnamese ? "Trang chủ" : "Home"}</Link></div></header><div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12 lg:px-12"><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d97742]"><Users className="size-4" />{isVietnamese ? "Kết nối cộng đồng" : "Your community"}</p><h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">{isVietnamese ? "Bạn bè" : "Friends"}</h1><p className="mt-3 text-sm leading-6 text-[#527066]">{isVietnamese ? "Kết nối với những người cùng yêu thích nấu ăn." : "Connect with people who love cooking as much as you do."}</p></div><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#789087]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isVietnamese ? "Tìm bạn bè..." : "Search friends..."} aria-label={isVietnamese ? "Tìm bạn bè" : "Search friends"} className="h-10 w-full rounded-full border border-[#c5d2cc] bg-white pl-9 pr-4 text-sm outline-none focus:border-[#d97742]" /></div></div><div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="min-w-0 space-y-8"><section><div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-2xl">{isVietnamese ? "Lời mời kết bạn" : "Friend requests"}</h2><span className="rounded-full bg-[#fff1df] px-2.5 py-1 text-xs font-bold text-[#d97742]">{snapshot.requests.length}</span></div>{filterFriends(snapshot.requests).length > 0 ? <div className="grid gap-3 sm:grid-cols-2">{filterFriends(snapshot.requests).map((friend) => <FriendCard key={friend.id} friend={friend} isVietnamese={isVietnamese} action="accept" onAction={acceptFriendRequest} />)}</div> : <p className="rounded-2xl border border-dashed border-[#c5d2cc] p-6 text-center text-sm text-[#789087]">{isVietnamese ? "Bạn đã xem hết lời mời." : "You are all caught up."}</p>}</section><section><h2 className="mb-4 font-serif text-2xl">{isVietnamese ? "Gợi ý cho bạn" : "People you may know"}</h2>{filterFriends(snapshot.suggestions).length > 0 ? <div className="grid gap-3 sm:grid-cols-2">{filterFriends(snapshot.suggestions).map((friend) => <FriendCard key={friend.id} friend={friend} isVietnamese={isVietnamese} action="add" onAction={sendFriendRequest} />)}</div> : <p className="rounded-2xl border border-dashed border-[#c5d2cc] p-6 text-center text-sm text-[#789087]">{isVietnamese ? "Không còn gợi ý mới." : "No new suggestions right now."}</p>}</section></div><aside className="h-fit rounded-2xl border border-[#dbe5dd] bg-[#17352d] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f3d7a3]">{isVietnamese ? "Mạng lưới của bạn" : "Your network"}</p><p className="mt-3 font-serif text-4xl">{snapshot.friends.length}</p><p className="mt-1 text-sm text-white/65">{isVietnamese ? "người bạn" : "friends"}</p><div className="my-5 h-px bg-white/15" /><h2 className="text-sm font-bold">{isVietnamese ? "Bạn bè của bạn" : "Your friends"}</h2><div className="mt-4 space-y-3">{filterFriends(snapshot.friends).map((friend) => <FriendCard key={friend.id} friend={friend} isVietnamese={isVietnamese} action="decline" onAction={() => undefined} />)}{snapshot.friends.length === 0 && <p className="text-sm text-white/60">{isVietnamese ? "Hãy bắt đầu kết nối." : "Start building your network."}</p>}</div><Button asChild variant="outline" className="mt-5 w-full border-white/25 bg-transparent text-white hover:bg-white/10"><Link href="/feed">{isVietnamese ? "Xem Feed cộng đồng" : "Explore community Feed"}</Link></Button></aside></div></div></div></main>
}
