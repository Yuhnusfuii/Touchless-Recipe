import { Check } from "lucide-react"

type RecipeStepProps = {
  number: number
  children: React.ReactNode
}

export function RecipeStep({ number, children }: RecipeStepProps) {
  return (
    <li className="flex gap-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-sm font-semibold text-orange-700">
        {number}
      </span>
      <p className="flex-1 pt-1 leading-6 text-muted-foreground">{children}</p>
      <button
        type="button"
        aria-label={`Mark step ${number} complete`}
        className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-orange-300 hover:text-orange-700"
      >
        <Check aria-hidden="true" className="size-4" />
      </button>
    </li>
  )
}