"use client"

import { SlidersHorizontal, Sparkles } from "lucide-react"
import { useDeferredValue, useEffect, useState } from "react"

import { useLanguage } from "@/components/language-provider"
import type { UserData } from "@/lib/api"

import { FeedComposer } from "./FeedComposer"
import { FeedHeader } from "./FeedHeader"
import { FeedPostCard } from "./FeedPostCard"
import { FeedSidebar } from "./FeedSidebar"
import type { FeedPost } from "./feed-types"
import { getInitials, getStoredUser } from "./feed-storage"
import { feedApi } from "@/lib/feed-api"

export default function FeedPage() {
  const { isVietnamese } = useLanguage()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [user, setUser] = useState<UserData | null>(null)
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<"latest" | "popular">("latest")
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser())
    const loadPosts = async () => {
      try {
        setPosts(await feedApi.getPosts())
      } catch (cause) {
        console.error(cause)
      }
    }
    syncUser()
    void loadPosts()
    window.addEventListener("touchless-auth-change", syncUser)
    window.addEventListener("storage", syncUser)
    return () => {
      window.removeEventListener("touchless-auth-change", syncUser)
      window.removeEventListener("storage", syncUser)
    }
  }, [])

  const visiblePosts = posts
    .filter((post) => `${post.title} ${post.body} ${post.tags.join(" ")}`.toLowerCase().includes(deferredQuery.trim().toLowerCase()))
    .sort((first, second) => sort === "popular" ? second.likes - first.likes : 0)

  async function publishPost(body: string, image?: string) {
    try {
      const post = await feedApi.createPost({ body, image, tags: [isVietnamese ? "Bếp nhà" : "My kitchen"] })
      setPosts((current) => [post, ...current])
    } catch (cause) {
      console.error(cause)
    }
  }

  return <div className="min-h-screen bg-[#fbfaf7] text-[#17352d]"><FeedHeader /><main className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-10 lg:px-12"><div className="mx-auto max-w-6xl"><section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d97742]"><Sparkles className="size-4" />{isVietnamese ? "Góc bếp cộng đồng" : "The kitchen community"}</p><h1 className="mt-3 font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">{isVietnamese ? "Chia sẻ món ngon, cùng nhau vào bếp." : "Good food is better shared."}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#527066] sm:text-base">{isVietnamese ? "Khám phá những câu chuyện, công thức và cảm hứng mới từ những người yêu nấu ăn." : "Discover recipes, rituals, and fresh inspiration from people who love to cook."}</p></div><div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#dbe5dd] bg-white p-1"><button type="button" onClick={() => setSort("latest")} className={`rounded-lg px-3 py-2 text-xs font-bold ${sort === "latest" ? "bg-[#17352d] text-white" : "text-[#527066]"}`}>{isVietnamese ? "Mới nhất" : "Latest"}</button><button type="button" onClick={() => setSort("popular")} className={`rounded-lg px-3 py-2 text-xs font-bold ${sort === "popular" ? "bg-[#17352d] text-white" : "text-[#527066]"}`}><SlidersHorizontal className="mr-1 inline size-3" />{isVietnamese ? "Nổi bật" : "Popular"}</button></div></section><div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="min-w-0 space-y-5"><FeedComposer isVietnamese={isVietnamese} userAvatar={user?.image} userInitials={getInitials(user?.name || "You")} onPublish={publishPost} /><div className="flex items-center gap-3"><div className="relative min-w-0 flex-1"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isVietnamese ? "Lọc bài viết theo món hoặc chủ đề..." : "Filter posts by recipe or topic..."} className="h-10 w-full rounded-full border border-[#c5d2cc] bg-white px-4 text-sm outline-none focus:border-[#d97742]" /></div><span className="shrink-0 text-xs text-[#789087]">{visiblePosts.length} {isVietnamese ? "bài viết" : "posts"}</span></div>{visiblePosts.map((post) => <FeedPostCard key={post.id} isVietnamese={isVietnamese} post={post} />)}{visiblePosts.length === 0 && <div className="rounded-2xl border border-dashed border-[#c5d2cc] p-10 text-center text-sm text-[#527066]">{isVietnamese ? "Chưa tìm thấy bài viết phù hợp." : "No matching posts yet."}</div>}</div><FeedSidebar isVietnamese={isVietnamese} /></div></div></main></div>
}