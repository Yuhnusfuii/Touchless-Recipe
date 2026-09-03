import { Plus, Search, Trash2, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"

export type FridgeItem = {
  id: number
  name: string
  quantity: string
  category: string
}

type IngredientInventoryProps = {
  isVietnamese: boolean
  items: FridgeItem[]
  visibleItems: FridgeItem[]
  search: string
  newItem: string
  onSearchChange: (value: string) => void
  onNewItemChange: (value: string) => void
  onAddItem: () => void
  onRemoveItem: (id: number) => void
}

export function IngredientInventory({ isVietnamese, items, visibleItems, search, newItem, onSearchChange, onNewItemChange, onAddItem, onRemoveItem }: IngredientInventoryProps) {
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.38fr]">
      <div className="rounded-2xl border border-[#dbe5dd] bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="font-serif text-3xl tracking-[-0.04em]">{isVietnamese ? "Nguyên liệu của bạn" : "Your ingredients"}</h2><p className="mt-1 text-sm text-[#527066]">{items.length} {isVietnamese ? "mặt hàng đang được theo dõi" : "items being tracked"}</p></div><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#527066]" /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={isVietnamese ? "Tìm nguyên liệu" : "Search ingredients"} className="h-10 rounded-full border border-[#c5d2cc] pl-9 pr-4 text-sm outline-none focus:border-[#d97742]" /></div></div>
        <div className="mt-6 divide-y divide-[#e4ece2]">{visibleItems.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-4"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#e4ece2] text-[#17352d]"><Utensils className="size-4" /></span><div><p className="font-semibold">{item.name}</p><p className="text-xs text-[#527066]">{item.category} · {item.quantity}</p></div></div><Button variant="ghost" size="icon" title={isVietnamese ? "Xóa nguyên liệu" : "Remove ingredient"} onClick={() => onRemoveItem(item.id)}><Trash2 className="size-4 text-[#c56537]" /></Button></div>)}{visibleItems.length === 0 && <p className="py-8 text-center text-sm text-[#527066]">{isVietnamese ? "Không tìm thấy nguyên liệu." : "No ingredients found."}</p>}</div>
      </div>
      <aside className="rounded-2xl border border-[#dbe5dd] bg-[#f1f5ef] p-5 sm:p-7"><h2 className="font-serif text-2xl">{isVietnamese ? "Thêm nguyên liệu" : "Add an ingredient"}</h2><p className="mt-2 text-sm leading-6 text-[#527066]">{isVietnamese ? "Bắt đầu xây dựng kho nguyên liệu của bạn." : "Start building your ingredient inventory."}</p><input value={newItem} onChange={(event) => onNewItemChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onAddItem() }} placeholder={isVietnamese ? "Ví dụ: Cà chua" : "e.g. Tomatoes"} className="mt-6 h-11 w-full rounded-lg border border-[#c5d2cc] bg-white px-3 text-sm outline-none focus:border-[#d97742]" /><Button onClick={onAddItem} className="mt-3 w-full gap-2 bg-[#d97742] text-white hover:bg-[#bf6132]"><Plus className="size-4" />{isVietnamese ? "Thêm vào tủ lạnh" : "Add to fridge"}</Button></aside>
    </section>
  )
}