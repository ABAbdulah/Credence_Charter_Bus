import * as React from "react"

import { cn } from "@/lib/utils"

function Container({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "wide" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "wide" ? "max-w-7xl" : "max-w-6xl",
        className
      )}
      {...props}
    />
  )
}

export { Container }
