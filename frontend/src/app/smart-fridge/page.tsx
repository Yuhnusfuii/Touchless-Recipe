"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import Webcam from "react-webcam"

import { useLanguage } from "@/components/language-provider"
import { analyzeFridgeImage, suggestMealsFromIngredients, type FridgeAnalysisItem, type MealFilters, type MealSuggestion, type RecipeItem } from "@/lib/api"
import { SmartFridgeHeader } from "@/components/smart-fridge/SmartFridgeHeader"
import { SmartFridgeHero } from "@/components/smart-fridge/SmartFridgeHero"
import { FridgeCapturePanel } from "@/components/smart-fridge/FridgeCapturePanel"
import { IngredientInventory, type FridgeItem } from "../../components/smart-fridge/IngredientInventory"
import { MealSuggestionsPanel } from "../../components/smart-fridge/MealSuggestionsPanel"

type SmartFridgeDay = {
  date: string
  items: FridgeItem[]
  fridgeImage: string | null
  detectedItems: FridgeAnalysisItem[]
  mealSuggestions: MealSuggestion[]
  completedMealIds: string[]
}

const SMART_FRIDGE_STORAGE_KEY = "smart_fridge_day"

function getTodayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

const initialItems: FridgeItem[] = [
  { id: 1, name: "Chicken breast", quantity: "2 pieces", category: "Protein" },
  { id: 2, name: "Spinach", quantity: "1 bag", category: "Vegetables" },
  { id: 3, name: "Soy sauce", quantity: "1 bottle", category: "Pantry" },
]

export default function SmartFridgePage() {
  const { isVietnamese } = useLanguage()
  const router = useRouter()
  const [items, setItems] = useState<FridgeItem[]>(initialItems)
  const [search, setSearch] = useState("")
  const [newItem, setNewItem] = useState("")
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [fridgeImage, setFridgeImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [detectedItems, setDetectedItems] = useState<FridgeAnalysisItem[]>([])
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [suggestionError, setSuggestionError] = useState<string | null>(null)
  const [mealSuggestions, setMealSuggestions] = useState<MealSuggestion[]>([])
  const [mealFilters, setMealFilters] = useState<MealFilters>({ mealType: "none", highProtein: false, allergies: [] })
  const [allergyInput, setAllergyInput] = useState("")
  const [completedMealIds, setCompletedMealIds] = useState<string[]>([])
  const [isFridgeStateLoaded, setIsFridgeStateLoaded] = useState(false)
  const filterInteractionRef = useRef(false)
  const lastSuggestionKeyRef = useRef<string | null>(null)
  const webcamRef = useRef<Webcam>(null)


  useEffect(() => {
    try {
      const stored = localStorage.getItem(SMART_FRIDGE_STORAGE_KEY)
      if (stored) {
        const snapshot = JSON.parse(stored) as SmartFridgeDay
        if (snapshot.date === getTodayKey()) {
          queueMicrotask(() => {
            setItems(snapshot.items || initialItems)
            setFridgeImage(snapshot.fridgeImage || null)
            setDetectedItems(snapshot.detectedItems || [])
            setMealSuggestions(snapshot.mealSuggestions || [])
            setCompletedMealIds(snapshot.completedMealIds || [])
          })
        }
      }
    } catch {
      localStorage.removeItem(SMART_FRIDGE_STORAGE_KEY)
    }
    queueMicrotask(() => setIsFridgeStateLoaded(true))
  }, [])

  useEffect(() => {
    if (!isFridgeStateLoaded) return
    localStorage.setItem(SMART_FRIDGE_STORAGE_KEY, JSON.stringify({
      date: getTodayKey(), items, fridgeImage, detectedItems, mealSuggestions, completedMealIds,
    } satisfies SmartFridgeDay))
  }, [completedMealIds, detectedItems, fridgeImage, isFridgeStateLoaded, items, mealSuggestions])

  const visibleItems = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

  const addItem = () => {
    const name = newItem.trim()
    if (!name) return
    setItems((current) => [
      ...current,
      { id: Date.now(), name, quantity: isVietnamese ? "1 phần" : "1 item", category: isVietnamese ? "Khác" : "Other" },
    ])
    setNewItem("")
  }

  const analyzeImage = async (dataUrl: string) => {
    const [metadata, image] = dataUrl.split(",")
    const mimeType = metadata.match(/data:(image\/[^;]+);base64/i)?.[1] || "image/jpeg"
    if (!image) return

    setIsAnalyzing(true)
    setAnalysisError(null)
    setDetectedItems([])
    try {
      const result = await analyzeFridgeImage(image, mimeType, isVietnamese ? "vi" : "en")
      setDetectedItems(result)
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : (isVietnamese ? "Không thể phân tích ảnh." : "Unable to analyze image."))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const captureFridge = () => {
    const image = webcamRef.current?.getScreenshot()
    if (image) {
      setFridgeImage(image)
      setIsCameraOpen(false)
      void analyzeImage(image)
    }
  }

  const uploadFridgeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFridgeImage(reader.result)
        void analyzeImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  const addDetectedItems = () => {
    setItems((current) => [
      ...current,
      ...detectedItems.map((item, index) => ({ ...item, id: Date.now() + index })),
    ])
    setDetectedItems([])
  }

  const suggestMeals = useCallback(async (filters = mealFilters) => {
    const mergedIngredients = [...items, ...detectedItems].reduce<FridgeAnalysisItem[]>((current, item) => {
      const normalizedName = item.name.trim().toLowerCase()
      if (!current.some((entry) => entry.name.trim().toLowerCase() === normalizedName)) {
        current.push({ name: item.name, quantity: item.quantity, category: item.category })
      }
      return current
    }, [])
    const ingredients = mergedIngredients
    if (ingredients.length === 0) return
    const suggestionKey = JSON.stringify({ ingredients, language: isVietnamese ? "vi" : "en", filters })
    if (lastSuggestionKeyRef.current === suggestionKey) return
    setIsSuggesting(true)
    setSuggestionError(null)
    try {
      const sessionId = localStorage.getItem("fridge_suggestion_session") || crypto.randomUUID()
      localStorage.setItem("fridge_suggestion_session", sessionId)
      const suggestions = await suggestMealsFromIngredients(ingredients, isVietnamese ? "vi" : "en", filters, sessionId, localStorage.getItem("token") || undefined)
      lastSuggestionKeyRef.current = suggestionKey
      setMealSuggestions(suggestions)
    } catch (error) {
      setSuggestionError(error instanceof Error ? error.message : (isVietnamese ? "Không thể đề xuất món ăn." : "Unable to suggest meals."))
    } finally {
      setIsSuggesting(false)
    }
  }, [detectedItems, isVietnamese, items, mealFilters])

  const updateAllergies = (value: string) => {
    filterInteractionRef.current = true
    setAllergyInput(value)
    setMealFilters((current) => ({
      ...current,
      allergies: value.split(",").map((allergy) => allergy.trim()).filter(Boolean),
    }))
  }

  const startCooking = (meal: MealSuggestion) => {
    const mealId = `ai-${meal.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`
    const ingredients = [...meal.availableIngredients, ...meal.missingIngredients]
      .filter((ingredient, index, all) => ingredient.trim() && all.findIndex((entry) => entry.toLowerCase() === ingredient.toLowerCase()) === index)
    const recipe: RecipeItem = {
      id: `ai-${meal.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      title: meal.name,
      description: meal.description,
      category: mealFilters.mealType === "vegetarian" ? "Vegetarian" : "AI suggestion",
      area: "",
      prepTime: 30,
      difficulty: "Easy",
      calories: 0,
      imageUrl: "/images/roasted-harvest-bowl.jpg",
      source: "Smart Fridge AI",
      returnPath: "/smart-fridge",
      fridgeMealId: mealId,
      ingredients: ingredients.map((ingredient) => ({ name: ingredient, measure: "" })),
      steps: meal.instructions.map((instruction, index) => ({ stepNumber: index + 1, instruction })),
    }
    localStorage.setItem("active_cooking_recipe", JSON.stringify(recipe))
    router.push("/playground")
  }

  useEffect(() => {
    if (!filterInteractionRef.current || items.length === 0) return
    const timer = window.setTimeout(() => { void suggestMeals(mealFilters) }, 600)
    return () => window.clearTimeout(timer)
  }, [mealFilters, items, detectedItems, suggestMeals])

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#17352d]">
      <SmartFridgeHeader isVietnamese={isVietnamese} />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <SmartFridgeHero isVietnamese={isVietnamese} />

        <FridgeCapturePanel
          isVietnamese={isVietnamese}
          isCameraOpen={isCameraOpen}
          cameraError={cameraError}
          fridgeImage={fridgeImage}
          isAnalyzing={isAnalyzing}
          analysisError={analysisError}
          detectedItems={detectedItems}
          webcamRef={webcamRef}
          onOpenCamera={() => { setCameraError(false); setIsCameraOpen(true) }}
          onCloseCamera={() => setIsCameraOpen(false)}
          onCameraError={() => setCameraError(true)}
          onCapture={captureFridge}
          onUpload={uploadFridgeImage}
          onRemoveImage={() => setFridgeImage(null)}
          onAddDetectedItems={addDetectedItems}
          onSuggestMeals={() => void suggestMeals()}
        />

        <MealSuggestionsPanel
          isVietnamese={isVietnamese}
          isSuggesting={isSuggesting}
          suggestionError={suggestionError}
          mealSuggestions={mealSuggestions}
          mealFilters={mealFilters}
          allergyInput={allergyInput}
          completedMealIds={completedMealIds}
          onSuggestMeals={() => void suggestMeals()}
          onMealTypeChange={(value) => { filterInteractionRef.current = true; setMealFilters((current) => ({ ...current, mealType: value })) }}
          onHighProteinChange={(value) => { filterInteractionRef.current = true; setMealFilters((current) => ({ ...current, highProtein: value })) }}
          onAllergyChange={updateAllergies}
          onStartCooking={startCooking}
        />

        <IngredientInventory
          isVietnamese={isVietnamese}
          items={items}
          visibleItems={visibleItems}
          search={search}
          newItem={newItem}
          onSearchChange={setSearch}
          onNewItemChange={setNewItem}
          onAddItem={addItem}
          onRemoveItem={(id: number) => setItems((current) => current.filter((item) => item.id !== id))}
        />
      </div>
    </main>
  )
}
