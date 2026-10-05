import { ArrowLeft, Hand, Leaf, LogOut } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ProfileHeaderProps = {
  isVietnamese: boolean
  onLanguageChange: (language: "vi" | "en") => void
  onLogout: () => void
}

export function ProfileHeader({ isVietnamese, onLanguageChange, onLogout }: ProfileHeaderProps) {
  return <header className="sticky top-0 z-30 border-b border-[#dbe5dd] bg-[#fbfaf7]/90 backdrop-blur-md"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 lg:px-12"><div className="flex items-center gap-3"><Link href="/" className="flex items-center gap-1.5 rounded-lg border border-[#c5d2cc] bg-white px-3 py-1.5 text-xs font-semibold text-[#17352d] shadow-2xs transition hover:border-[#d97742] hover:bg-[#e4ece2]"><ArrowLeft className="size-3.5" /><span>{isVietnamese ? "Về trang chủ" : "Dashboard"}</span></Link><div className="hidden h-5 w-px bg-[#dbe5dd] sm:block" /><Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-[-0.04em]"><span className="flex size-7 items-center justify-center rounded-full bg-[#17352d] text-[#f3d7a3]"><Leaf className="size-3.5" /></span>CookAI<span className="text-[#d97742]">.</span></Link></div><div className="flex items-center gap-3"><div className="flex items-center rounded-lg border border-[#c5d2cc] bg-white p-0.5 text-xs font-semibold shadow-2xs"><button type="button" onClick={() => onLanguageChange("vi")} className={cn("flex items-center gap-1 rounded-md px-2.5 py-1 transition", isVietnamese ? "bg-[#17352d] text-white shadow-xs" : "text-[#527066] hover:text-[#17352d]")}><span>🇻🇳</span><span>VI</span></button><button type="button" onClick={() => onLanguageChange("en")} className={cn("flex items-center gap-1 rounded-md px-2.5 py-1 transition", !isVietnamese ? "bg-[#17352d] text-white shadow-xs" : "text-[#527066] hover:text-[#17352d]")}><span>🇬🇧</span><span>EN</span></button></div><Link href="/playground" className={cn(buttonVariants({ size: "sm" }), "gap-1.5 border-[#d97742] bg-[#d97742] text-white shadow-sm hover:bg-[#bf6132]")}><Hand className="size-3.5" /><span>{isVietnamese ? "Bếp rảnh tay" : "Hands-free Mode"}</span></Link><Button variant="ghost" size="icon" onClick={onLogout} title={isVietnamese ? "Đăng xuất" : "Logout"} className="size-8 text-[#527066] hover:bg-[#ffebee] hover:text-red-600"><LogOut className="size-4" /></Button></div></div></header>
}
