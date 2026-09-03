"use client"

import { ArrowLeft, ChefHat, Clock, Heart, Leaf, Play, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { FAVORITES_CHANGE_EVENT, getFavoriteRecipes, toggleFavoriteRecipe } from "@/lib/favorites"
import type { RecipeItem } from "@/lib/api"
import { cn } from "@/lib/utils"
import { FEED_FAVORITES_CHANGE_EVENT, getFavoriteFeedPosts } from "@/components/feed/feed-storage"
import { FeedPostCard } from "@/components/feed/FeedPostCard"

export default function FavoritesPage() {
  const { isVietnamese } = useLanguage()
  const [favorites, setFavorites] = useState<RecipeItem[]>([])
  const [favoritePosts, setFavoritePosts] = useState<ReturnType<typeof getFavoriteFeedPosts>>([])

  useEffect(() => {
    const syncFavorites = () => setFavorites(getFavoriteRecipes())
    const syncFavoritePosts = () => setFavoritePosts(getFavoriteFeedPosts())
    syncFavorites()
    syncFavoritePosts()
    window.addEventListener(FAVORITES_CHANGE_EVENT, syncFavorites)
    window.addEventListener("storage", syncFavoritePosts)
    window.addEventListener(FEED_FAVORITES_CHANGE_EVENT, syncFavoritePosts)
    window.addEventListener("storage", syncFavorites)
    return () => {
      window.removeEventListener(FAVORITES_CHANGE_EVENT, syncFavorites)
      window.removeEventListener("storage", syncFavoritePosts)
      window.removeEventListener(FEED_FAVORITES_CHANGE_EVENT, syncFavoritePosts)
      window.removeEventListener("storage", syncFavorites)
    }
  }, [])

  const removeFavorite = (recipe: RecipeItem) => toggleFavoriteRecipe(recipe)
  const startCooking = (recipe: RecipeItem) => {
    localStorage.setItem("active_cooking_recipe", JSON.stringify({ ...recipe, returnPath: "/favorites" }))
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#17352d]">
      <header className="border-b border-[#dbe5dd] bg-[#fbfaf7]"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12"><Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-[-0.04em]"><span className="flex size-8 items-center justify-center rounded-full bg-[#17352d] text-[#f3d7a3]"><Leaf className="size-4" /></span>mise<span className="text-[#d97742]">.</span></Link><Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 border-[#c5d2cc] text-[#527066]")}><ArrowLeft className="size-4" />{isVietnamese ? "Về trang chủ" : "Back home"}</Link></div></header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14"><div className="flex flex-col justify-between gap-5 border-b border-[#dbe5dd] pb-8 sm:flex-row sm:items-end"><div><p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#c56537]"><Heart className="size-4 fill-current" />{isVietnamese ? "Bộ sưu tập của bạn" : "Your collection"}</p><h1 className="mt-3 font-serif text-5xl tracking-[-0.05em]">{isVietnamese ? "Món yêu thích" : "Favorite recipes"}</h1><p className="mt-3 text-sm text-[#527066]">{favorites.length} {isVietnamese ? "món đã được lưu" : "saved recipes"}</p></div><Link href="/" className={cn(buttonVariants({ size: "sm" }), "gap-2 bg-[#d97742] text-white hover:bg-[#bf6132]")}><ChefHat className="size-4" />{isVietnamese ? "Khám phá thêm món" : "Discover recipes"}</Link></div>{favorites.length === 0 ? <div className="py-24 text-center"><Heart className="mx-auto size-10 text-[#d97742]" /><h2 className="mt-5 font-serif text-3xl">{isVietnamese ? "Chưa có món yêu thích" : "No favorite recipes yet"}</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#527066]">{isVietnamese ? "Nhấn biểu tượng trái tim trên bất kỳ món ăn nào để lưu lại và nấu sau." : "Tap the heart on any recipe to save it here for later."}</p></div> : <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{favorites.map((recipe) => <article key={recipe.id} className="group overflow-hidden rounded-2xl border border-[#dbe5dd] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative h-52 overflow-hidden bg-[#e4ece2]"><Image src={recipe.imageUrl} alt={recipe.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-300 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><Badge className="absolute left-4 top-4 border-none bg-white/90 text-[#17352d]">{recipe.category}</Badge><button type="button" onClick={() => removeFavorite(recipe)} aria-label={isVietnamese ? `Bỏ ${recipe.title} khỏi yêu thích` : `Remove ${recipe.title} from favorites`} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-sm transition hover:scale-110"><Heart className="size-4 fill-current" /></button><div className="absolute bottom-4 left-4 flex items-center gap-1 text-xs text-white"><Clock className="size-3.5" />{recipe.prepTime} {isVietnamese ? "phút" : "mins"}</div></div><div className="p-5"><h2 className="font-serif text-2xl leading-tight">{recipe.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#527066]">{recipe.description}</p><div className="mt-5 flex gap-2"><Link href="/playground" onClick={() => startCooking(recipe)} className={cn(buttonVariants({ size: "sm" }), "flex-1 gap-2 bg-[#d97742] text-white hover:bg-[#bf6132]")}><Play className="size-3.5 fill-current" />{isVietnamese ? "Nấu món này" : "Cook this"}</Link><Button variant="outline" size="icon" onClick={() => removeFavorite(recipe)} title={isVietnamese ? "Xóa khỏi yêu thích" : "Remove favorite"} className="border-[#dbe5dd] text-[#527066]"><Trash2 className="size-4" /></Button></div></div></article>)}</div>}</div>
      <FavoriteFeedSection isVietnamese={isVietnamese} posts={favoritePosts} />
    </main>
  )
}

function FavoriteFeedSection({ isVietnamese, posts }: { isVietnamese: boolean; posts: ReturnType<typeof getFavoriteFeedPosts> }) {
  if (posts.length === 0) return null

  return <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8 lg:px-12"><h2 className="mb-5 font-serif text-3xl">{isVietnamese ? "Bài viết yêu thích" : "Favorite posts"}</h2><div className="grid gap-6 lg:grid-cols-2">{posts.map((post) => <FeedPostCard key={post.id} isVietnamese={isVietnamese} post={post} />)}</div></section>
}
