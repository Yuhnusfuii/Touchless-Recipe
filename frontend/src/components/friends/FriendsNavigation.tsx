import { UserRound, UserPlus, Users } from "lucide-react"
import Link from "next/link"

import type { FriendSnapshot } from "./friends-types"

type FriendsNavigationProps = {
  active: "friends" | "requests" | "suggestions"
  isVietnamese: boolean
  snapshot: FriendSnapshot
}

export function FriendsNavigation({ active, isVietnamese, snapshot }: FriendsNavigationProps) {
  const items = [
    { id: "friends" as const, href: "/friends", icon: Users, label: isVietnamese ? "Bạn bè" : "Friends", count: snapshot.friends.length },
    { id: "requests" as const, href: "/friends/requests", icon: UserPlus, label: isVietnamese ? "Lời mời" : "Requests", count: snapshot.requests.length },
    { id: "suggestions" as const, href: "/friends/suggestions", icon: UserRound, label: isVietnamese ? "Gợi ý" : "Suggestions", count: snapshot.suggestions.length },
  ]

  return <nav aria-label={isVietnamese ? "Điều hướng bạn bè" : "Friends navigation"} className="grid grid-cols-3 gap-2 rounded-2xl border border-[#dbe5dd] bg-white p-2 shadow-sm">{items.map((item) => { const Icon = item.icon; return <Link key={item.id} href={item.href} className={`flex min-w-0 items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-bold transition sm:px-4 sm:text-sm ${active === item.id ? "bg-[#17352d] text-white" : "text-[#527066] hover:bg-[#f1f5ef]"}`}><Icon className="size-4 shrink-0" /><span className="truncate">{item.label}</span><span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active === item.id ? "bg-white/15 text-white" : "bg-[#f1f5ef] text-[#527066]"}`}>{item.count}</span></Link> })}</nav>
}
