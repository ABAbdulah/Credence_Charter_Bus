import Link from "next/link"
import { Phone } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { HeroMedia } from "@/components/site/hero-media"

const onNavyFocus =
  "focus-visible:border-primary-foreground focus-visible:ring-primary-foreground/60"

const trustPoints = [
  `Serving groups since ${siteConfig.established}`,
  "All 50 states",
  "Licensed & insured",
]

function Hero() {
  return (
    <section className="bg-primary bg-linear-to-br from-primary to-[#24365c]">
      <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-accent">
            Nationwide group transportation
          </p>
          <h1 className="mt-3 text-4xl font-bold text-primary-foreground sm:text-5xl">
            {siteConfig.hero.fallbackHeadline}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/85">
            {siteConfig.hero.fallbackSubheadline}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" variant="accent" className={onNavyFocus}>
              <Link href="/quote">Get a Free Quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className={`bg-card text-primary hover:bg-secondary ${onNavyFocus}`}
            >
              <a href={`tel:${siteConfig.phone.tel}`}>
                <Phone />
                Call Now — {siteConfig.phone.display}
              </a>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-primary-foreground/85">
            {trustPoints.map((point, index) => (
              <li key={point} className="flex items-center gap-3">
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-accent"
                  />
                )}
                {point}
              </li>
            ))}
          </ul>
        </div>
        <HeroMedia />
      </Container>
    </section>
  )
}

export { Hero }
