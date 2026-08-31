import { ImagePlus, Send, X } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"

type FeedComposerProps = {
  isVietnamese: boolean
  userAvatar?: string
  userInitials: string
  onPublish: (body: string, image?: string) => void
}

export function FeedComposer({ isVietnamese, userAvatar, userInitials, onPublish }: FeedComposerProps) {
  const [body, setBody] = useState("")
  const [image, setImage] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(typeof reader.result === "string" ? reader.result : undefined)
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  function publish() {
    if (!body.trim() && !image) return
    onPublish(body.trim(), image)
    setBody("")
    setImage(undefined)
  }

  return (
    <section className="rounded-2xl border border-[#dbe5dd] bg-white p-4 shadow-[0_8px_24px_rgba(23,53,45,0.05)] sm:p-5">
      <div className="flex gap-3">
        <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#17352d] text-xs font-bold text-[#f3d7a3]">{userAvatar ? <Image src={userAvatar} alt="User avatar" fill unoptimized className="object-cover" /> : userInitials}</div>
        <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder={isVietnamese ? "Bạn đang nấu món gì? Chia sẻ với cộng đồng..." : "What are you cooking? Share it with the community..."} rows={3} className="min-w-0 flex-1 resize-none rounded-xl bg-[#f1f5ef] px-4 py-3 text-sm leading-6 text-[#17352d] outline-none placeholder:text-[#789087] focus:ring-2 focus:ring-[#d97742]/20" />
      </div>
      {image && <div className="relative mt-3 h-56 overflow-hidden rounded-xl bg-[#f1f5ef]"><Image src={image} alt={isVietnamese ? "Ảnh món ăn đã chọn" : "Selected food"} fill unoptimized className="object-cover" /><button type="button" onClick={() => setImage(undefined)} aria-label={isVietnamese ? "Xóa ảnh" : "Remove image"} className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-[#17352d]/85 text-white"><X className="size-4" /></button></div>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e4ece2] pt-4">
        <button type="button" onClick={() => inputRef.current?.click()} className="flex items-center gap-2 text-sm font-semibold text-[#527066] hover:text-[#d97742]"><ImagePlus className="size-4 text-[#d97742]" />{isVietnamese ? "Thêm ảnh món ăn" : "Add food photo"}</button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleImage} className="sr-only" />
        <Button onClick={publish} disabled={!body.trim() && !image} className="gap-2 bg-[#d97742] text-white hover:bg-[#bf6132]"><Send className="size-4" />{isVietnamese ? "Đăng bài" : "Share post"}</Button>
      </div>
    </section>
  )
}