import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Logo } from "@/components/site/logo"
import { MobileNav } from "@/components/site/mobile-nav"
import { NavLinks } from "@/components/site/nav-links"

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <Container className="relative flex items-center justify-between gap-4 py-3">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks className="flex items-center gap-1" />
        </nav>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="hidden flex-col rounded-md px-2 py-1 xl:flex"
          >
            <span className="text-sm leading-tight text-muted-foreground">
              Call us anytime
            </span>
            <span className="font-heading text-lg leading-tight font-bold text-primary">
              {siteConfig.phone.display}
            </span>
          </a>
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/quote">Get a Free Quote</Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}

export { Header }
