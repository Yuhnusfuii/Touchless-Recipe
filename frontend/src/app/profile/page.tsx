"use client"

import React, { useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Camera,
  CheckCircle2,
  ChefHat,
  Flame,
  Hand,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  Utensils,
  X,
  Zap,
} from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { authApi, type UserData } from "@/lib/api"
import { clearAuthSession } from "@/lib/auth-session"
import { cn } from "@/lib/utils"
import { ProfileHeader } from "@/components/profile/ProfileHeader"

function subscribeUser(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

function getUserSnapshot() {
  return localStorage.getItem("user")
}

function getUserServerSnapshot() {
  return null
}

const DIETARY_OPTIONS = [
  { id: "None", labelEn: "None (Standard)", labelVi: "Không kiêng (Bình thường)" },
  { id: "Vegetarian", labelEn: "Vegetarian", labelVi: "Ăn chay" },
  { id: "Vegan", labelEn: "Vegan", labelVi: "Thuần chay" },
  { id: "Keto", labelEn: "Keto / Low-Carb", labelVi: "Keto / Ít tinh bột" },
  { id: "High-Protein", labelEn: "High-Protein", labelVi: "Giàu đạm" },
  { id: "Gluten-Free", labelEn: "Gluten-Free", labelVi: "Không Gluten" },
  { id: "Dairy-Free", labelEn: "Dairy-Free", labelVi: "Không sữa bò" },
  { id: "Seafood-Allergy", labelEn: "No Seafood", labelVi: "Dị ứng hải sản" },
]

export default function ProfilePage() {
  const router = useRouter()
  const { setLanguage, isVietnamese } = useLanguage()

  const userJson = useSyncExternalStore(subscribeUser, getUserSnapshot, getUserServerSnapshot)
  const initialUser: UserData | null = userJson ? JSON.parse(userJson) : null

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [customName, setCustomName] = useState<string | null>(null)
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [customDietary, setCustomDietary] = useState<string | null>(null)
  const [customKcal, setCustomKcal] = useState<number | null>(null)

  const name = customName !== null ? customName : initialUser?.name || ""
  const image = customImage !== null ? customImage : initialUser?.image || ""
  const dietaryPrefs = customDietary !== null ? customDietary : initialUser?.dietaryPrefs || "None"
  const kcalTarget = customKcal !== null ? customKcal : initialUser?.kcalTarget || 2000

  const [isSaving, setIsSaving] = useState(false)
  const [successNotice, setSuccessNotice] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleLogout = () => {
    clearAuthSession()
    router.push("/login")
  }

  // Handle Image Upload & Compression
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        isVietnamese
          ? "Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, JPEG, WEBP)."
          : "Please select a valid image file (PNG, JPG, JPEG, WEBP)."
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        isVietnamese
          ? "Dung lượng ảnh không được vượt quá 5MB."
          : "Image size cannot exceed 5MB."
      )
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new window.Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const size = Math.min(img.width, img.height, 600)
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")

        if (ctx) {
          const sourceX = (img.width - Math.min(img.width, img.height)) / 2
          const sourceY = (img.height - Math.min(img.width, img.height)) / 2
          const sourceSize = Math.min(img.width, img.height)

          ctx.drawImage(
            img,
            sourceX,
            sourceY,
            sourceSize,
            sourceSize,
            0,
            0,
            size,
            size
          )

          const optimizedBase64 = canvas.toDataURL("image/jpeg", 0.88)
          setCustomImage(optimizedBase64)
          setSuccessNotice(
            isVietnamese
              ? "Ảnh đại diện đã được tải lên và căn chỉnh chuẩn khung! Nhấn 'Lưu thông tin hồ sơ' để áp dụng."
              : "Avatar preview updated with perfect aspect ratio! Click 'Save Profile' to apply."
          )
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCustomImage("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessNotice("")
    setErrorMessage("")

    if (!name.trim()) {
      setErrorMessage(
        isVietnamese ? "Vui lòng nhập tên của bạn." : "Please enter your name."
      )
      return
    }

    if (!initialUser?.id) {
      const updated = {
        ...initialUser,
        name: name.trim(),
        image,
        dietaryPrefs,
        kcalTarget: Number(kcalTarget),
      }
      localStorage.setItem("user", JSON.stringify(updated))
      window.dispatchEvent(new Event("storage"))
      setSuccessNotice(
        isVietnamese
          ? "Đã lưu cập nhật thông tin thành công!"
          : "Profile updated successfully!"
      )
      return
    }

    setIsSaving(true)
    try {
      const res = await authApi.updateProfile(initialUser.id, {
        name: name.trim(),
        image,
        dietaryPrefs,
        kcalTarget: Number(kcalTarget),
      })

      if (res.success && res.data) {
        localStorage.setItem("user", JSON.stringify(res.data))
        window.dispatchEvent(new Event("storage"))
        setSuccessNotice(
          isVietnamese
            ? "Đã lưu thông tin hồ sơ và ảnh đại diện vào cơ sở dữ liệu thành công!"
            : "Profile and avatar saved to database successfully!"
        )
      } else {
        setErrorMessage(res.message || (isVietnamese ? "Cập nhật thất bại" : "Update failed"))
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : isVietnamese
            ? "Lỗi khi cập nhật hồ sơ"
            : "Failed to update profile"
      setErrorMessage(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#17352d]">
      {/* Top Header */}
      <ProfileHeader isVietnamese={isVietnamese} onLanguageChange={setLanguage} onLogout={handleLogout} />

      {/* Main Profile Content */}
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-12">
        {/* Hidden File Input for Avatar Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Profile Card Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17352d] via-[#214a3e] to-[#17352d] p-6 text-white shadow-xl sm:p-10">
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              {/* Interactive Big Avatar with Overlay Edit Button */}
              <div className="relative group self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title={isVietnamese ? "Nhấn để thay đổi ảnh đại diện" : "Click to change avatar"}
                  className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-2 border-[#f3d7a3]/60 bg-[#17352d] text-2xl font-bold text-[#f3d7a3] shadow-xl transition hover:border-[#d97742] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#d97742] sm:size-28 sm:text-3xl"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={name || "Avatar"}
                      fill
                      sizes="112px"
                      priority
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span suppressHydrationWarning>{name ? name.slice(0, 2).toUpperCase() : "CH"}</span>
                  )}

                  {/* Dark hover overlay with camera icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 backdrop-blur-xs transition group-hover:opacity-100">
                    <Camera className="size-6 text-[#f3d7a3]" />
                    <span className="mt-1 text-[10px] font-semibold">
                      {isVietnamese ? "Đổi ảnh" : "Change"}
                    </span>
                  </div>
                </button>

                {/* Remove Image button if uploaded */}
                {image && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    title={isVietnamese ? "Gỡ ảnh này" : "Remove photo"}
                    className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border border-red-400 bg-red-600 text-white shadow transition hover:scale-110 hover:bg-red-700"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-[#f3d7a3] backdrop-blur-md">
                    <ShieldCheck className="size-3.5" />
                    <span>{isVietnamese ? "Tài khoản Bếp Trưởng" : "Master Chef Profile"}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded-full border border-[#f3d7a3]/30 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-[#f3d7a3] transition hover:bg-white/15"
                  >
                    <Upload className="size-3" />
                    <span>{isVietnamese ? "Tải ảnh mới" : "Upload avatar"}</span>
                  </button>
                </div>

                <h1 suppressHydrationWarning className="mt-2 font-serif text-2xl font-bold sm:text-3xl lg:text-4xl">
                  {name || (isVietnamese ? "Đầu bếp mise" : "mise Chef")}
                </h1>
                <p suppressHydrationWarning className="mt-1 flex items-center gap-1.5 text-xs text-white/75 sm:text-sm">
                  <Mail className="size-3.5 text-[#f3d7a3]" />
                  {initialUser?.email || "chef@touchless.io"}
                </p>
              </div>
            </div>

            {/* Badges / Stats */}
            <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-xs backdrop-blur-md">
                <Flame className="size-4 text-[#d97742]" />
                <span>
                  {isVietnamese ? "Chuỗi nấu ăn:" : "Cooking Streak:"}{" "}
                  <strong suppressHydrationWarning className="text-white">
                    {initialUser?.streak ?? 0} {isVietnamese ? "ngày" : "days"}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-xs backdrop-blur-md">
                <Zap className="size-4 text-[#f3d7a3]" />
                <span>
                  {isVietnamese ? "Mục tiêu năng lượng:" : "Target:"}{" "}
                  <strong suppressHydrationWarning className="text-white">{kcalTarget} kcal</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Form and Stats Split Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Left Column: Edit Settings Form (7 Cols) */}
          <div className="space-y-6 lg:col-span-7">
            <Card className="rounded-3xl border border-[#dbe5dd] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-[#17352d]">
                <User className="size-5 text-[#d97742]" />
                <span>{isVietnamese ? "Thông tin & Sở thích ẩm thực" : "Profile & Dietary Preferences"}</span>
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#527066]">
                {isVietnamese
                  ? "Tùy chỉnh thông tin cá nhân và chế độ ăn uống để hệ thống gợi ý món ăn tối ưu nhất."
                  : "Customize your personal details and dietary goals for personalized recipe suggestions."}
              </p>

              {successNotice && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-800 animate-in fade-in">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span>{successNotice}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-800 animate-in fade-in">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="profile-name" className="block text-xs font-semibold text-[#17352d]">
                    {isVietnamese ? "Họ và tên của bạn" : "Your Full Name"}
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={isVietnamese ? "Ví dụ: Rin Võ" : "e.g., Alex Johnson"}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#c5d2cc] bg-[#fbfaf7] px-3.5 text-xs outline-none transition focus:border-[#d97742] focus:bg-white focus:ring-2 focus:ring-[#d97742]/20"
                  />
                </div>

                {/* Email (Read only) */}
                <div>
                  <label htmlFor="profile-email" className="block text-xs font-semibold text-[#17352d]">
                    {isVietnamese ? "Địa chỉ Email (Không thể thay đổi)" : "Email Address (Read-only)"}
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    disabled
                    value={initialUser?.email || "chef@touchless.io"}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#dbe5dd] bg-gray-100 px-3.5 text-xs text-gray-500 opacity-80 cursor-not-allowed"
                  />
                </div>

                {/* Daily Kcal Target */}
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="profile-kcal" className="block text-xs font-semibold text-[#17352d]">
                      {isVietnamese ? "Mục tiêu năng lượng mỗi ngày (Kcal/ngày)" : "Daily Energy Target (Kcal/day)"}
                    </label>
                    <span className="font-mono text-xs font-bold text-[#d97742]">{kcalTarget} kcal</span>
                  </div>
                  <input
                    id="profile-kcal"
                    type="range"
                    min="1200"
                    max="3500"
                    step="50"
                    value={kcalTarget}
                    onChange={(e) => setCustomKcal(Number(e.target.value))}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#e4ece2] accent-[#d97742]"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-[#527066]">
                    <span>1,200 kcal</span>
                    <span>2,000 kcal (Tiêu chuẩn)</span>
                    <span>3,500 kcal</span>
                  </div>
                </div>

                {/* Dietary Preferences Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#17352d]">
                    {isVietnamese ? "Chế độ ăn uống & Kiêng cữ" : "Dietary Regimen & Allergies"}
                  </label>
                  <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-2">
                    {DIETARY_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCustomDietary(opt.id)}
                        className={cn(
                          "flex items-center justify-between rounded-xl border p-2.5 text-left text-xs transition",
                          dietaryPrefs === opt.id
                            ? "border-[#17352d] bg-[#17352d] font-semibold text-white shadow-xs"
                            : "border-[#dbe5dd] bg-[#fbfaf7] text-[#527066] hover:border-[#c5d2cc] hover:bg-[#e4ece2]"
                        )}
                      >
                        <span>{isVietnamese ? opt.labelVi : opt.labelEn}</span>
                        {dietaryPrefs === opt.id && <CheckCircle2 className="size-3.5 text-[#f3d7a3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#d97742] text-xs font-semibold text-white shadow-md transition hover:bg-[#bf6132] disabled:opacity-70"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>{isVietnamese ? "Đang lưu thay đổi..." : "Saving changes..."}</span>
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        <span>{isVietnamese ? "Lưu thông tin hồ sơ" : "Save Profile Changes"}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column: Cooking Stats & Preferences Summary (5 Cols) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Cooking Habits Card */}
            <Card className="rounded-3xl border border-[#dbe5dd] bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-[#17352d]">
                <ChefHat className="size-5 text-[#d97742]" />
                <span>{isVietnamese ? "Thống kê hoạt động bếp" : "Kitchen Activity"}</span>
              </h3>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-[#fbfaf7] p-3.5 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#fff1df] text-[#d97742]">
                      <Flame className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#17352d]">{isVietnamese ? "Chuỗi ngày liên tục" : "Cooking Streak"}</p>
                      <p className="text-[10px] text-[#527066]">{isVietnamese ? "Đăng nhập & nấu món ăn mỗi ngày" : "Cook every consecutive day"}</p>
                    </div>
                  </div>
                  <span suppressHydrationWarning className="font-mono text-sm font-bold text-[#d97742]">
                    {initialUser?.streak ?? 0} {isVietnamese ? "ngày" : "days"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[#fbfaf7] p-3.5 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#e4ece2] text-[#17352d]">
                      <Utensils className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#17352d]">{isVietnamese ? "Món đã thực hiện" : "Cooked Meals"}</p>
                      <p className="text-[10px] text-[#527066]">{isVietnamese ? "Hoàn thành trên 50% các bước nấu" : "Completed over 50% of recipe steps"}</p>
                    </div>
                  </div>
                  <span suppressHydrationWarning className="font-mono text-sm font-bold text-[#17352d]">
                    {initialUser?.cookedMealsCount ?? 0} {isVietnamese ? "món" : "meals"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[#fbfaf7] p-3.5 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#fff7ea] text-[#c56537]">
                      <Hand className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#17352d]">{isVietnamese ? "Lần nấu rảnh tay" : "Hands-free Sessions"}</p>
                      <p className="text-[10px] text-[#527066]">{isVietnamese ? "Điều khiển bằng cử chỉ & giọng nói" : "Vision gesture & voice controlled"}</p>
                    </div>
                  </div>
                  <span suppressHydrationWarning className="font-mono text-sm font-bold text-[#c56537]">
                    {initialUser?.handsFreeSessionsCount ?? 0} {isVietnamese ? "lần" : "times"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Navigation Card */}
            <Card className="rounded-3xl border border-[#dbe5dd] bg-[#17352d] p-6 text-white shadow-md">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#f3d7a3]">
                <Sparkles className="size-3.5" />
                <span>{isVietnamese ? "Sẵn sàng nấu nướng" : "Ready to Cook"}</span>
              </div>
              <h4 className="mt-2 font-serif text-xl font-bold">
                {isVietnamese ? "Bắt đầu nấu với cử chỉ không chạm" : "Start cooking with gestures"}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-white/75">
                {isVietnamese
                  ? "Chọn món ăn yêu thích từ kho công thức và nấu ăn rảnh tay với camera thông minh."
                  : "Pick your favorite dishes from the archive and cook completely hands-free."}
              </p>

              <div className="mt-5 flex gap-3">
                <Link
                  href="/"
                  className="flex flex-1 items-center justify-center rounded-xl bg-white/15 py-2.5 text-xs font-semibold text-white transition hover:bg-white/25"
                >
                  {isVietnamese ? "Xem công thức" : "Browse Recipes"}
                </Link>

                <Link
                  href="/playground"
                  className="flex flex-1 items-center justify-center rounded-xl bg-[#d97742] py-2.5 text-xs font-semibold text-white shadow transition hover:bg-[#bf6132]"
                >
                  {isVietnamese ? "Vào bếp ngay" : "Open Kitchen"}
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
