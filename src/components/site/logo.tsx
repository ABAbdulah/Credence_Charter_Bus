import { existsSync } from "node:fs"
import { join } from "node:path"
import Image from "next/image"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

const logoFile = join(process.cwd(), "public", "brand", "logo.svg")

function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  if (existsSync(logoFile)) {
    return (
      <Image
        src="/brand/logo.svg"
        alt={siteConfig.name}
        width={200}
        height={48}
        priority
        unoptimized
        className="h-10 w-auto"
      />
    )
  }
  return (
    <span className="flex flex-col">
      <span
        className={cn(
          "font-heading text-2xl leading-none font-bold",
          tone === "dark" ? "text-primary" : "text-background"
        )}
      >
        Credence
      </span>
      <span
        className={cn(
          "text-[0.65rem] leading-normal font-semibold tracking-[0.32em] uppercase",
          tone === "dark" ? "text-accent-deep" : "text-accent"
        )}
      >
        Charter Bus
      </span>
    </span>
  )
}

export { Logo }
