"use client"

import { ArrowRight, ChefHat, CircleCheck, Hand, Leaf, Mail, Mic, Play, Rss, Sparkles, TimerReset } from "lucide-react"
import Link from "next/link"

import { HeroGallery } from "@/components/hero-gallery"
import { useLanguage } from "@/components/language-provider"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const { setLanguage, isVietnamese, t } = useLanguage()
  const steps = [
    ["01", Hand, t("keepHands"), t("keepHandsDescription")],
    ["02", Mic, t("askCooking"), t("askCookingDescription")],
    ["03", TimerReset, t("timing"), t("timingDescription")],
  ] as const

  return (
    <div className="min-h-screen overflow-hidden bg-[#fbfaf7] text-[#17352d]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-[-0.04em]"><span className="flex size-8 items-center justify-center rounded-full bg-[#17352d] text-[#f3d7a3]"><Leaf aria-hidden="true" className="size-4" /></span>mise<span className="text-[#d97742]">.</span></Link>
        <nav className="hidden items-center gap-8 text-sm text-[#527066] md:flex"><a href="#how-it-works" className="hover:text-[#17352d]">{t("howItWorks")}</a><a href="#kitchen" className="hover:text-[#17352d]">{t("upgradedKitchen")}</a><a href="#stories" className="hover:text-[#17352d]">{t("stories")}</a></nav>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-[#c5d2cc] bg-white p-0.5 text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={() => setLanguage("vi")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 transition",
                isVietnamese
                  ? "bg-[#17352d] text-white shadow-xs"
                  : "text-[#527066] hover:text-[#17352d]"
              )}
            >
              <span>🇻🇳</span>
              <span>VI</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 transition",
                !isVietnamese
                  ? "bg-[#17352d] text-white shadow-xs"
                  : "text-[#527066] hover:text-[#17352d]"
              )}
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>
          <Link
            className={cn(
              buttonVariants({ size: "sm" }),
              "border-[#d97742] bg-[#fff1df] text-[#a94f27] shadow-[0_4px_12px_rgba(217,119,66,0.14)] hover:border-[#c56537] hover:bg-[#d97742] hover:text-white"
            )}
            href="/login"
          >
            {t("tryKitchen")} <ArrowRight aria-hidden="true" />
          </Link>
          <Link
            href="/feed"
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "size-8 gap-1.5 border-[#c5d2cc] px-0 text-[#527066] hover:border-[#d97742] hover:text-[#d97742] sm:h-9 sm:w-auto sm:px-3"
            )}
          >
            <Rss aria-hidden="true" className="size-3.5" />
            <span className="hidden sm:inline">{isVietnamese ? "Feed cộng đồng" : "Community Feed"}</span>
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-12 lg:pb-32"><div className="relative z-10"><p className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.16em] text-[#c56537]"><Sparkles aria-hidden="true" className="size-4" /> {t("calmerCooking")}</p><h1 className="max-w-2xl font-serif text-[3.5rem] leading-[0.97] tracking-[-0.06em] sm:text-7xl lg:text-[6.5rem]">{t("heroTitle")}</h1><p className="mt-7 max-w-lg text-base leading-7 text-[#527066] sm:text-lg">{t("heroDescription")}</p><div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"><Link className={cn(buttonVariants({ size: "lg" }), "bg-[#d97742] text-white hover:bg-[#bf6132]")} href="/playground">{t("startCooking")} <ArrowRight aria-hidden="true" /></Link><a className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-[#527066]" href="#how-it-works"><span className="flex size-8 items-center justify-center rounded-full border border-[#c5d2cc]"><Play aria-hidden="true" className="ml-0.5 size-3 fill-current" /></span> {t("seeHow")}</a></div><div className="mt-12 flex items-center gap-3 text-sm text-[#527066]"><div className="flex -space-x-2"><span className="flex size-8 items-center justify-center rounded-full border-2 border-[#fbfaf7] bg-[#e7b16e] text-xs">JM</span><span className="flex size-8 items-center justify-center rounded-full border-2 border-[#fbfaf7] bg-[#a9c2a5] text-xs">AK</span><span className="flex size-8 items-center justify-center rounded-full border-2 border-[#fbfaf7] bg-[#d9a2a2] text-xs">SL</span></div><span><strong className="text-[#17352d]">2,000+</strong> {t("cooksFlow")}</span></div></div><HeroGallery /></section>

        <section id="how-it-works" className="border-y border-[#dbe5dd] bg-[#f1f5ef]"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><p className="text-sm font-medium uppercase tracking-[0.16em] text-[#c56537]">{t("simplePart")}</p><h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.05em] sm:text-5xl">{t("fewerInterruptions")}</h2></div><div className="grid gap-8 sm:grid-cols-3">{steps.map(([number, Icon, title, description]) => <div key={number} className="border-t border-[#c5d2cc] pt-4"><div className="flex items-center justify-between text-sm text-[#c56537]"><span>{number}</span><Icon aria-hidden="true" className="size-5" /></div><h3 className="mt-8 text-lg font-semibold tracking-tight">{title}</h3><p className="mt-3 text-sm leading-6 text-[#527066]">{description}</p></div>)}</div></div></div></section>

        <section id="kitchen" className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-12 lg:py-32"><div className="relative order-2 h-[440px] overflow-hidden rounded-[1.5rem] bg-[#17352d] p-5 text-white sm:h-[520px] sm:p-8 lg:order-1"><div className="absolute -right-24 -top-24 size-72 rounded-full border-[36px] border-[#d97742]/40" /><div className="relative flex h-full flex-col justify-between rounded-xl border border-white/15 bg-white/5 p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-[#f3d7a3]">{t("tonightsRecipe")}</p><h3 className="mt-2 text-xl font-semibold">Miso butter noodles</h3></div><span className="rounded-full bg-[#d97742] px-3 py-1 text-xs">Easy</span></div><div><p className="text-sm text-white/60">{t("step02")}</p><p className="mt-3 max-w-sm font-serif text-3xl leading-tight sm:text-4xl">Warm the butter, miso, and garlic until glossy.</p><div className="mt-8 flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-full bg-[#f3d7a3] text-[#17352d]"><Mic aria-hidden="true" className="size-5" /></span><span className="text-sm text-white/70">{t("sayNext")}</span></div></div><div className="flex items-center justify-between border-t border-white/15 pt-4 text-xs text-white/60"><span>12 min remaining</span><span>2 servings</span></div></div></div><div className="order-1 lg:order-2"><p className="text-sm font-medium uppercase tracking-[0.16em] text-[#c56537]">{t("upgradedKitchen")}</p><h2 className="mt-4 max-w-xl font-serif text-4xl leading-[1.05] tracking-[-0.05em] sm:text-6xl">{t("technologyTitle")}</h2><p className="mt-6 max-w-lg leading-7 text-[#527066]">{t("technologyDescription")}</p><ul className="mt-8 space-y-4 text-sm text-[#527066]"><li className="flex items-center gap-3"><CircleCheck aria-hidden="true" className="size-5 text-[#d97742]" /> {t("recipesAdapt")}</li><li className="flex items-center gap-3"><CircleCheck aria-hidden="true" className="size-5 text-[#d97742]" /> {t("voiceGesture")}</li><li className="flex items-center gap-3"><CircleCheck aria-hidden="true" className="size-5 text-[#d97742]" /> {t("timersNever")}</li></ul><Link className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-9")} href="/playground">{t("explorePlayground")} <ArrowRight aria-hidden="true" /></Link></div></section>

        <section id="stories" className="bg-[#e4ece2]"><div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-24"><ChefHat aria-hidden="true" className="mx-auto size-7 text-[#d97742]" /><blockquote className="mx-auto mt-5 max-w-4xl font-serif text-3xl leading-tight tracking-[-0.04em]">&ldquo;{t("testimonial")}&rdquo;</blockquote><p className="mt-6 text-sm text-[#527066]">{t("testimonialBy")}</p></div></section>
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="flex flex-col items-start justify-between gap-8 rounded-[1.5rem] bg-[#d97742] p-7 text-white sm:p-12 lg:flex-row lg:items-end"><div><p className="text-sm font-medium uppercase tracking-[0.16em] text-[#ffe8c7]">{t("makeRoom")}</p><h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-[-0.05em] sm:text-6xl">{t("nextMeal")}</h2></div><Link className={cn(buttonVariants({ size: "lg" }), "shrink-0 bg-[#17352d] text-white hover:bg-[#254b40]")} href="/playground">{t("openMise")} <ArrowRight aria-hidden="true" /></Link></div></section>
      </main>
      <footer className="relative overflow-hidden border-t border-[#dbe5dd] bg-[#17352d] text-white">
        <div className="absolute -right-24 -top-28 size-72 rounded-full border-[32px] border-[#d97742]/20" />
        <div className="absolute -bottom-36 left-[38%] size-72 rounded-full border border-[#f3d7a3]/10" />
        <div className="relative mx-auto max-w-7xl px-5 pb-7 pt-14 sm:px-8 lg:px-12 lg:pt-18">
          <div className="grid gap-12 border-b border-white/15 pb-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
            <div className="max-w-sm">
              <Link href="/" className="flex w-fit items-center gap-2 text-2xl font-semibold tracking-[-0.05em]">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#f3d7a3] text-[#17352d]"><Leaf aria-hidden="true" className="size-4" /></span>
                mise<span className="text-[#d97742]">.</span>
              </Link>
              <p className="mt-5 text-sm leading-6 text-white/65">{isVietnamese ? "Một căn bếp bình tĩnh hơn cho những bữa ăn đáng nhớ hơn." : "A calmer kitchen for meals worth remembering."}</p>
              <Link href="/playground" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f3d7a3] transition hover:text-white">{isVietnamese ? "Mở bếp thử nghiệm" : "Open the kitchen playground"}<ArrowRight aria-hidden="true" className="size-4" /></Link>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3d7a3]">{isVietnamese ? "Khám phá" : "Explore"}</h2>
              <nav className="mt-5 flex flex-col items-start gap-3 text-sm text-white/65">
                <a href="#how-it-works" className="transition hover:text-white">{t("howItWorks")}</a>
                <a href="#kitchen" className="transition hover:text-white">{t("upgradedKitchen")}</a>
                <a href="#stories" className="transition hover:text-white">{t("stories")}</a>
                <Link href="/meal-plan" className="transition hover:text-white">{isVietnamese ? "Lập kế hoạch ăn" : "Meal planner"}</Link>
              </nav>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3d7a3]">{isVietnamese ? "Tài khoản" : "Your kitchen"}</h2>
              <nav className="mt-5 flex flex-col items-start gap-3 text-sm text-white/65">
                <Link href="/login" className="transition hover:text-white">{isVietnamese ? "Đăng nhập" : "Sign in"}</Link>
                <Link href="/register" className="transition hover:text-white">{isVietnamese ? "Tạo tài khoản" : "Create account"}</Link>
                <Link href="/profile" className="transition hover:text-white">{isVietnamese ? "Hồ sơ" : "Profile"}</Link>
              </nav>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3d7a3]">{isVietnamese ? "Giữ liên lạc" : "Stay in touch"}</h2>
              <p className="mt-5 text-sm leading-6 text-white/65">{isVietnamese ? "Có câu hỏi về căn bếp rảnh tay? Chúng tôi luôn sẵn sàng lắng nghe." : "Have a question about hands-free cooking? We would love to hear from you."}</p>
              <a href="mailto:hello@touchlessrecipe.app" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-[#f3d7a3]"><Mail aria-hidden="true" className="size-4 text-[#d97742]" />hello@touchlessrecipe.app</a>
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <span>{t("cookHandsFull")}</span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2"><span>© 2026 Touchless Recipe</span><span>{isVietnamese ? "Được làm cho những người thích nấu ăn." : "Made for people who love to cook."}</span></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
