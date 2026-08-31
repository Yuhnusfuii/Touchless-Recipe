"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Check, Clock3 } from "lucide-react"

import { useLanguage } from "@/components/language-provider"

const slides = [
  {
    image: "/images/sesame-soba.jpg",
    title: "Sesame soba noodles",
    cue: "Add the greens, then give it a gentle stir.",
    cueVi: "Thêm rau xanh rồi đảo nhẹ tay.",
    step: "Step 04 of 06",
    stepVi: "Bước 04 / 06",
  },
  {
    image: "/images/market-garden-salad.jpg",
    title: "Market garden salad",
    cue: "Dress the leaves just before serving.",
    cueVi: "Trộn sốt ngay trước khi dùng.",
    step: "Step 05 of 06",
    stepVi: "Bước 05 / 06",
  },
  {
    image: "/images/roasted-harvest-bowl.jpg",
    title: "Roasted harvest bowl",
    cue: "Finish with herbs and a squeeze of lemon.",
    cueVi: "Hoàn thiện với rau thơm và chút chanh.",
    step: "Step 06 of 06",
    stepVi: "Bước 06 / 06",
  },
]

export function HeroGallery() {
  const { language, t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const activeSlide = slides[activeIndex]

  useEffect(() => {
    if (isPaused) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [isPaused])

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % slides.length)
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null
    setIsPaused(true)
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return

    const distance = event.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(distance) > 45) {
      if (distance < 0) {
        showNext()
      } else {
        showPrevious()
      }
    }
    touchStartX.current = null
    setIsPaused(false)
  }

  return (
    <div
      className="relative min-h-[470px] sm:min-h-[580px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 rounded-[2rem] bg-[#e4ece2] lg:rotate-3" />
      <div
        className="relative h-[470px] overflow-hidden rounded-[2rem] bg-cover bg-center shadow-[12px_18px_0_#d97742] transition-[background-image] duration-500 sm:h-[580px]"
        style={{ backgroundImage: `url('${activeSlide.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#17352d]/75 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-5 right-5 rounded-xl border border-white/30 bg-white/90 p-4 backdrop-blur sm:bottom-8 sm:left-8 sm:right-8">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-[#c56537]"><span>{t("handsFree")}</span><span className="flex items-center gap-1 text-[#527066]"><Check aria-hidden="true" className="size-3.5" /> {t("on")}</span></div>
          <p className="mt-3 text-lg font-semibold text-[#17352d] sm:text-xl">“{language === "vi" ? activeSlide.cueVi : activeSlide.cue}”</p>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#dbe5dd]"><div className="h-full rounded-full bg-[#d97742] transition-all duration-500" style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }} /></div>
          <div className="mt-2 flex justify-between text-xs text-[#527066]"><span>{language === "vi" ? activeSlide.stepVi : activeSlide.step}</span><span>{activeSlide.title}</span></div>
        </div>
      </div>
      <div className="absolute -right-3 top-10 hidden rounded-xl border border-[#d6e1d8] bg-[#fbfaf7] p-4 shadow-xl sm:block lg:-right-10"><div className="flex items-center gap-2 text-xs text-[#527066]"><Clock3 aria-hidden="true" className="size-4 text-[#d97742]" /> {t("nextTimer")}</div><p className="mt-1 text-2xl font-semibold text-[#17352d]">02:40</p></div>
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#17352d]/85 px-2 py-1.5 backdrop-blur sm:bottom-4">
        <button type="button" aria-label={t("previousImage")} onClick={showPrevious} className="flex size-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"><ArrowLeft aria-hidden="true" className="size-4" /></button>
        {slides.map((slide, index) => <button key={slide.title} type="button" aria-label={`${t("showImage")} ${index + 1}`} onClick={() => setActiveIndex(index)} className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-6 bg-[#f3d7a3]" : "w-1.5 bg-white/50"}`} />)}
        <button type="button" aria-label={t("nextImage")} onClick={showNext} className="flex size-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"><ArrowRight aria-hidden="true" className="size-4" /></button>
      </div>
    </div>
  )
}