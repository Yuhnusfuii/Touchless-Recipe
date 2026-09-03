import { Check, Share2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { RecipeItem } from "@/lib/api"

import { addFeedNotification, createRecipePost, saveFeedPost } from "./feed-storage"

type ShareRecipeButtonProps = {
  recipe: RecipeItem
  isVietnamese: boolean
  className?: string
  compact?: boolean
}

export function ShareRecipeButton({ recipe, isVietnamese, className, compact = false }: ShareRecipeButtonProps) {
  const [shared, setShared] = useState(false)

  function shareRecipe() {
    const post = createRecipePost(recipe, isVietnamese)
    saveFeedPost(post)
    addFeedNotification(post, "share")
    setShared(true)
    window.setTimeout(() => setShared(false), 1800)
  }

  return <Button type="button" variant="outline" aria-label={isVietnamese ? "Chia sẻ món ăn lên Feed" : "Share recipe to Feed"} onClick={(event) => { event.stopPropagation(); shareRecipe() }} className={`gap-2 border-[#c5d2cc] text-[#527066] hover:border-[#d97742] hover:text-[#d97742] ${className || ""}`}><span className="sr-only">{isVietnamese ? "Chia sẻ món ăn lên Feed" : "Share recipe to Feed"}</span>{shared ? <Check className="size-4" /> : <Share2 className="size-4" />}{!compact && (shared ? (isVietnamese ? "Đã chia sẻ" : "Shared") : (isVietnamese ? "Chia sẻ lên Feed" : "Share to Feed"))}</Button>
}