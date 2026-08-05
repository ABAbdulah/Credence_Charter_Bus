import Image from "next/image"

import { cn } from "@/lib/utils"

function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-2 sm:gap-2.5">
      <Image
        src="/brand/credence-mark.svg"
        alt=""
        width={994}
        height={608}
        priority
        unoptimized
        className="h-9 w-auto max-[360px]:hidden sm:h-10"
      />
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
    </span>
  )
}

export { Logo }
