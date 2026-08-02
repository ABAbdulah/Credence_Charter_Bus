import { Phone } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { HeroMedia } from "@/components/site/hero-media"
import { HeroQuoteForm } from "@/components/site/hero-quote-form"

const trustPoints = [
  `Serving groups since ${siteConfig.established}`,
  "All 50 states",
  "Licensed & insured",
]

function Hero() {
  return (
    <section className="relative isolate bg-primary">
      <HeroMedia />
      <Container
        size="wide"
        className="relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_26rem] lg:gap-14 lg:py-16"
      >
        <div className="max-w-xl">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-accent">
            Nationwide group transportation
          </p>
          <h1 className="mt-3 text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
            {siteConfig.hero.fallbackHeadline}
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
            {siteConfig.hero.fallbackSubheadline}
          </p>
          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-base text-primary-foreground sm:text-lg">
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
          <Button
            asChild
            size="lg"
            className="mt-8 bg-card text-primary hover:bg-secondary focus-visible:border-primary-foreground focus-visible:ring-primary-foreground/60"
          >
            <a href={`tel:${siteConfig.phone.tel}`}>
              <Phone />
              Call Now — {siteConfig.phone.display}
            </a>
          </Button>
        </div>
        <HeroQuoteForm />
      </Container>
    </section>
  )
}

export { Hero }
