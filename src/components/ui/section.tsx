import * as React from "react"

import { cn } from "@/lib/utils"

function Section({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("py-10 sm:py-14 lg:py-20", className)} {...props} />
  )
}

function RouteLine({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("mt-5 flex items-center gap-1.5", className)}
    >
      <span className="size-2 rounded-full bg-accent" />
      <span className="h-0.5 w-14 rounded-full bg-accent/70" />
      <span className="size-2 rounded-full border-2 border-accent" />
    </span>
  )
}

function SectionHeading({
  as: Heading = "h2",
  eyebrow,
  title,
  lede,
  align = "start",
  className,
}: {
  as?: "h1" | "h2"
  eyebrow?: string
  title: string
  lede?: string
  align?: "start" | "center"
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-accent-deep">
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          "font-bold text-primary",
          eyebrow && "mt-3",
          Heading === "h1"
            ? "text-3xl sm:text-4xl lg:text-5xl"
            : "text-2xl sm:text-3xl lg:text-4xl"
        )}
      >
        {title}
      </Heading>
      <RouteLine className={align === "center" ? "justify-center" : undefined} />
      {lede ? (
        <p className="mt-5 text-base text-muted-foreground sm:text-lg">{lede}</p>
      ) : null}
    </div>
  )
}

export { Section, SectionHeading, RouteLine }
