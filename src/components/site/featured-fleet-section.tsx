import Link from "next/link"

import { featuredFleet } from "@/data/fleet"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Section, SectionHeading } from "@/components/ui/section"
import { FleetGrid } from "@/components/site/fleet-grid"

function FeaturedFleetSection({
  eyebrow,
  title,
  lede,
  className,
}: {
  eyebrow: string
  title: string
  lede: string
  className?: string
}) {
  return (
    <Section className={className}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} lede={lede} />
        <FleetGrid categories={featuredFleet} />
        <div className="mt-8">
          <Button asChild variant="outline" size="lg">
            <Link href="/fleet">View the full fleet</Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}

export { FeaturedFleetSection }
