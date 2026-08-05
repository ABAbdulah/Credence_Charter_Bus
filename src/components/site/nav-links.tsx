"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

import { mainNav } from "@/config/nav"
import { cn } from "@/lib/utils"

function NavLinks({
  className,
  linkClassName,
  orientation = "horizontal",
}: {
  className?: string
  linkClassName?: string
  orientation?: "horizontal" | "vertical"
}) {
  const pathname = usePathname()
  const [openLabel, setOpenLabel] = React.useState<string | null>(null)
  const [prevPathname, setPrevPathname] = React.useState(pathname)
  const listRef = React.useRef<HTMLUListElement>(null)

  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpenLabel(null)
  }

  React.useEffect(() => {
    if (!openLabel || orientation !== "horizontal") return
    function onPointerDown(event: PointerEvent) {
      if (!listRef.current?.contains(event.target as Node)) setOpenLabel(null)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      listRef.current
        ?.querySelector<HTMLElement>('button[aria-expanded="true"]')
        ?.focus()
      setOpenLabel(null)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [openLabel, orientation])

  const itemClass = (active: boolean) =>
    cn(
      "flex min-h-11 items-center rounded-md px-2 text-base font-medium text-foreground transition-colors duration-150 hover:bg-muted xl:px-3",
      active &&
        "font-semibold text-primary underline decoration-accent decoration-2 underline-offset-8",
      linkClassName
    )

  return (
    <ul ref={listRef} className={className}>
      {mainNav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`)
        if (!item.children) {
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={itemClass(active)}
              >
                {item.label}
              </Link>
            </li>
          )
        }
        const open = openLabel === item.label
        const childActive = item.children.some(
          (child) =>
            pathname === child.href ||
            (child.href !== item.href && pathname.startsWith(`${child.href}/`))
        )
        const submenuId = `nav-submenu-${item.label
          .toLowerCase()
          .replace(/\s+/g, "-")}`
        return (
          <li
            key={item.href}
            className={orientation === "horizontal" ? "relative" : undefined}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={submenuId}
              onClick={() => setOpenLabel(open ? null : item.label)}
              className={cn(itemClass(active || childActive), "w-full gap-1")}
            >
              {item.label}
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "size-4 shrink-0 transition-transform duration-150",
                  open && "rotate-180",
                  orientation === "vertical" && "ml-auto"
                )}
              />
            </button>
            {open && (
              <ul
                id={submenuId}
                className={
                  orientation === "horizontal"
                    ? "absolute left-0 top-full z-50 mt-1 max-h-[70vh] w-64 overflow-y-auto rounded-md border bg-card p-2 shadow-lg"
                    : "mt-1 mb-2 flex flex-col border-l-2 border-accent/40 pl-3"
                }
              >
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      aria-current={pathname === child.href ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center rounded-md px-3 text-base text-foreground transition-colors duration-150 hover:bg-muted",
                        pathname === child.href &&
                          "font-semibold text-primary"
                      )}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export { NavLinks }
