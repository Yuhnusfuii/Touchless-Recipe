"use client"

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react"

export type Language = "en" | "vi"

type TranslationKey =
  | "tryKitchen" | "howItWorks" | "upgradedKitchen" | "stories" | "calmerCooking"
  | "heroTitle" | "heroDescription" | "startCooking" | "seeHow" | "cooksFlow"
  | "handsFree" | "on" | "nextTimer" | "simplePart" | "fewerInterruptions"
  | "keepHands" | "keepHandsDescription" | "askCooking" | "askCookingDescription"
  | "timing" | "timingDescription" | "tonightsRecipe" | "step02" | "sayNext"
  | "recipesAdapt" | "voiceGesture" | "timersNever" | "technologyTitle"
  | "technologyDescription" | "explorePlayground" | "testimonial" | "testimonialBy"
  | "makeRoom" | "nextMeal" | "openMise" | "cookHandsFull" | "previousImage"
  | "nextImage" | "showImage" | "gestureKitchen" | "playgroundTitle" | "visionGestures"
  | "voiceControl" | "aiAssistant" | "loadingMediaPipe" | "detectedGesture" | "waitingGesture"
  | "handGuide" | "handDistance" | "swipeHorizontal" | "scrollVertical" | "listening"
  | "startRecognition" | "recognitionLog" | "sayNextStep" | "speaking" | "testSpeech"
  | "unsupportedSpeech" | "unsupportedTts" | "recognized" | "commandNext"

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    tryKitchen: "Try the kitchen", howItWorks: "How it works", upgradedKitchen: "Your kitchen, upgraded", stories: "Stories", calmerCooking: "A calmer way to cook",
    heroTitle: "Dinner is better when you stay in the moment.", heroDescription: "Touchless Recipe brings your recipes to life with voice, vision, and just enough intelligence to make cooking feel natural.", startCooking: "Start cooking", seeHow: "See how it works", cooksFlow: "home cooks in the flow",
    handsFree: "Hands-free mode", on: "On", nextTimer: "Next timer", simplePart: "The simple part", fewerInterruptions: "Good food, fewer interruptions.", keepHands: "Keep your hands moving", keepHandsDescription: "Swipe through each step without touching your screen or washing your hands again.", askCooking: "Ask as you cook", askCookingDescription: "Say what you need. Your kitchen companion keeps up with the rhythm of your recipe.", timing: "Let the timing happen", timingDescription: "Smart timers surface at the right moment, so nothing gets forgotten on the stove.", tonightsRecipe: "Tonight's recipe", step02: "Step 02", sayNext: "Say “next” to keep going", recipesAdapt: "Recipes that adapt to your pace", voiceGesture: "Voice and gesture controls built in", timersNever: "Timers that never lose their place", technologyTitle: "Technology that knows when to get out of the way.", technologyDescription: "From the first chop to the final garnish, CookAI keeps useful information close and distractions somewhere else.", explorePlayground: "Explore the playground", testimonial: "It feels less like following instructions and more like having a calm friend in the kitchen.", testimonialBy: "— Lina M., home cook and weeknight improviser", makeRoom: "Make room for the good part", nextMeal: "Your next favorite meal starts here.", openMise: "Open CookAI", cookHandsFull: "Cook with your hands full.", previousImage: "Previous image", nextImage: "Next image", showImage: "Show image", gestureKitchen: "Gesture kitchen", playgroundTitle: "AI Playground & Proof of Concept", visionGestures: "Vision & Gestures", voiceControl: "Voice Control", aiAssistant: "AI Assistant (TTS)", loadingMediaPipe: "Loading MediaPipe...", detectedGesture: "Detected gesture:", waitingGesture: "Waiting for gesture...", handGuide: "Hand positioning guide:", handDistance: "Keep your hand about 30-50cm from the camera.", swipeHorizontal: "Swipe Left / Right: Open your palm and swipe horizontally.", scrollVertical: "Scroll Up / Down: Point your index and middle fingers upward, then swipe vertically.", listening: "Listening...", startRecognition: "Start voice recognition", recognitionLog: "Result log (try saying “next step”):", sayNextStep: "Next step", speaking: "Reading aloud...", testSpeech: "Test recipe reading", unsupportedSpeech: "This browser does not support Speech Recognition", unsupportedTts: "This browser does not support Text-to-Speech", recognized: "Heard", commandNext: "COMMAND: Moving to the next step!",
  },
  vi: {
    tryKitchen: "Thử vào bếp", howItWorks: "Cách hoạt động", upgradedKitchen: "Nâng cấp căn bếp", stories: "Câu chuyện", calmerCooking: "Nấu ăn nhẹ nhàng hơn",
    heroTitle: "Bữa tối ngon hơn khi bạn sống trọn trong khoảnh khắc.", heroDescription: "Touchless Recipe đưa công thức vào nhịp nấu của bạn bằng giọng nói, thị giác và AI vừa đủ thông minh để mọi thứ trở nên tự nhiên.", startCooking: "Bắt đầu nấu", seeHow: "Xem cách hoạt động", cooksFlow: "người nấu đang tận hưởng",
    handsFree: "Chế độ rảnh tay", on: "Đang bật", nextTimer: "Hẹn giờ tiếp theo", simplePart: "Đơn giản thôi", fewerInterruptions: "Món ngon, ít gián đoạn hơn.", keepHands: "Cứ để đôi tay chuyển động", keepHandsDescription: "Lướt qua từng bước mà không cần chạm màn hình hay rửa tay lại.", askCooking: "Hỏi ngay khi đang nấu", askCookingDescription: "Nói điều bạn cần. Trợ lý bếp sẽ theo kịp nhịp điệu công thức.", timing: "Để thời gian tự lên tiếng", timingDescription: "Hẹn giờ thông minh xuất hiện đúng lúc để bạn không bỏ quên món trên bếp.", tonightsRecipe: "Công thức tối nay", step02: "Bước 02", sayNext: "Nói “tiếp theo” để tiếp tục", recipesAdapt: "Công thức thích ứng với nhịp của bạn", voiceGesture: "Điều khiển bằng giọng nói và cử chỉ", timersNever: "Hẹn giờ luôn giữ đúng tiến độ", technologyTitle: "Công nghệ biết lúc nào nên lùi lại.", technologyDescription: "Từ nhát dao đầu tiên đến lớp rau thơm cuối cùng, CookAI giữ thông tin cần thiết ở gần và xao nhãng ở xa.", explorePlayground: "Khám phá bếp thử nghiệm", testimonial: "Cảm giác không còn là làm theo hướng dẫn, mà như có một người bạn bình tĩnh bên cạnh trong bếp.", testimonialBy: "— Lina M., người nấu ăn tại gia", makeRoom: "Dành chỗ cho điều đáng nhớ", nextMeal: "Món yêu thích tiếp theo bắt đầu từ đây.", openMise: "Mở CookAI", cookHandsFull: "Nấu ăn khi đôi tay đang bận.", previousImage: "Ảnh trước", nextImage: "Ảnh tiếp theo", showImage: "Hiển thị ảnh", gestureKitchen: "Bếp cử chỉ", playgroundTitle: "AI Playground & Bản thử nghiệm", visionGestures: "Thị giác & Cử chỉ", voiceControl: "Điều khiển giọng nói", aiAssistant: "Trợ lý AI (TTS)", loadingMediaPipe: "Đang tải MediaPipe...", detectedGesture: "Cử chỉ nhận diện được:", waitingGesture: "Đang chờ cử chỉ...", handGuide: "Hướng dẫn đặt tay:", handDistance: "Giữ tay cách camera khoảng 30-50cm.", swipeHorizontal: "Vuốt Trái / Phải: Xòe lòng bàn tay và vuốt ngang.", scrollVertical: "Cuộn Lên / Xuống: Chĩa ngón trỏ và giữa lên rồi vuốt dọc.", listening: "Đang nghe...", startRecognition: "Bắt đầu nhận diện giọng nói", recognitionLog: "Log kết quả (thử nói “bước tiếp theo”):", sayNextStep: "Bước tiếp theo", speaking: "Đang đọc...", testSpeech: "Thử đọc công thức", unsupportedSpeech: "Trình duyệt không hỗ trợ nhận diện giọng nói", unsupportedTts: "Trình duyệt không hỗ trợ đọc văn bản", recognized: "Đã nghe", commandNext: "LỆNH: Chuyển sang bước tiếp theo!",
  },
}

type LanguageContextValue = {
  language: Language
  isVietnamese: boolean
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function subscribeLanguage(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener("touchless-language-change", callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener("touchless-language-change", callback)
  }
}

function getLanguageSnapshot(): Language {
  const saved = localStorage.getItem("touchless-recipe-language")
  return saved === "vi" ? "vi" : "en"
}

function getLanguageServerSnapshot(): Language {
  return "en"
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot
  )

  const setLanguage = useCallback((newLang: Language) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("touchless-recipe-language", newLang)
      document.documentElement.lang = newLang
      window.dispatchEvent(new Event("touchless-language-change"))
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "vi" : "en")
  }, [language, setLanguage])

  const value = useMemo(
    () => ({
      language,
      isVietnamese: language === "vi",
      setLanguage,
      toggleLanguage,
      t: (key: TranslationKey) => translations[language][key] || key,
    }),
    [language, setLanguage, toggleLanguage]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider")
  return context
}