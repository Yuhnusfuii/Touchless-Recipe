import Link from "next/link"
import { ArrowRight, Heart } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type RecipeCardProps = {
  title: string
  description: string
  category: string
  time: string
  href: string
  accent: string
}

export function RecipeCard({ title, description, category, time, href, accent }: RecipeCardProps) {
  return (
    <Card className="group h-full bg-white">
      <div className={`h-2 ${accent}`} />
      <CardHeader className="gap-3 pt-5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{category}</Badge>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <Link className={cn(buttonVariants({ variant: "ghost" }), "px-0 hover:bg-transparent hover:text-orange-700")} href={href}>
          View recipe <ArrowRight aria-hidden="true" />
        </Link>
        <Button aria-label={`Save ${title}`} variant="ghost" size="icon">
          <Heart aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  )
}