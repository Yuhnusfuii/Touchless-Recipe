import { ArrowLeft, Snowflake } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SmartFridgeHeader({ isVietnamese }: { isVietnamese: boolean }) {
  return <header className="border-b border-[#dbe5dd] bg-[#fbfaf7]"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12"><Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-[-0.04em]"><span className="flex size-8 items-center justify-center rounded-full bg-[#17352d] text-[#f3d7a3]"><Snowflake className="size-4" /></span>mise<span className="text-[#d97742]">.</span></Link><Link href="/" className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-2 border-[#c5d2cc] text-[#527066]")}><ArrowLeft className="size-4" />{isVietnamese ? "Về trang chủ" : "Back to dashboard"}</Link></div></header>
}
