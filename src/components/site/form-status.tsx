import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The hero form keeps its own success panel: it has to match the shadow and
 * padding of the card it replaces so the hero doesn't shift on submit.
 */
function FormSuccessCard({
  as: Heading = "h3",
  heading,
  children,
}: {
  as?: "h2" | "h3"
  heading: string
  children: React.ReactNode
}) {
  return (
    <div
      role="status"
      className="rounded-xl bg-card p-8 shadow-xs ring-1 ring-foreground/10"
    >
      <Heading className="text-2xl font-semibold text-primary">
        {heading}
      </Heading>
      {children}
    </div>
  )
}

function FormErrorBanner({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <p role="alert" className={cn("font-medium text-destructive", className)}>
      {children}
    </p>
  )
}

export { FormSuccessCard, FormErrorBanner }
