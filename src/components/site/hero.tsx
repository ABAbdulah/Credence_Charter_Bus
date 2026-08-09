import Link from "next/link"
import { Phone } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { HeroMedia } from "@/components/site/hero-media"

const trustPoints = [
  `Serving groups since ${siteConfig.established}`,
  "All 50 states",
  "Licensed & insured",
]

const onNavyFocus =
  "focus-visible:border-primary-foreground focus-visible:ring-primary-foreground/60"

function Hero() {
  return (
    <section className="relative isolate bg-primary">
      <HeroMedia />
      <Container className="relative py-16 sm:py-24 lg:py-28">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-accent">
          Nationwide group transportation
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
          {siteConfig.hero.fallbackHeadline}
        </h1>
        <p className="mt-6 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
          {siteConfig.hero.fallbackSubheadline}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
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
        <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-base text-primary-foreground sm:text-lg">
          {trustPoints.map((point) => (
            <li key={point} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-accent"
              />
              {point}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export { Hero }
