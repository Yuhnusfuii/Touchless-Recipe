import { Clock3, Gauge, Users } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

type RecipeStatProps = {
  label: string
  value: string
  icon: "time" | "level" | "servings"
}

const icons = {
  time: Clock3,
  level: Gauge,
  servings: Users,
}

export function RecipeStat({ label, value, icon }: RecipeStatProps) {
  const Icon = icons[icon]

  return (
    <Card size="sm" className="bg-background/80">
      <CardContent className="flex items-center gap-3 py-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
          <Icon aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}