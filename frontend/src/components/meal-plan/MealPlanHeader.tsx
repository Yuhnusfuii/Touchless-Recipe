import { ArrowLeft, CookingPot } from "lucide-react"
import Link from "next/link"

export function MealPlanHeader({ isVietnamese }: { isVietnamese: boolean }) {
  return <header className="border-b border-[#dbe5dd] bg-[#f8f7f2]/95"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12"><Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-[-0.04em]"><span className="flex size-8 items-center justify-center rounded-full bg-[#17352d] text-[#f3d7a3]"><CookingPot className="size-4" /></span>mise<span className="text-[#d97742]">.</span></Link><Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#527066] hover:text-[#d97742]"><ArrowLeft className="size-4" />{isVietnamese ? "Về trang chủ" : "Back home"}</Link></div></header>
}
