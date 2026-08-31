import { Camera, ChefHat, Plus, Upload, X } from "lucide-react"
import Image from "next/image"
import type { ChangeEvent, RefObject } from "react"
import Webcam from "react-webcam"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { FridgeAnalysisItem } from "@/lib/api"

type FridgeCapturePanelProps = {
  isVietnamese: boolean
  isCameraOpen: boolean
  cameraError: boolean
  fridgeImage: string | null
  isAnalyzing: boolean
  analysisError: string | null
  detectedItems: FridgeAnalysisItem[]
  webcamRef: RefObject<Webcam | null>
  onOpenCamera: () => void
  onCloseCamera: () => void
  onCameraError: () => void
  onCapture: () => void
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  onAddDetectedItems: () => void
  onSuggestMeals: () => void
}

export function FridgeCapturePanel({
  isVietnamese, isCameraOpen, cameraError, fridgeImage, isAnalyzing,
  analysisError, detectedItems, webcamRef, onOpenCamera, onCloseCamera, onCameraError,
  onCapture, onUpload, onRemoveImage, onAddDetectedItems, onSuggestMeals,
}: FridgeCapturePanelProps) {
  return (
    <section className="mt-8 rounded-2xl border border-[#dbe5dd] bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-[#d97742]"><Camera className="size-5" /><h2 className="font-serif text-2xl">{isVietnamese ? "Chụp ảnh tủ lạnh" : "Capture your fridge"}</h2></div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#527066]">{isVietnamese ? "Chụp hoặc tải ảnh bên trong tủ lạnh để lưu lại và kiểm tra nguyên liệu." : "Take a photo or upload an image of your fridge to keep your ingredients in view."}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onOpenCamera} className="gap-2 bg-[#17352d] text-white hover:bg-[#254b40]"><Camera className="size-4" />{isVietnamese ? "Mở camera" : "Open camera"}</Button>
          <label className={cn(buttonVariants({ size: "default", variant: "outline" }), "cursor-pointer gap-2 border-[#c5d2cc] text-[#527066]")}>
            <Upload className="size-4" />{isVietnamese ? "Tải ảnh lên" : "Upload image"}
            <input type="file" accept="image/*" onChange={onUpload} className="sr-only" />
          </label>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
        <div className="min-w-0">
          {isCameraOpen && <div className="overflow-hidden rounded-2xl bg-[#17352d] p-3">
            {cameraError ? <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-5 text-center text-sm text-white/75"><Camera className="size-8 text-[#f3d7a3]" /><p>{isVietnamese ? "Không thể truy cập camera. Hãy cấp quyền cho trình duyệt." : "Camera access failed. Please allow camera permission in your browser."}</p></div> : <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment" }} onUserMediaError={onCameraError} className="aspect-video w-full rounded-xl object-cover" />}
            <div className="mt-3 flex gap-2"><Button onClick={onCapture} disabled={cameraError} className="gap-2 bg-[#d97742] text-white hover:bg-[#bf6132]"><Camera className="size-4" />{isVietnamese ? "Chụp ảnh" : "Take photo"}</Button><Button variant="ghost" onClick={onCloseCamera} className="text-white hover:bg-white/10 hover:text-white">{isVietnamese ? "Đóng" : "Close"}</Button></div>
          </div>}
          {fridgeImage && <div className="relative overflow-hidden rounded-2xl border border-[#dbe5dd] bg-[#f1f5ef] lg:sticky lg:top-6"><Image src={fridgeImage} alt={isVietnamese ? "Ảnh tủ lạnh" : "Fridge photo"} width={900} height={600} unoptimized className="aspect-[4/3] max-h-[520px] w-full object-cover" /><button type="button" onClick={onRemoveImage} title={isVietnamese ? "Xóa ảnh" : "Remove photo"} className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-[#17352d]/85 text-white transition hover:bg-[#d97742]"><X className="size-4" /></button></div>}
        </div>
        <div className="min-w-0">{(isAnalyzing || analysisError || detectedItems.length > 0) ? <div className="rounded-2xl border border-[#dbe5dd] bg-[#f1f5ef] p-5 lg:sticky lg:top-6 lg:max-h-[520px] lg:overflow-y-auto"><div className="flex items-center justify-between gap-4"><div><h3 className="font-semibold">{isVietnamese ? "AI nhận diện được" : "AI detected"}</h3><p className="mt-1 text-xs text-[#527066]">{isAnalyzing ? (isVietnamese ? "Đang phân tích ảnh..." : "Analyzing image...") : analysisError || (isVietnamese ? "Kiểm tra kết quả trước khi thêm vào tủ lạnh." : "Review the results before adding them to your fridge.")}</p></div>{isAnalyzing && <span className="size-5 animate-spin rounded-full border-2 border-[#d97742] border-t-transparent" />}</div>{!isAnalyzing && !analysisError && detectedItems.length > 0 && <><div className="mt-4 grid gap-2">{detectedItems.map((item, index) => <div key={`${item.name}-${index}`} className="rounded-lg border border-[#dbe5dd] bg-white px-3 py-2"><p className="text-sm font-semibold">{item.name}</p><p className="text-xs text-[#527066]">{item.category} · {item.quantity}</p></div>)}</div><div className="mt-4 flex flex-wrap gap-2"><Button onClick={onAddDetectedItems} variant="outline" className="gap-2 border-[#c5d2cc] text-[#527066]"><Plus className="size-4" />{isVietnamese ? "Thêm vào tủ lạnh" : "Add detected items"}</Button><Button onClick={onSuggestMeals} className="gap-2 bg-[#d97742] text-white hover:bg-[#bf6132]"><ChefHat className="size-4" />{isVietnamese ? "Đề xuất món ăn" : "Suggest meals"}</Button></div><p className="mt-3 text-center text-[11px] text-[#527066]">{isVietnamese ? "Cuộn để xem thêm kết quả" : "Scroll to see more results"}</p></>}</div> : <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-[#c5d2cc] bg-[#f1f5ef] p-6 text-center text-sm text-[#527066]">{isVietnamese ? "Kết quả AI sẽ hiển thị ở đây sau khi bạn tải ảnh lên." : "AI results will appear here after you upload an image."}</div>}</div>
      </div>
    </section>
  )
}