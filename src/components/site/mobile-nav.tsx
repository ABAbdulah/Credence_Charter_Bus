"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Phone, X } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { NavLinks } from "@/components/site/nav-links"

function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = React.useState(pathname)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  React.useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <div className="lg:hidden">
      <Button
        ref={triggerRef}
        variant="outline"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
        {open ? "Close" : "Menu"}
      </Button>
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b bg-card shadow-md"
      >
        <nav aria-label="Main menu" className="px-4 py-4">
          <NavLinks
            className="flex flex-col gap-1"
            linkClassName="min-h-12 text-lg"
          />
          <div className="mt-4 flex flex-col gap-3 border-t pt-4">
            <Button asChild variant="accent" size="lg">
              <a href={`tel:${siteConfig.phone.tel}`}>
                <Phone />
                Call Now — {siteConfig.phone.display}
              </a>
            </Button>
            <Button asChild size="lg">
              <Link href="/quote">Get a Free Quote</Link>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  )
}

export { MobileNav }
