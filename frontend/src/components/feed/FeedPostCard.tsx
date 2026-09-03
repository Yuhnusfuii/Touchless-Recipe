import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { FeedPost } from "./feed-types"
import { addFeedNotification, isFavoriteFeedPost, toggleFavoriteFeedPost } from "./feed-storage"

type FeedPostCardProps = { isVietnamese: boolean; post: FeedPost }

export function FeedPostCard({ isVietnamese, post }: FeedPostCardProps) {
  const [liked, setLiked] = useState(Boolean(post.isLiked))
  const [saved, setSaved] = useState(() => Boolean(post.isSaved) || isFavoriteFeedPost(post.id))
  const [likes, setLikes] = useState(post.likes)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState(post.comments)

  function toggleLike() {
    if (!liked) addFeedNotification(post, "like")
    setLiked((current) => !current)
    setLikes((current) => current + (liked ? -1 : 1))
  }

  function addComment() {
    if (!comment.trim()) return
    setComments((current) => [...current, { id: `${post.id}-${Date.now()}`, author: "You", avatar: "YO", text: comment.trim() }])
    setComment("")
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-[#dbe5dd] bg-white shadow-[0_8px_24px_rgba(23,53,45,0.045)]">
      <div className="flex items-start justify-between gap-3 p-4 sm:p-5"><div className="flex min-w-0 items-center gap-3"><div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e7b16e] text-xs font-bold text-[#17352d]">{post.avatar ? <Image src={post.avatar} alt={post.author} fill unoptimized className="object-cover" /> : post.initials}</div><div className="min-w-0"><p className="truncate text-sm font-bold text-[#17352d]">{post.author}</p><p className="text-xs text-[#789087]">{post.role} · {post.time}</p></div></div><button type="button" aria-label={isVietnamese ? "Tùy chọn bài viết" : "Post options"} className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#789087] hover:bg-[#f1f5ef]"><MoreHorizontal className="size-4" /></button></div>
      <div className="px-4 pb-4 sm:px-5"><h2 className="text-lg font-bold tracking-[-0.02em]">{post.title}</h2><p className="mt-2 text-sm leading-6 text-[#527066]">{post.body}</p><div className="mt-3 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full bg-[#f1f5ef] px-2.5 py-1 text-xs font-semibold text-[#527066]">#{tag}</span>)}</div></div>
      {post.image && <div className="relative aspect-[16/10] w-full bg-[#e4ece2]"><Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover" /></div>}
      <div className="flex items-center justify-between px-4 py-3 text-xs text-[#789087] sm:px-5"><span>{likes} {isVietnamese ? "lượt thích" : "likes"}</span><span>{comments.length} {isVietnamese ? "bình luận" : "comments"}</span></div>
      <div className="mx-4 flex border-y border-[#e4ece2] py-1 sm:mx-5"><Button variant="ghost" onClick={toggleLike} className={`flex-1 gap-2 ${liked ? "text-[#d97742]" : "text-[#527066]"}`}><Heart className={`size-4 ${liked ? "fill-current" : ""}`} />{isVietnamese ? "Thích" : "Like"}</Button><Button variant="ghost" className="flex-1 gap-2 text-[#527066]"><MessageCircle className="size-4" />{isVietnamese ? "Bình luận" : "Comment"}</Button><Button variant="ghost" onClick={() => { const next = toggleFavoriteFeedPost(post); setSaved(next); if (next) addFeedNotification(post, "save") }} aria-label={isVietnamese ? "Lưu bài viết" : "Save post"} className={`size-9 ${saved ? "text-[#d97742]" : "text-[#527066]"}`}><Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} /></Button></div>
      {comments.length > 0 && <div className="space-y-3 px-4 pt-4 sm:px-5">{comments.map((item) => <div key={item.id} className="flex gap-2"><div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#d9a2a2] text-[10px] font-bold text-[#17352d]">{item.avatar}</div><div className="min-w-0 rounded-xl bg-[#f1f5ef] px-3 py-2"><p className="text-xs font-bold">{item.author}</p><p className="mt-0.5 break-words text-sm text-[#527066]">{item.text}</p></div></div>)}</div>}
      <div className="flex gap-2 p-4 sm:p-5"><input value={comment} onChange={(event) => setComment(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addComment() }} placeholder={isVietnamese ? "Viết bình luận..." : "Write a comment..."} className="min-w-0 flex-1 rounded-full border border-[#c5d2cc] bg-[#fbfaf7] px-4 py-2 text-sm outline-none focus:border-[#d97742]" /><Button onClick={addComment} size="icon" aria-label={isVietnamese ? "Gửi bình luận" : "Send comment"} className="size-9 shrink-0 rounded-full bg-[#17352d] text-white hover:bg-[#254b40]"><Send className="size-4" /></Button></div>
    </article>
  )
}