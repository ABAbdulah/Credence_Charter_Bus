"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Phone, X } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { NavLinks } from "@/components/site/nav-links"

const focusableSelector = "a[href], button:not([disabled])"

function MobileNav({ brand }: { brand: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = React.useState(pathname)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)

  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  const close = React.useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  React.useEffect(() => {
    if (!open) return

    const { body } = document
    const restoreOverflow = body.style.overflow
    body.style.overflow = "hidden"

    const panel = panelRef.current
    panel?.querySelector<HTMLElement>(focusableSelector)?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close()
        return
      }
      if (event.key !== "Tab" || !panel) return
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSelector)
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (document.activeElement !== (event.shiftKey ? first : last)) return
      event.preventDefault()
      const target = event.shiftKey ? last : first
      target.focus()
    }

    const desktop = window.matchMedia("(min-width: 64rem)")
    function onBreakpointChange() {
      if (desktop.matches) setOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    desktop.addEventListener("change", onBreakpointChange)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      desktop.removeEventListener("change", onBreakpointChange)
      body.style.overflow = restoreOverflow
    }
  }, [open, close])

  return (
    <div className="lg:hidden">
      <Button
        ref={triggerRef}
        variant="outline"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <Menu />
        Menu
      </Button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            aria-hidden="true"
            onClick={close}
            className="absolute inset-0 bg-foreground/60 animate-in fade-in duration-200"
          />
          <div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute inset-y-0 right-0 flex w-[min(21rem,86vw)] flex-col bg-card shadow-2xl animate-in slide-in-from-right duration-200"
          >
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
              {brand}
              <Button
                variant="ghost"
                size="icon"
                onClick={close}
                aria-label="Close menu"
              >
                <X />
              </Button>
            </div>
            <nav
              aria-label="Main menu"
              className="flex-1 overflow-y-auto px-2 py-4"
            >
              <NavLinks
                className="flex flex-col gap-1"
                linkClassName="min-h-12 text-lg"
                orientation="vertical"
              />
            </nav>
            <div className="flex flex-col gap-3 border-t px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <Button asChild variant="accent" size="lg">
                <a href={`tel:${siteConfig.phone.tel}`}>
                  <Phone />
                  {siteConfig.phone.display}
                </a>
              </Button>
              <Button asChild size="lg">
                <Link href="/quote">Get a Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { MobileNav }
