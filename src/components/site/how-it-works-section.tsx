import { Container } from "@/components/ui/container"
import { Section, SectionHeading } from "@/components/ui/section"
import { BookingSteps } from "@/components/site/booking-steps"

function HowItWorksSection({
  lede,
  className,
}: {
  lede?: string
  className?: string
}) {
  return (
    <Section className={className}>
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Booked in three simple steps"
          lede={lede}
        />
        <div className="mt-10">
          <BookingSteps />
        </div>
      </Container>
    </Section>
  )
}

export { HowItWorksSection }
