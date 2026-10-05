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

type LoginProps = {
  onClose?: () => void
  onSwitchToRegister?: () => void
  standalone?: boolean
}

export function Login({ onClose, onSwitchToRegister, standalone = false }: LoginProps) {
  const router = useRouter()
  const { setLanguage, isVietnamese } = useLanguage()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email.trim())) {
      setError(isVietnamese ? "Vui lòng nhập email hợp lệ." : "Please enter a valid email address.")
      return
    }
    if (!password) {
      setError(isVietnamese ? "Vui lòng nhập mật khẩu." : "Please enter your password.")
      return
    }

    setIsLoading(true)

    try {
      const response = await authApi.login({
        email: email.trim(),
        password,
      })

      if (response.success) {
        setSuccess(
          isVietnamese
            ? "Đăng nhập thành công! Đang chuyển hướng..."
            : "Logged in successfully! Redirecting..."
        )

        // Store token & user
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token)
        }
        if (response.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user))
        }
        saveAuthSession()
        window.dispatchEvent(new Event("touchless-auth-change"))

        setTimeout(() => {
          if (standalone) {
            router.push("/")
          } else {
            onClose?.()
            router.push("/")
            router.refresh()
          }
        }, 1000)
      } else {
        setError(response.message || (isVietnamese ? "Đăng nhập không thành công." : "Login failed."))
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : isVietnamese
            ? "Email hoặc mật khẩu không chính xác."
            : "Incorrect email or password."
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
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#c56537]">CookAI</p>
      <h1 id="login-title" className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
        {isVietnamese ? "Đăng nhập để vào bếp" : "Sign in to enter the kitchen"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-[#527066]">
        {isVietnamese ? "Lưu công thức và tiếp tục nấu ăn rảnh tay." : "Save your recipes and keep cooking hands-free."}
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

        <label htmlFor="login-email" className="block text-sm font-medium">
          Email
          <input
            id="login-email"
            required
            type="email"
            disabled={isLoading}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 h-12 w-full rounded-lg border border-[#c5d2cc] bg-white px-3 text-sm outline-none transition focus:border-[#d97742] focus:ring-2 focus:ring-[#d97742]/20 disabled:opacity-60"
          />
        </label>

        <label htmlFor="login-password" className="block text-sm font-medium">
          {isVietnamese ? "Mật khẩu" : "Password"}
          <input
            id="login-password"
            required
            type="password"
            disabled={isLoading}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={isVietnamese ? "Tối thiểu 6 ký tự" : "At least 6 characters"}
            className="mt-2 h-12 w-full rounded-lg border border-[#c5d2cc] bg-white px-3 text-sm outline-none transition focus:border-[#d97742] focus:ring-2 focus:ring-[#d97742]/20 disabled:opacity-60"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading || !!success}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#d97742] px-4 text-sm font-semibold text-white transition hover:bg-[#bf6132] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isVietnamese ? "Đang đăng nhập..." : "Signing in..."}
            </>
          ) : (
            <>
              {isVietnamese ? "Đăng nhập" : "Sign in"}
              <ArrowRight aria-hidden="true" className="size-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#527066]">
        {isVietnamese ? "Chưa có tài khoản?" : "Don't have an account?"}{" "}
        {standalone ? (
          <Link href="/register" className="font-semibold text-[#a94f27] hover:text-[#17352d]">
            {isVietnamese ? "Đăng ký" : "Create one"}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-[#a94f27] hover:text-[#17352d]"
          >
            {isVietnamese ? "Đăng ký" : "Create one"}
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
        aria-labelledby="login-title"
      >
        <div className="relative">{form}</div>
      </div>
    )

  return (
    <main className="grid min-h-screen bg-[#f1f5ef] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-[360px] overflow-hidden lg:block">
        <Image
          src="/images/market-garden-salad.jpg"
          alt="Fresh market garden salad"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#17352d]/60" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="text-xl font-semibold">
            CookAI<span className="text-[#f3d7a3]">.</span>
          </Link>
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-[#f3d7a3]">
              {isVietnamese ? "Bếp rảnh tay" : "Hands-free kitchen"}
            </p>
            <p className="max-w-lg font-serif text-5xl leading-tight">
              {isVietnamese
                ? "Nấu ăn nhẹ nhàng hơn, từng bước một."
                : "A calmer way to cook, one step at a time."}
            </p>
            <div className="mt-7 flex items-center gap-2 text-sm text-white/80">
              <Check aria-hidden="true" className="size-4 text-[#f3d7a3]" />{" "}
              {isVietnamese ? "Công thức luôn ở bên bạn" : "Your recipe stays with you"}
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
