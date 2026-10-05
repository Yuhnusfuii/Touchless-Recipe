"use client"

import { useCallback, useEffect, useSyncExternalStore, useState } from "react"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChefHat,
  Clock,
  Flame,
  Globe,
  Hand,
  Heart,
  Info,
  Leaf,
  Loader2,
  LogOut,
  Mail,
  Mic,
  Play,
  Search,
  Sparkles,
  Utensils,
  Video,
  X,
  Zap,
  Rss,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { recipeApi, type RecipeItem } from "@/lib/api"
import {
  translateArea,
  translateCategory,
  translateDescription,
  translateDifficulty,
  translateIngredientName,
  translateMeasure,
  translateRecipeTitle,
  translateStepInstruction,
  translateTextToVietnamese,
} from "@/lib/translate"
import { cn } from "@/lib/utils"
import { FAVORITES_CHANGE_EVENT, getFavoriteRecipes, toggleFavoriteRecipe } from "@/lib/favorites"
import { ShareRecipeButton } from "@/components/feed/ShareRecipeButton"
import { clearAuthSession } from "@/lib/auth-session"

interface UserProfile {
  id?: string
  name?: string
  email?: string
  image?: string
  dietaryPrefs?: string
  kcalTarget?: number
  streak?: number
  cookedMealsCount?: number
  handsFreeSessionsCount?: number
  lastCookingDate?: string | Date
}

const CATEGORIES = [
  { id: "all", labelEn: "All Recipes", labelVi: "Tất cả món" },
  { id: "Chicken", labelEn: "Chicken", labelVi: "Thịt gà" },
  { id: "Beef", labelEn: "Beef", labelVi: "Thịt bò" },
  { id: "Seafood", labelEn: "Seafood", labelVi: "Hải sản" },
  { id: "Vegetarian", labelEn: "Vegetarian", labelVi: "Món chay" },
  { id: "Pasta", labelEn: "Pasta", labelVi: "Mì Ý" },
  { id: "Dessert", labelEn: "Dessert", labelVi: "Tráng miệng" },
  { id: "Breakfast", labelEn: "Breakfast", labelVi: "Bữa sáng" },
]

function subscribeUser(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

function getUserSnapshot() {
  return localStorage.getItem("user")
}

function getUserServerSnapshot() {
  return null
}

export function Dashboard() {
  const router = useRouter()
  const { setLanguage, isVietnamese } = useLanguage()

  const userJson = useSyncExternalStore(subscribeUser, getUserSnapshot, getUserServerSnapshot)
  const user: UserProfile | null = userJson ? JSON.parse(userJson) : null

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [recipes, setRecipes] = useState<RecipeItem[]>([])
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null)
  const [translatedSteps, setTranslatedSteps] = useState<{
    recipeId: string
    values: Record<number, string>
  } | null>(null)
  const [isVoiceGuideOpen, setIsVoiceGuideOpen] = useState(false)

  useEffect(() => {
    let isCurrent = true

    if (!selectedRecipe || !isVietnamese) {
      return () => {
        isCurrent = false
      }
    }

    const translateSteps = async () => {
      const translated = await Promise.all(
        selectedRecipe.steps.map(async (step) => [
          step.stepNumber,
          await translateTextToVietnamese(step.instruction),
        ] as const)
      )

      if (isCurrent) {
        setTranslatedSteps({
          recipeId: selectedRecipe.id,
          values: Object.fromEntries(translated),
        })
      }
    }

    void translateSteps()

    return () => {
      isCurrent = false
    }
  }, [isVietnamese, selectedRecipe])

  useEffect(() => {
    const syncFavorites = () => {
      setFavorites(Object.fromEntries(getFavoriteRecipes().map((recipe) => [recipe.id, true])))
    }
    syncFavorites()
    window.addEventListener(FAVORITES_CHANGE_EVENT, syncFavorites)
    window.addEventListener("storage", syncFavorites)
    return () => {
      window.removeEventListener(FAVORITES_CHANGE_EVENT, syncFavorites)
      window.removeEventListener("storage", syncFavorites)
    }
  }, [])

  // Fetch authentic recipes from API (TheMealDB + Backend)
  const fetchRecipes = useCallback(
    async (category: string, search: string) => {
      setIsLoading(true)
      try {
        const data = await recipeApi.getRecipes({
          category: category !== "all" ? category : undefined,
          search: search.trim() ? search.trim() : undefined,
          limit: 12,
        })
        setRecipes(data)
      } catch (error) {
        console.error("Error fetching recipes:", error)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Debounced search & category trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes(selectedCategory, searchQuery)
    }, 350)
    return () => clearTimeout(timer)
  }, [selectedCategory, searchQuery, fetchRecipes])

  const handleLogout = () => {
    clearAuthSession()
    window.dispatchEvent(new Event("touchless-auth-change"))
    router.push("/login")
    router.refresh()
  }

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const selectedRecipe = recipes.find((recipe) => recipe.id === id)
    if (selectedRecipe) toggleFavoriteRecipe(selectedRecipe)
  }

  const startCookingRecipe = (recipe: RecipeItem) => {
    localStorage.setItem("active_cooking_recipe", JSON.stringify({ ...recipe, returnPath: "/" }))
    router.push("/playground")
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#17352d]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-[#31594c] bg-[#17352d]/95 text-white shadow-[0_8px_24px_rgba(23,53,45,0.12)] backdrop-blur-md">
        <div className="w-full flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5 text-xl font-bold tracking-[-0.04em] transition hover:opacity-90">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#f3d7a3] text-[#17352d] shadow-[3px_3px_0_#d97742]">
              <Leaf aria-hidden="true" className="size-4" />
            </span>
            <span>CookAI<span className="text-[#f3a477]">.</span></span>
          </Link>

          {/* Quick Search Bar */}
          <div className="relative hidden flex-1 max-w-md lg:max-w-xl md:block mx-2 lg:mx-6">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#b9d1bd]" />
            <input
              type="text"
              placeholder={
                isVietnamese
                  ? "Tìm công thức (ví dụ: Salmon, Curry, Pasta)..."
                  : "Search recipes (e.g., Salmon, Curry, Pasta)..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full border border-white/15 bg-white/10 pl-10 pr-9 text-xs text-white outline-none transition placeholder:text-[#b9d1bd] focus:border-[#f3d7a3] focus:bg-white/15 focus:ring-2 focus:ring-[#f3d7a3]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Evenly Spaced Right Controls */}
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3 lg:gap-4">
            {/* Language Switcher */}
            <div className="flex h-10 items-center rounded-xl border border-white/15 bg-white/10 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage("vi")}
                className={cn(
                  "flex h-full items-center gap-1 rounded-lg px-2.5 transition",
                  isVietnamese
                    ? "bg-[#f3d7a3] text-[#17352d] shadow-xs"
                    : "text-[#dce8dc] hover:text-white"
                )}
              >
                <span>🇻🇳</span>
                <span>VI</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex h-full items-center gap-1 rounded-lg px-2.5 transition",
                  !isVietnamese
                    ? "bg-[#f3d7a3] text-[#17352d] shadow-xs"
                    : "text-[#dce8dc] hover:text-white"
                )}
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            {/* Community Feed Link */}
            <Link
              href="/feed"
              className="flex h-10 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-semibold text-[#dce8dc] transition hover:border-[#f3d7a3] hover:bg-white/15 hover:text-white"
              title={isVietnamese ? "Feed cộng đồng" : "Community feed"}
            >
              <Rss className="size-4 text-[#f3d7a3]" />
              <span className="hidden sm:inline">{isVietnamese ? "Cộng đồng" : "Community"}</span>
            </Link>

            {/* Friends Link */}
            <Link
              href="/friends"
              className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[#dce8dc] transition hover:border-[#f3d7a3] hover:bg-white/15 hover:text-white"
              title={isVietnamese ? "Bạn bè" : "Friends"}
            >
              <Users className="size-4" />
            </Link>

            {/* Launch Hands-free Playground */}
            <Link
              href="/playground"
              className={cn(
                buttonVariants({ size: "sm" }),
                "h-10 gap-1.5 rounded-xl border-[#f3a477] bg-[#d97742] px-3.5 text-xs font-semibold text-white shadow-[0_4px_0_#8f4528] hover:bg-[#bf6132] transition"
              )}
            >
              <Hand className="size-4" />
              <span>{isVietnamese ? "Bếp rảnh tay" : "Hands-free Mode"}</span>
            </Link>

            {/* Favorites Link */}
            <Link
              href="/favorites"
              className="relative flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[#dce8dc] transition hover:border-[#f3d7a3] hover:bg-white/15 hover:text-white"
              title={isVietnamese ? "Món yêu thích" : "Favorite recipes"}
            >
              <Heart className="size-4" />
              {Object.keys(favorites).length > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#d97742] text-[9px] font-bold text-white">
                  {Object.keys(favorites).length}
                </span>
              )}
            </Link>

            {/* User Profile & Logout */}
            <div className="flex h-10 items-center gap-2 border-l border-white/20 pl-2 sm:pl-3">
              <Link
                href="/profile"
                className="group flex h-10 items-center gap-2 rounded-xl px-2 transition hover:bg-white/10"
                title={isVietnamese ? "Hồ sơ cá nhân" : "User Profile"}
              >
                <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#f3d7a3]/40 bg-[#17352d] text-xs font-semibold text-[#f3d7a3] transition group-hover:border-[#d97742]">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Avatar"}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    <span suppressHydrationWarning>{user?.name ? user.name.slice(0, 2).toUpperCase() : "CH"}</span>
                  )}
                </div>
                <div className="hidden text-left sm:block">
                  <p suppressHydrationWarning className="text-xs font-semibold leading-none text-white transition group-hover:text-[#f3d7a3]">
                    {user?.name || (isVietnamese ? "Đầu bếp" : "Chef")}
                  </p>
                  <p suppressHydrationWarning className="mt-0.5 max-w-[130px] truncate text-[10px] text-[#b9d1bd]">
                    {user?.email || "user@touchless.io"}
                  </p>
                </div>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title={isVietnamese ? "Đăng xuất" : "Logout"}
                className="size-9 rounded-xl text-[#b9d1bd] hover:bg-[#ffebee]/20 hover:text-red-300"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17352d] via-[#214a3e] to-[#102b24] p-6 text-white shadow-xl sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full border-[38px] border-[#d97742]/15" />
          <div className="pointer-events-none absolute bottom-[-9rem] right-[27%] size-72 rounded-full border border-[#f3d7a3]/10" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:gap-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#f3d7a3] backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>{isVietnamese ? "Kho công thức chuẩn quốc tế (TheMealDB API)" : "Authentic Global Recipe Archive"}</span>
            </div>
            <h1 className="mt-4 font-serif text-3xl font-normal leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              {isVietnamese
                ? `Xin chào, ${user?.name || "Đầu bếp"}!`
                : `Hello, ${user?.name || "Chef"}!`}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
              {isVietnamese
                ? "Khám phá hàng ngàn công thức nấu ăn chính thống, chuẩn bị nguyên liệu và sẵn sàng nấu rảnh tay bằng cử chỉ camera."
                : "Explore thousands of authentic culinary recipes with verified step-by-step instructions and hands-free gesture control."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/playground"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 bg-[#d97742] text-white hover:bg-[#bf6132]"
                )}
              >
                <Play className="size-4 fill-current" />
                {isVietnamese ? "Vào bếp rảnh tay ngay" : "Start Hands-free Cooking"}
              </Link>
            </div>
          </div>

          <div className="relative hidden min-h-[285px] lg:block" aria-hidden="true">
            <div className="absolute right-8 top-3 h-52 w-44 rotate-[-7deg] overflow-hidden rounded-2xl border-4 border-white/80 bg-[#d97742] shadow-2xl">
              <Image src="/images/market-garden-salad.jpg" alt="" fill sizes="176px" className="object-cover" />
            </div>
            <div className="absolute bottom-1 left-2 h-48 w-40 rotate-[7deg] overflow-hidden rounded-2xl border-4 border-white/80 bg-[#e4ece2] shadow-2xl">
              <Image src="/images/roasted-harvest-bowl.jpg" alt="" fill sizes="160px" className="object-cover" />
            </div>
            <div className="absolute bottom-8 right-[-1rem] z-10 w-52 rounded-2xl border border-white/25 bg-[#fbfaf7] p-4 text-[#17352d] shadow-2xl">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-[#c56537]"><span>{isVietnamese ? "Gợi ý hôm nay" : "Today's pick"}</span><ChefHat className="size-4" /></div>
              <p className="mt-2 font-serif text-xl leading-tight">Sesame soba noodles</p>
              <div className="mt-3 flex items-center justify-between text-xs text-[#527066]"><span>{isVietnamese ? "Dễ nấu" : "Easy"}</span><span>18 min · 420 kcal</span></div>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/15 pt-6 sm:grid-cols-3 md:w-fit md:gap-8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#d97742]/20 text-[#d97742]">
                <Flame className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/60">
                  {isVietnamese ? "Chuỗi ngày" : "Streak"}
                </p>
                <p suppressHydrationWarning className="text-lg font-semibold">
                  {user?.streak ?? 0} {isVietnamese ? "ngày" : "days"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#f3d7a3]/20 text-[#f3d7a3]">
                <Zap className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/60">
                  {isVietnamese ? "Mục tiêu Kcal" : "Kcal Target"}
                </p>
                <p suppressHydrationWarning className="text-lg font-semibold">
                  {user?.kcalTarget || 2000} kcal
                </p>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                <ChefHat className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/60">
                  {isVietnamese ? "Đã nấu (>50% bước)" : "Meals Cooked"}
                </p>
                <p suppressHydrationWarning className="text-lg font-semibold">
                  {user?.cookedMealsCount ?? 0} {isVietnamese ? "món" : "meals"}
                </p>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Quick Functional Modules */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/playground"
            className="group rounded-2xl border border-[#dbe5dd] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#d97742] hover:shadow-md"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff1df] text-[#d97742] transition group-hover:bg-[#d97742] group-hover:text-white">
              <Hand className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold">{isVietnamese ? "Bếp cử chỉ rảnh tay" : "Gesture Kitchen"}</h3>
            <p className="mt-1 text-xs leading-5 text-[#527066]">
              {isVietnamese
                ? "Lật trang, hẹn giờ bằng cử chỉ không cần chạm màn hình."
                : "Swipe steps and start timers without touching your device."}
            </p>
          </Link>

          <Link
            href="/smart-fridge"
            className="group rounded-2xl border border-[#dbe5dd] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#d97742] hover:shadow-md"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#e4ece2] text-[#17352d] transition group-hover:bg-[#17352d] group-hover:text-white">
              <Utensils className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold">{isVietnamese ? "Tủ lạnh thông minh" : "Smart Fridge"}</h3>
            <p className="mt-1 text-xs leading-5 text-[#527066]">
              {isVietnamese
                ? "Quản lý nguyên liệu có sẵn và gợi ý món ăn chuẩn vị."
                : "Track available ingredients and get instant recipe suggestions."}
            </p>
          </Link>

          <Link href="/meal-plan" className="group rounded-2xl border border-[#dbe5dd] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#d97742] hover:shadow-md">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#f0f4ee] text-[#527066] transition group-hover:bg-[#527066] group-hover:text-white">
              <Calendar className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold">{isVietnamese ? "Kế hoạch bữa ăn" : "Meal Planner"}</h3>
            <p className="mt-1 text-xs leading-5 text-[#527066]">
              {isVietnamese
                ? "Lên thực đơn tuần tự động tính toán calo và dinh dưỡng."
                : "Schedule balanced weekly meals with auto-calculated macros."}
            </p>
          </Link>

          <button
            type="button"
            onClick={() => setIsVoiceGuideOpen(true)}
            className="group w-full cursor-pointer rounded-2xl border border-[#dbe5dd] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#d97742] hover:shadow-md"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff7ea] text-[#c56537] transition group-hover:bg-[#c56537] group-hover:text-white">
              <Mic className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold">{isVietnamese ? "Trợ lý giọng nói" : "Voice Assistant"}</h3>
            <p className="mt-1 text-xs leading-5 text-[#527066]">
              {isVietnamese
                ? "Hỏi đáp hướng dẫn nấu ăn trực tiếp bằng giọng nói AI."
                : "Ask for cooking tips and step readouts completely hands-free."}
            </p>
          </button>
        </section>

        {/* Featured Recipes Section */}
        <section className="mt-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d97742]">
                <BookOpen className="size-4" />
                <span>{isVietnamese ? "Công thức chính thống" : "Authentic Culinary API"}</span>
              </div>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl">
                {isVietnamese ? "Khám phá món ngon thế giới" : "Official Global Recipes"}
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                    selectedCategory === cat.id
                      ? "bg-[#17352d] text-white shadow-sm"
                      : "bg-[#e4ece2] text-[#527066] hover:bg-[#d8e4d5]"
                  )}
                >
                  {isVietnamese ? cat.labelVi : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="mt-12 flex flex-col items-center justify-center py-12 text-[#527066]">
              <Loader2 className="size-8 animate-spin text-[#d97742]" />
              <p className="mt-3 text-sm font-medium">
                {isVietnamese ? "Đang tải công thức chính thống..." : "Fetching authentic recipes..."}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && recipes.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-[#c5d2cc] p-10 text-center">
              <ChefHat className="mx-auto size-10 text-[#c56537]" />
              <h3 className="mt-3 font-serif text-lg font-semibold">
                {isVietnamese ? "Không tìm thấy công thức phù hợp" : "No recipes found"}
              </h3>
              <p className="mt-1 text-sm text-[#527066]">
                {isVietnamese
                  ? "Hãy thử tìm kiếm từ khóa khác (ví dụ: chicken, beef, soup, pasta)."
                  : "Try another search keyword (e.g., chicken, beef, soup, pasta)."}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                {isVietnamese ? "Xem tất cả công thức" : "View all recipes"}
              </Button>
            </div>
          )}

          {/* Recipes Grid */}
          {!isLoading && recipes.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#dbe5dd] bg-white transition hover:shadow-lg"
                >
                  {/* Image & Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#e4ece2]">
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <div className="absolute left-3 top-3 flex items-center gap-1.5">
                      <Badge className="border-none bg-white/95 text-xs text-[#17352d] shadow-sm backdrop-blur-sm">
                        {translateCategory(recipe.category, isVietnamese)}
                      </Badge>
                      {recipe.area && (
                        <Badge variant="secondary" className="bg-black/60 text-xs text-white backdrop-blur-sm">
                          <Globe className="mr-1 size-3" />
                          {translateArea(recipe.area, isVietnamese)}
                        </Badge>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(recipe.id, e)}
                      aria-label="Save recipe"
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-[#17352d] shadow-sm backdrop-blur-sm transition hover:scale-110"
                    >
                      <Heart
                        className={cn(
                          "size-4 transition",
                          favorites[recipe.id] ? "fill-red-500 text-red-500" : "text-[#527066]"
                        )}
                      />
                    </button>

                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white">
                      <span className="flex items-center gap-1 rounded bg-black/50 px-2 py-0.5 backdrop-blur-xs">
                        <Clock className="size-3" />
                        {recipe.prepTime} {isVietnamese ? "phút" : "mins"}
                      </span>
                      <span className="flex items-center gap-1 rounded bg-black/50 px-2 py-0.5 backdrop-blur-xs">
                        <Flame className="size-3" />
                        {recipe.calories} kcal
                      </span>
                    </div>
                  </div>

                  <CardContent className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#527066]">
                        <span>{isVietnamese ? "Độ khó:" : "Difficulty:"}</span>
                        <span className="font-semibold text-[#17352d]">
                          {translateDifficulty(recipe.difficulty, isVietnamese)}
                        </span>
                      </div>

                      <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-[#17352d] group-hover:text-[#d97742]">
                        {recipe.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#527066]">
                        {translateDescription(recipe.area, recipe.category, isVietnamese)}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center gap-2 border-t border-[#f0f4ee] pt-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          startCookingRecipe(recipe)
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#17352d] py-2.5 text-xs font-semibold text-white transition hover:bg-[#254b40]"
                      >
                        <Hand className="size-3.5" />
                        <span>{isVietnamese ? "Nấu với cử chỉ" : "Cook with Gestures"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRecipe(recipe)}
                        title={isVietnamese ? "Xem chi tiết" : "View Details"}
                        className="flex size-9 items-center justify-center rounded-xl border border-[#c5d2cc] text-[#527066] hover:bg-[#e4ece2] hover:text-[#17352d]"
                      >
                        <Info className="size-4" />
                      </button>
                      <ShareRecipeButton
                        recipe={recipe}
                        isVietnamese={isVietnamese}
                        compact
                        className="size-9 shrink-0 px-0"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in"
            onClick={() => setSelectedRecipe(null)}
          >
            <div
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#fbfaf7] p-6 text-[#17352d] shadow-2xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                aria-label={isVietnamese ? "Đóng" : "Close"}
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/80 text-[#527066] shadow hover:bg-white hover:text-black"
              >
                <X className="size-5" />
              </button>

              <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-[#e4ece2] sm:h-72">
                <Image
                  src={selectedRecipe.imageUrl}
                  alt={translateRecipeTitle(selectedRecipe.title, isVietnamese)}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#d97742] text-white">
                      {translateCategory(selectedRecipe.category, isVietnamese)}
                    </Badge>
                    <Badge className="bg-black/40 text-white">
                      {translateArea(selectedRecipe.area, isVietnamese)}
                    </Badge>
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                    {translateRecipeTitle(selectedRecipe.title, isVietnamese)}
                  </h2>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="mt-4 flex items-center justify-around rounded-2xl bg-[#e4ece2]/60 p-3 text-center text-xs font-medium text-[#17352d]">
                <div>
                  <p className="text-[10px] uppercase text-[#527066]">{isVietnamese ? "Thời gian" : "Time"}</p>
                  <p className="mt-0.5 font-semibold">{selectedRecipe.prepTime} {isVietnamese ? "phút" : "mins"}</p>
                </div>
                <div className="h-6 w-px bg-[#c5d2cc]" />
                <div>
                  <p className="text-[10px] uppercase text-[#527066]">{isVietnamese ? "Năng lượng" : "Calories"}</p>
                  <p className="mt-0.5 font-semibold">{selectedRecipe.calories} kcal</p>
                </div>
                <div className="h-6 w-px bg-[#c5d2cc]" />
                <div>
                  <p className="text-[10px] uppercase text-[#527066]">{isVietnamese ? "Độ khó" : "Difficulty"}</p>
                  <p className="mt-0.5 font-semibold">
                    {translateDifficulty(selectedRecipe.difficulty, isVietnamese)}
                  </p>
                </div>
              </div>

              {/* Recipe source */}
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#c5d2cc] bg-white px-4 py-3 text-xs">
                <Globe className="size-4 shrink-0 text-[#d97742]" aria-hidden="true" />
                <span className="text-[#527066]">
                  {isVietnamese ? "Nguồn công thức:" : "Recipe source:"}
                </span>
                {selectedRecipe.sourceUrl ? (
                  <a
                    href={selectedRecipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#d97742] hover:underline"
                  >
                    {selectedRecipe.source === "TheMealDB" ? "TheMealDB" : selectedRecipe.source}
                  </a>
                ) : (
                  <span className="font-semibold text-[#17352d]">
                    {selectedRecipe.source === "Community"
                      ? isVietnamese
                        ? "Cộng đồng"
                        : "Community"
                      : selectedRecipe.source}
                  </span>
                )}
              </div>

              {/* Ingredients */}
              {selectedRecipe.ingredients.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-serif text-lg font-semibold text-[#17352d]">
                    {isVietnamese ? "Nguyên liệu cần chuẩn bị" : "Ingredients"}
                  </h4>
                  <ul className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-center justify-between rounded-lg bg-white p-2.5 shadow-xs">
                        <span className="font-medium text-[#17352d]">
                          {translateIngredientName(ing.name, isVietnamese)}
                        </span>
                        <span className="font-mono text-xs text-[#527066]">
                          {translateMeasure(ing.measure, isVietnamese)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Steps */}
              {selectedRecipe.steps.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-serif text-lg font-semibold text-[#17352d]">
                    {isVietnamese ? "Các bước thực hiện" : "Instructions"}
                  </h4>
                  <div className="mt-3 space-y-3">
                    {selectedRecipe.steps.map((step) => (
                      <div key={step.stepNumber} className="flex gap-3 rounded-xl bg-white p-3.5 shadow-xs">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#17352d] text-xs font-bold text-[#f3d7a3]">
                          {step.stepNumber}
                        </span>
                        <p className="text-xs leading-relaxed text-[#527066]">
                          {isVietnamese
                            ? (translatedSteps?.recipeId === selectedRecipe.id
                                ? translatedSteps.values[step.stepNumber]
                                : undefined) ||
                              translateStepInstruction(step.instruction, true)
                            : step.instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => startCookingRecipe(selectedRecipe)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#d97742] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#bf6132]"
                >
                  <Play className="size-4 fill-current" />
                  <span>{isVietnamese ? "Bắt đầu nấu với cử chỉ camera" : "Cook with Gestures Now"}</span>
                </button>

                <ShareRecipeButton recipe={selectedRecipe} isVietnamese={isVietnamese} className="py-3" />

                {selectedRecipe.videoUrl && (
                  <a
                    href={selectedRecipe.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#c5d2cc] bg-white px-4 py-3 text-xs font-semibold text-[#17352d] transition hover:bg-[#e4ece2]"
                  >
                    <Video className="size-4 text-red-600" />
                    <span>{isVietnamese ? "Xem video" : "Watch Video"}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {isVoiceGuideOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in"
            role="presentation"
            onClick={() => setIsVoiceGuideOpen(false)}
          >
            <div
              className="relative w-full max-w-lg rounded-3xl bg-[#fbfaf7] p-6 text-[#17352d] shadow-2xl sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-labelledby="voice-guide-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsVoiceGuideOpen(false)}
                aria-label={isVietnamese ? "Đóng hướng dẫn" : "Close guide"}
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white text-[#527066] shadow-sm transition hover:bg-[#e4ece2] hover:text-[#17352d]"
              >
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-4 pr-8">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff1df] text-[#d97742]"><Mic className="size-6" /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c56537]">{isVietnamese ? "Điều khiển bằng giọng nói" : "Voice control"}</p>
                  <h2 id="voice-guide-title" className="mt-1 font-serif text-3xl">{isVietnamese ? "Nấu ăn bằng lời nói" : "Cook with your voice"}</h2>
                </div>
              </div>
              <p className="mt-6 text-sm leading-6 text-[#527066]">{isVietnamese ? "Trợ lý giọng nói giúp bạn theo dõi công thức mà không cần chạm vào màn hình." : "The voice assistant helps you follow recipes without touching the screen."}</p>
              <div className="mt-6 space-y-3">
                {[
                  ["01", isVietnamese ? "Mở một công thức và vào chế độ Bếp rảnh tay." : "Open a recipe and enter Hands-free Mode."],
                  ["02", isVietnamese ? "Cho phép trình duyệt truy cập microphone khi được hỏi." : "Allow microphone access when your browser asks."],
                  ["03", isVietnamese ? "Nói “tiếp theo” để sang bước kế tiếp hoặc “quay lại” để xem bước trước." : "Say “next” for the next step or “back” to revisit the previous one."],
                  ["04", isVietnamese ? "Nói “hẹn giờ 5 phút” để bắt đầu bộ hẹn giờ nhanh." : "Say “set timer for 5 minutes” to start a quick timer."],
                ].map(([number, text]) => (
                  <div key={number} className="flex gap-3 rounded-2xl border border-[#dbe5dd] bg-white p-3.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#17352d] text-[11px] font-bold text-[#f3d7a3]">{number}</span>
                    <p className="text-sm leading-6 text-[#527066]">{text}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => { setIsVoiceGuideOpen(false); router.push("/playground") }}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d97742] text-sm font-semibold text-white transition hover:bg-[#bf6132]"
              >
                <Hand className="size-4" />
                {isVietnamese ? "Mở bếp rảnh tay" : "Open hands-free kitchen"}
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="relative mt-12 overflow-hidden border-t border-[#dbe5dd] bg-[#17352d] text-white">
        <div className="absolute -right-24 -top-28 size-72 rounded-full border-[32px] border-[#d97742]/20" />
        <div className="relative mx-auto max-w-7xl px-5 pb-7 pt-12 sm:px-8 lg:px-12">
          <div className="grid gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
            <div className="max-w-sm">
              <Link href="/" className="flex w-fit items-center gap-2 text-2xl font-semibold tracking-[-0.05em]"><span className="flex size-9 items-center justify-center rounded-full bg-[#f3d7a3] text-[#17352d]"><Leaf className="size-4" /></span>CookAI<span className="text-[#d97742]">.</span></Link>
              <p className="mt-4 text-sm leading-6 text-white/65">{isVietnamese ? "Một căn bếp bình tĩnh hơn cho những bữa ăn đáng nhớ hơn." : "A calmer kitchen for meals worth remembering."}</p>
              <Link href="/playground" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#f3d7a3] transition hover:text-white">{isVietnamese ? "Mở bếp rảnh tay" : "Open hands-free kitchen"}<ArrowRight className="size-4" /></Link>
            </div>
            <div><h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3d7a3]">{isVietnamese ? "Khám phá" : "Explore"}</h2><nav className="mt-4 flex flex-col items-start gap-3 text-sm text-white/65"><Link href="/smart-fridge" className="transition hover:text-white">{isVietnamese ? "Tủ lạnh thông minh" : "Smart Fridge"}</Link><Link href="/meal-plan" className="transition hover:text-white">{isVietnamese ? "Kế hoạch bữa ăn" : "Meal Planner"}</Link><Link href="/playground" className="transition hover:text-white">{isVietnamese ? "Bếp rảnh tay" : "Hands-free kitchen"}</Link></nav></div>
            <div><h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3d7a3]">{isVietnamese ? "Tài khoản" : "Your kitchen"}</h2><nav className="mt-4 flex flex-col items-start gap-3 text-sm text-white/65"><Link href="/profile" className="transition hover:text-white">{isVietnamese ? "Hồ sơ cá nhân" : "Profile"}</Link><button type="button" onClick={handleLogout} className="transition hover:text-white">{isVietnamese ? "Đăng xuất" : "Sign out"}</button></nav></div>
            <div><h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3d7a3]">{isVietnamese ? "Giữ liên lạc" : "Stay in touch"}</h2><p className="mt-4 text-sm leading-6 text-white/65">{isVietnamese ? "Có câu hỏi về căn bếp rảnh tay? Chúng tôi luôn sẵn sàng lắng nghe." : "Have a question about hands-free cooking? We would love to hear from you."}</p><a href="mailto:hello@touchlessrecipe.app" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-[#f3d7a3]"><Mail className="size-4 text-[#d97742]" />hello@touchlessrecipe.app</a></div>
          </div>
          <div className="flex flex-col gap-3 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between"><span>{isVietnamese ? "Nấu ăn khi đôi tay đang bận." : "Cook with your hands full."}</span><span>© 2026 Touchless Recipe</span></div>
        </div>
      </footer>
    </div>
  )
}
export default Dashboard
