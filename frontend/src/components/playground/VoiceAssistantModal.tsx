import { Mic } from "lucide-react"

export type VoiceAssistantModalProps = {
  isVietnamese: boolean
  isOpen: boolean
  voiceLog: string
  assistantReply: string
  isListening: boolean
  onClose: () => void
  onStart: () => void
}

export function VoiceAssistantModal({ isVietnamese, isOpen, voiceLog, assistantReply, isListening, onClose, onStart }: VoiceAssistantModalProps) {
  if (!isOpen) return null
  const commands = [
    [isVietnamese ? "“tiếp theo”" : "“next”", isVietnamese ? "Sang bước kế tiếp" : "Go to the next step"],
    [isVietnamese ? "“quay lại”" : "“back”", isVietnamese ? "Quay về bước trước" : "Return to the previous step"],
    [isVietnamese ? "“đọc hướng dẫn”" : "“read step”", isVietnamese ? "Đọc to hướng dẫn hiện tại" : "Read the current instruction aloud"],
    [isVietnamese ? "“bắt đầu hẹn giờ”" : "“start timer”", isVietnamese ? "Bắt đầu timer của bước hiện tại" : "Start the current step timer"],
    [isVietnamese ? "“Có thể thay bơ bằng dầu không?”" : "“Can I replace butter with oil?”", isVietnamese ? "Hỏi bất kỳ câu hỏi phù hợp nào về nấu ăn" : "Ask any relevant cooking question"],
  ]
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="presentation" onClick={onClose}><div role="dialog" aria-modal="true" aria-labelledby="voice-assistant-guide-title" onClick={(event) => event.stopPropagation()} className="relative w-full max-w-lg rounded-3xl border border-emerald-700 bg-[#12211c] p-6 text-white shadow-2xl sm:p-8"><button type="button" onClick={onClose} aria-label={isVietnamese ? "Đóng hướng dẫn" : "Close guide"} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-emerald-200 transition hover:bg-white/20 hover:text-white"><span className="text-xl leading-none">&times;</span></button><div className="flex items-center gap-4 pr-8"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3d7a3] text-[#17352d]"><Mic className="size-6" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3d7a3]">{isVietnamese ? "Trợ lý giọng nói" : "Voice assistant"}</p><h2 id="voice-assistant-guide-title" className="mt-1 font-serif text-3xl">{isVietnamese ? "Nấu ăn không cần chạm" : "Cook without touching"}</h2></div></div><p className="mt-6 text-sm leading-6 text-emerald-100/70">{isVietnamese ? "Bật nút Giọng nói, cho phép microphone, rồi nói tự nhiên như đang hỏi một đầu bếp. Trợ lý hiểu cả câu hỏi về nguyên liệu, thời gian, độ chín và cách xử lý sự cố." : "Press Voice, allow microphone access, and speak naturally as if you were asking a chef. The assistant understands ingredients, timing, doneness, and cooking problems."}</p>{(voiceLog || assistantReply) && <div className="mt-5 space-y-2 rounded-2xl border border-emerald-900 bg-[#09110f] p-3">{voiceLog && <p className="text-xs text-gray-400"><span className="font-semibold text-emerald-300">{isVietnamese ? "Bạn nói:" : "You:"}</span> {voiceLog}</p>}{assistantReply && <p className="text-sm leading-6 text-[#f3d7a3]"><span className="font-semibold">{isVietnamese ? "Trợ lý:" : "Assistant:"}</span> {assistantReply}</p>}</div>}<div className="mt-5 grid gap-2">{commands.map(([command, description]) => <div key={command} className="flex items-center justify-between gap-4 rounded-xl border border-emerald-900 bg-[#09110f] px-4 py-3"><span className="text-sm font-semibold text-[#f3d7a3]">{command}</span><span className="text-right text-xs text-gray-400">{description}</span></div>)}</div><button type="button" onClick={onStart} className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#d97742] text-sm font-semibold text-white transition hover:bg-[#bf6132]"><Mic className="size-4" />{isListening ? (isVietnamese ? "Đang lắng nghe..." : "Listening...") : (isVietnamese ? "Bắt đầu trò chuyện" : "Start conversation")}</button></div></div>
}
