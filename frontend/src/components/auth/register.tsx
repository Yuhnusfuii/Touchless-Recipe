"use client"

import { FormEvent, useState } from "react"
import { AlertCircle, ArrowRight, Check, CheckCircle2, Loader2, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { useLanguage } from "@/components/language-provider"
import { authApi } from "@/lib/api"
import { saveAuthSession } from "@/lib/auth-session"
import { cn } from "@/lib/utils"

type RegisterProps = {
  onClose?: () => void
  onSwitchToLogin?: () => void
  standalone?: boolean
}

export function Register({ onClose, onSwitchToLogin, standalone = false }: RegisterProps) {
  const router = useRouter()
  const { setLanguage, isVietnamese } = useLanguage()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")

    // Client-side validation
    if (name.trim().length < 2) {
      setError(isVietnamese ? "Vui lòng nhập tên của bạn (tối thiểu 2 ký tự)." : "Please enter your name (at least 2 characters).")
      return
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email.trim())) {
      setError(isVietnamese ? "Vui lòng nhập email hợp lệ (ví dụ: user@example.com)." : "Please enter a valid email address (e.g. user@example.com).")
      return
    }
    if (password.length < 6) {
      setError(isVietnamese ? "Mật khẩu cần có ít nhất 6 ký tự." : "Password must be at least 6 characters.")
      return
    }
    if (password !== confirmation) {
      setError(isVietnamese ? "Mật khẩu xác nhận không khớp." : "Passwords do not match.")
      return
    }

    setIsLoading(true)

    try {
      const response = await authApi.register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword: confirmation,
      })

      if (response.success) {
        setSuccess(
          isVietnamese
            ? "Tạo tài khoản thành công! Dữ liệu người dùng đã được lưu trữ vào hệ thống."
            : "Account created successfully! User data has been saved to database."
        )

        // Store token & user in localStorage
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token)
        }
        if (response.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user))
        }
        saveAuthSession()
        window.dispatchEvent(new Event("touchless-auth-change"))

        // Reset form
        setPassword("")
        setConfirmation("")

        // Auto transition after 2 seconds
        setTimeout(() => {
          if (standalone) {
            router.push("/login")
          } else if (onSwitchToLogin) {
            onSwitchToLogin()
          } else {
            onClose?.()
          }
        }, 1800)
      } else {
        setError(response.message || (isVietnamese ? "Đăng ký không thành công." : "Registration failed."))
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : isVietnamese
            ? "Đã có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại."
            : "An error occurred during account creation. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const form = (
    <div className="relative w-full max-w-md rounded-2xl border border-[#dbe5dd] bg-[#fbfaf7] p-6 text-[#17352d] shadow-xl sm:p-8">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-[#c5d2cc] bg-white p-0.5 text-xs font-semibold shadow-2xs">
          <button
            type="button"
            onClick={() => setLanguage("vi")}
            className={cn(
              "flex items-center gap-0.5 rounded px-2 py-0.5 transition",
              isVietnamese
                ? "bg-[#17352d] text-white"
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
              "flex items-center gap-0.5 rounded px-2 py-0.5 transition",
              !isVietnamese
                ? "bg-[#17352d] text-white"
                : "text-[#527066] hover:text-[#17352d]"
            )}
          >
            <span>🇬🇧</span>
            <span>EN</span>
          </button>
        </div>
        {!standalone && (
          <button
            type="button"
            onClick={onClose}
            aria-label={isVietnamese ? "Đóng" : "Close"}
            className="flex size-8 items-center justify-center rounded-full text-[#527066] hover:bg-[#e4ece2] hover:text-[#17352d]"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#c56537]">mise.</p>
      <h1 id="register-title" className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
        {isVietnamese ? "Tạo tài khoản mới" : "Create your kitchen account"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-[#527066]">
        {isVietnamese ? "Bắt đầu hành trình nấu ăn nhẹ nhàng hơn." : "Start a calmer, more hands-free way to cook."}
      </p>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Success Alert */}
        {success && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-3.5 text-sm text-emerald-800 animate-in fade-in slide-in-from-top-1"
          >
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold">{isVietnamese ? "Thành công!" : "Success!"}</p>
              <p className="mt-0.5 text-emerald-700">{success}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-3.5 text-sm text-red-800 animate-in fade-in slide-in-from-top-1"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold">{isVietnamese ? "Thao tác không thành công" : "Action failed"}</p>
              <p className="mt-0.5 text-red-700">{error}</p>
            </div>
          </div>
        )}

        <label htmlFor="register-name" className="block text-sm font-medium">
          {isVietnamese ? "Tên của bạn" : "Your name"}
          <input
            id="register-name"
            required
            type="text"
            disabled={isLoading}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={isVietnamese ? "Nguyễn An" : "Alex Morgan"}
            className="mt-2 h-12 w-full rounded-lg border border-[#c5d2cc] bg-white px-3 text-sm outline-none transition focus:border-[#d97742] focus:ring-2 focus:ring-[#d97742]/20 disabled:opacity-60"
          />
        </label>

        <label htmlFor="register-email" className="block text-sm font-medium">
          Email
          <input
            id="register-email"
            required
            type="email"
            disabled={isLoading}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 h-12 w-full rounded-lg border border-[#c5d2cc] bg-white px-3 text-sm outline-none transition focus:border-[#d97742] focus:ring-2 focus:ring-[#d97742]/20 disabled:opacity-60"
          />
        </label>

        <label htmlFor="register-password" className="block text-sm font-medium">
          {isVietnamese ? "Mật khẩu" : "Password"}
          <input
            id="register-password"
            required
            type="password"
            disabled={isLoading}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={isVietnamese ? "Tối thiểu 6 ký tự" : "At least 6 characters"}
            className="mt-2 h-12 w-full rounded-lg border border-[#c5d2cc] bg-white px-3 text-sm outline-none transition focus:border-[#d97742] focus:ring-2 focus:ring-[#d97742]/20 disabled:opacity-60"
          />
        </label>

        <label htmlFor="register-confirmation" className="block text-sm font-medium">
          {isVietnamese ? "Xác nhận mật khẩu" : "Confirm password"}
          <input
            id="register-confirmation"
            required
            type="password"
            disabled={isLoading}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={isVietnamese ? "Nhập lại mật khẩu" : "Re-enter your password"}
            className="mt-2 h-12 w-full rounded-lg border border-[#c5d2cc] bg-white px-3 text-sm outline-none transition focus:border-[#d97742] focus:ring-2 focus:ring-[#d97742]/20 disabled:opacity-60"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading || !!success}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#17352d] px-4 text-sm font-semibold text-white transition hover:bg-[#254b40] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isVietnamese ? "Đang xử lý tạo tài khoản..." : "Creating account..."}
            </>
          ) : (
            <>
              {isVietnamese ? "Đăng ký" : "Create account"}
              <ArrowRight aria-hidden="true" className="size-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#527066]">
        {isVietnamese ? "Đã có tài khoản?" : "Already have an account?"}{" "}
        {standalone ? (
          <Link href="/login" className="font-semibold text-[#a94f27] hover:text-[#17352d]">
            {isVietnamese ? "Đăng nhập" : "Sign in"}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-[#a94f27] hover:text-[#17352d]"
          >
            {isVietnamese ? "Đăng nhập" : "Sign in"}
          </button>
        )}
      </p>
    </div>
  )

  if (!standalone)
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#17352d]/55 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
      >
        <div className="relative">{form}</div>
      </div>
    )

  return (
    <main className="grid min-h-screen bg-[#f1f5ef] lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden min-h-[360px] overflow-hidden lg:block">
        <Image
          src="/images/roasted-harvest-bowl.jpg"
          alt="Colorful roasted harvest bowl"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#17352d]/60" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="text-xl font-semibold">
            mise<span className="text-[#f3d7a3]">.</span>
          </Link>
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-[#f3d7a3]">
              {isVietnamese ? "Cùng vào bếp" : "Come cook with us"}
            </p>
            <p className="max-w-lg font-serif text-5xl leading-tight">
              {isVietnamese
                ? "Món ngon bắt đầu từ một nhịp bếp bình tĩnh."
                : "Good food starts with a calmer kitchen rhythm."}
            </p>
            <div className="mt-7 flex items-center gap-2 text-sm text-white/80">
              <Check aria-hidden="true" className="size-4 text-[#f3d7a3]" />{" "}
              {isVietnamese ? "Cá nhân hóa theo nhịp của bạn" : "Personalized to your pace"}
            </div>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          {form}
          <p className="mt-5 text-center text-xs text-[#527066]">
            <Link href="/" className="hover:text-[#17352d]">
              {isVietnamese ? "Quay về trang chủ" : "Back to home"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
