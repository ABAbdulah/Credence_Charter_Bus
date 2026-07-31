"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { mainNav } from "@/config/nav"
import { cn } from "@/lib/utils"

function NavLinks({
  className,
  linkClassName,
}: {
  className?: string
  linkClassName?: string
}) {
  const pathname = usePathname()
  return (
    <ul className={className}>
      {mainNav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center rounded-md px-3 text-base font-medium text-foreground transition-colors duration-150 hover:bg-muted",
                active &&
                  "font-semibold text-primary underline decoration-accent decoration-2 underline-offset-8",
                linkClassName
              )}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export { NavLinks }
