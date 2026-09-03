import { Check, UserPlus, UserRound, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { declineFriendRequest } from "./friends-storage"
import type { FriendProfile } from "./friends-types"

type FriendCardProps = {
  friend: FriendProfile
  isVietnamese: boolean
  action: "accept" | "add" | "decline"
  onAction: (id: string) => void
  onDecline?: (id: string) => void
}

export function FriendCard({ friend, isVietnamese, action, onAction, onDecline }: FriendCardProps) {
  return <article className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#dbe5dd] bg-white p-4 shadow-sm"><div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e7b16e] text-sm font-bold text-[#17352d]">{friend.avatar ? <Image src={friend.avatar} alt={friend.name} fill unoptimized className="object-cover" /> : friend.initials}</div><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold text-[#17352d]">{friend.name}</h3><p className="truncate text-xs text-[#527066]">{friend.role}</p><p className="mt-1 text-[11px] text-[#789087]">{friend.mutualFriends} {isVietnamese ? "bạn chung" : "mutual friends"}</p></div>{action === "accept" && <div className="flex shrink-0 gap-1"><Button type="button" size="icon" onClick={() => onAction(friend.id)} aria-label={isVietnamese ? "Chấp nhận lời mời" : "Accept request"} className="size-8 rounded-full bg-[#17352d] text-white hover:bg-[#254b40]"><Check className="size-4" /></Button><Button type="button" size="icon" variant="outline" onClick={() => (onDecline || declineFriendRequest)(friend.id)} aria-label={isVietnamese ? "Từ chối lời mời" : "Decline request"} className="size-8 rounded-full border-[#c5d2cc] text-[#527066]"><X className="size-4" /></Button></div>}{action === "add" && <Button type="button" size="sm" onClick={() => onAction(friend.id)} className="shrink-0 gap-1.5 rounded-full bg-[#d97742] text-white hover:bg-[#bf6132]"><UserPlus className="size-3.5" />{isVietnamese ? "Kết bạn" : "Add"}</Button>}{action === "decline" && <UserRound className="size-4 shrink-0 text-[#789087]" />}</article>
}
