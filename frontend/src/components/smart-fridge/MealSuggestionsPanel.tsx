import { ChefHat, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { MealFilters, MealSuggestion } from "@/lib/api"

type MealSuggestionsPanelProps = {
  isVietnamese: boolean
  isSuggesting: boolean
  suggestionError: string | null
  mealSuggestions: MealSuggestion[]
  mealFilters: MealFilters
  allergyInput: string
  completedMealIds: string[]
  onSuggestMeals: () => void
  onMealTypeChange: (value: MealFilters["mealType"]) => void
  onHighProteinChange: (value: boolean) => void
  onAllergyChange: (value: string) => void
  onStartCooking: (meal: MealSuggestion) => void
}

export function MealSuggestionsPanel({
  isVietnamese,
  isSuggesting,
  suggestionError,
  mealSuggestions,
  mealFilters,
  allergyInput,
  completedMealIds,
  onSuggestMeals,
  onMealTypeChange,
  onHighProteinChange,
  onAllergyChange,
  onStartCooking,
}: MealSuggestionsPanelProps) {
  return (
    <section className="mt-8 rounded-2xl border border-[#dbe5dd] bg-[#f1f5ef] p-5 shadow-sm sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-[#d97742]"><ChefHat className="size-5" /><h2 className="font-serif text-2xl">{isVietnamese ? "Gợi ý món ăn từ nguyên liệu" : "Meal ideas from your ingredients"}</h2></div><p className="mt-2 text-sm text-[#527066]">{isVietnamese ? "AI sẽ ưu tiên những nguyên liệu bạn đã nhận diện hoặc lưu trong tủ lạnh." : "AI will prioritize the ingredients detected or saved in your fridge."}</p></div><Button onClick={onSuggestMeals} disabled={isSuggesting} className="gap-2 bg-[#17352d] text-white hover:bg-[#254b40]"><ChefHat className="size-4" />{isSuggesting ? (isVietnamese ? "Đang đề xuất..." : "Thinking...") : (isVietnamese ? "Đề xuất ngay" : "Suggest now")}</Button></div>
      <div className="mt-6 rounded-xl border border-[#dbe5dd] bg-white p-4">
        <div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-lg bg-[#fff1df] text-[#d97742]"><Utensils className="size-4" /></span><div><h3 className="font-semibold">{isVietnamese ? "Bộ lọc món ăn" : "Meal filters"}</h3><p className="text-xs text-[#527066]">{isVietnamese ? "Chọn tiêu chí trước khi yêu cầu AI đề xuất." : "Choose your preferences before asking AI."}</p></div></div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_1.4fr]">
          <label className="text-sm font-semibold text-[#17352d]">{isVietnamese ? "Loại món" : "Meal type"}<select value={mealFilters.mealType} onChange={(event) => onMealTypeChange(event.target.value as MealFilters["mealType"])} className="mt-2 h-10 w-full rounded-lg border border-[#c5d2cc] bg-white px-3 text-sm font-normal outline-none focus:border-[#d97742]"><option value="none">{isVietnamese ? "Không kiêng / đa dạng" : "No restriction / varied"}</option><option value="vegetarian">{isVietnamese ? "Món ăn chay" : "Vegetarian"}</option><option value="savory">{isVietnamese ? "Món mặn" : "Savory"}</option><option value="sweet">{isVietnamese ? "Món ngọt" : "Sweet"}</option></select></label>
          <label className="flex items-start gap-3 rounded-lg border border-[#dbe5dd] p-3 text-sm font-semibold"><input type="checkbox" checked={mealFilters.highProtein} onChange={(event) => onHighProteinChange(event.target.checked)} className="mt-0.5 size-4 accent-[#d97742]" /><span>{isVietnamese ? "Giàu đạm" : "High protein"}<span className="mt-1 block text-xs font-normal text-[#527066]">{isVietnamese ? "Ưu tiên thịt, cá, trứng, đậu." : "Prioritize meat, fish, eggs, or beans."}</span></span></label>
          <label className="text-sm font-semibold text-[#17352d]">{isVietnamese ? "Dị ứng với nguyên liệu gì?" : "Allergies to exclude"}<input value={allergyInput} onChange={(event) => onAllergyChange(event.target.value)} placeholder={isVietnamese ? "Ví dụ: đậu phộng, sữa, tôm (cách nhau bằng dấu phẩy)" : "e.g. peanuts, milk, shrimp (comma separated)"} className="mt-2 h-10 w-full rounded-lg border border-[#c5d2cc] bg-white px-3 text-sm font-normal outline-none focus:border-[#d97742]" /></label>
        </div>
        <p className="mt-3 text-xs text-[#527066]">{isVietnamese ? "Không kiêng: AI sẽ đề xuất đa dạng món ăn, nhưng vẫn loại trừ dị ứng bạn đã ghi." : "No restriction: AI suggests varied meals while still excluding listed allergies."}</p>
      </div>
      {suggestionError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{suggestionError}</p>}
      {mealSuggestions.length > 0 && <div className="mt-6 grid gap-4 lg:grid-cols-2">{mealSuggestions.map((meal, index) => { const mealId = `ai-${meal.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`; const isCompleted = completedMealIds.includes(mealId); return <article key={`${meal.name}-${index}`} className="rounded-xl border border-[#dbe5dd] bg-white p-5"><div className="flex items-start justify-between gap-3"><h3 className="text-xl font-semibold">{meal.name}</h3>{isCompleted && <span className="rounded-full bg-[#e4ece2] px-2.5 py-1 text-xs font-semibold text-[#527066]">{isVietnamese ? "Đã nấu xong" : "Cooked"}</span>}</div><p className="mt-2 text-sm leading-6 text-[#527066]">{meal.description}</p><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><p className="font-semibold text-[#17352d]">{isVietnamese ? "Đang có" : "Available"}</p><p className="mt-1 text-[#527066]">{meal.availableIngredients.join(", ") || "-"}</p></div><div><p className="font-semibold text-[#c56537]">{isVietnamese ? "Cần thêm" : "Buy"}</p><p className="mt-1 text-[#527066]">{meal.missingIngredients.join(", ") || (isVietnamese ? "Không cần thêm" : "Nothing extra")}</p></div></div><ol className="mt-4 space-y-2 border-t border-[#e4ece2] pt-4 text-sm text-[#527066]">{meal.instructions.map((instruction, stepIndex) => <li key={`${stepIndex}-${instruction}`} className="flex gap-2"><span className="font-semibold text-[#d97742]">{stepIndex + 1}.</span><span>{instruction}</span></li>)}</ol><Button onClick={() => onStartCooking(meal)} className="mt-5 w-full gap-2 bg-[#d97742] text-white hover:bg-[#bf6132]"><ChefHat className="size-4" />{isVietnamese ? "Nấu ăn món này" : "Cook this meal"}</Button></article> })}</div>}
      {!isSuggesting && !suggestionError && mealSuggestions.length === 0 && <p className="mt-5 text-sm text-[#527066]">{isVietnamese ? "Hãy nhận diện hoặc thêm nguyên liệu để nhận gợi ý." : "Detect or add ingredients to get meal ideas."}</p>}
    </section>
  )
}