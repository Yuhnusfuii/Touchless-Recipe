import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react"

export function MealPlanIntro({ isVietnamese }: { isVietnamese: boolean }) {
  return (
    <section className="relative isolate -mt-10 overflow-hidden rounded-[2rem] border border-[#31594c] bg-[#17352d] px-5 py-7 text-white shadow-[0_18px_45px_rgba(23,53,45,0.18)] sm:px-8 sm:py-9 lg:px-12 lg:py-11">
      <div className="absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-[#d97742]/25 blur-2xl" />
      <div className="absolute -bottom-32 left-1/3 -z-10 size-80 rounded-full bg-[#9fc7a8]/15 blur-3xl" />
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-2/5 opacity-20 sm:block [background-image:linear-gradient(#f3d7a3_1px,transparent_1px),linear-gradient(90deg,#f3d7a3_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_left,black,transparent)]" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f3d7a3]/30 bg-[#f3d7a3]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#f3d7a3]">
            <Sparkles className="size-3.5" />
            {isVietnamese ? "Bếp trưởng AI" : "AI kitchen planner"}
          </div>
          <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[0.98] sm:text-6xl">
            {isVietnamese
              ? "Ăn ngon hơn, nhẹ đầu hơn."
              : "Eat better. Think less."}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#dce8dc] sm:text-base sm:leading-7">
            {isVietnamese
              ? "Chọn ngày, buổi nấu và mục tiêu. AI sẽ biến những gì bạn có trong bếp thành một lịch ăn phong phú, dễ nấu và vừa vặn với nhịp sống."
              : "Choose your dates, cooking sessions, and goals. AI turns what is already in your kitchen into a varied, practical plan."}
          </p>
        </div>

        <div className="w-full max-w-xs rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm lg:mb-1">
          <div className="flex items-center justify-between text-[#f3d7a3]">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]">
              <CalendarDays className="size-4" />
              {isVietnamese ? "Bắt đầu từ đây" : "Start here"}
            </span>
            <ArrowUpRight className="size-4" />
          </div>
          <p className="mt-3 text-sm leading-6 text-white/80">
            {isVietnamese
              ? "Điền thông tin bên dưới để tạo thực đơn riêng cho bạn."
              : "Fill in the details below to build your personal menu."}
          </p>
        </div>
      </div>
    </section>
  )
}
