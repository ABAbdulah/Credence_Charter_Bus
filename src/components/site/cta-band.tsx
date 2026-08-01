import Link from "next/link"
import { Phone } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

const onNavyFocus =
  "focus-visible:border-primary-foreground focus-visible:ring-primary-foreground/60"

function CtaBand({
  title = "Ready to plan your trip?",
  lede = "Tell us about your group and route — we'll send back a clear, all-in quote.",
}: {
  title?: string
  lede?: string
}) {
  return (
    <section className="bg-primary">
      <Container className="flex flex-col items-center gap-6 py-12 text-center sm:py-16">
        <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        <p className="max-w-xl text-base text-primary-foreground/85 sm:text-lg">
          {lede}
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Button asChild size="lg" variant="accent" className={onNavyFocus}>
            <a href={`tel:${siteConfig.phone.tel}`}>
              <Phone />
              Call Now — {siteConfig.phone.display}
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            className={`bg-card text-primary hover:bg-secondary ${onNavyFocus}`}
          >
            <Link href="/quote">Get a Free Quote</Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}

export { CtaBand }
