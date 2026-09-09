import { ArrowLeft, CircleCheck, Snowflake } from "lucide-react"
import Link from "next/link"

export function SmartFridgeHeader({ isVietnamese }: { isVietnamese: boolean }) {
  return (
    <header className="bg-[#17352d] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#b7d8c0] text-[#17352d] shadow-[4px_4px_0_#d97742]">
            <Snowflake className="size-4" />
          </span>
          <span className="text-lg font-bold tracking-[-0.04em]">
            mise<span className="text-[#f3a477]">.</span>
          </span>
          <span className="hidden border-l border-white/20 pl-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#b9d1bd] sm:block">
            {isVietnamese ? "Tủ lạnh thông minh" : "Smart fridge"}
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-[#b7d8c0]/25 bg-[#b7d8c0]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#b7d8c0] sm:flex">
            <CircleCheck className="size-3.5" />
            {isVietnamese ? "AI sẵn sàng" : "AI ready"}
          </span>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-[#f4eee2] transition hover:border-[#f3d7a3]/60 hover:bg-white/15"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">{isVietnamese ? "Về trang chủ" : "Back home"}</span>
            <span className="sm:hidden">{isVietnamese ? "Trang chủ" : "Home"}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
