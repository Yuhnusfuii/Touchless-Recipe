import { Snowflake } from "lucide-react"

export function SmartFridgeHero({ isVietnamese }: { isVietnamese: boolean }) {
  return <section className="rounded-3xl bg-[#17352d] p-6 text-white shadow-xl sm:p-10"><div className="max-w-2xl"><div className="flex items-center gap-3 text-[#f3d7a3]"><Snowflake className="size-5" /><span className="text-xs font-semibold uppercase tracking-[0.16em]">{isVietnamese ? "Kho nguyên liệu" : "Ingredient inventory"}</span></div><h1 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.05em] sm:text-6xl">{isVietnamese ? "Tủ lạnh thông minh" : "Smart Fridge"}</h1><p className="mt-4 max-w-xl leading-7 text-white/75">{isVietnamese ? "Theo dõi nguyên liệu đang có và chuẩn bị cho món ăn tiếp theo." : "Keep track of what you have and make the next meal easier to plan."}</p></div></section>
}
