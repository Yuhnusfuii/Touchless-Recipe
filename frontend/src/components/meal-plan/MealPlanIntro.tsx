import { Sparkles } from "lucide-react"

export function MealPlanIntro({ isVietnamese }: { isVietnamese: boolean }) {
  return <div className="max-w-3xl"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d97742]"><Sparkles className="size-4" />{isVietnamese ? "Bếp trưởng AI" : "AI kitchen planner"}</div><h1 className="mt-3 font-serif text-4xl leading-tight tracking-[-0.05em] sm:text-6xl">{isVietnamese ? "Lên kế hoạch ăn ngon, vừa vặn với cuộc sống." : "A meal plan that fits real life."}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#527066]">{isVietnamese ? "Cho AI biết khoảng thời gian, mục tiêu và những gì bạn đang có. Bạn sẽ nhận được lịch ăn rõ ràng, thực tế và dễ nấu." : "Tell AI your dates, goals, and what is already in your kitchen. Get a practical, cookable plan."}</p></div>
}
