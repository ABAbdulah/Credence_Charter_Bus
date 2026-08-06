import Link from "next/link";

import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { CheckList } from "@/components/ui/check-list";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { BookingSteps } from "@/components/site/booking-steps";
import { CtaBand } from "@/components/site/cta-band";

export const metadata = pageMetadata({
  title: "How Booking Works",
  description:
    "Renting a charter bus with Credence takes three steps: request a quote, review your itemized estimate, and sign the agreement. Here's what to have ready.",
  path: "/how-to-book",
});

const checklist = [
  "Number of passengers traveling",
  "Departure and return dates and times",
  "Pickup point and destination, with addresses if you have them",
  "Preferred vehicle type, if you have one in mind",
  "Onboard amenities you'd like — Wi-Fi, restroom, outlets",
  "Any accessibility needs in your group",
  "Your name, email, and phone number",
];

const afterSubmit = [
  {
    title: "We review and match",
    body: "A coordinator reads your request and matches the trip to the right vehicle from our fleet — usually the same day.",
  },
  {
    title: "You get an itemized quote",
    body: "The estimate covers driver, fuel, tolls, and taxes, with vehicle details and photos, so you can compare with confidence.",
  },
  {
    title: "You confirm and pay securely",
    body: "Review the agreement, sign, and process payment. Your final confirmation lists every pickup time and stop.",
  },
];

export default function HowToBookPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Booking guide"
            title="How to book a charter bus"
            lede="From first quote to final confirmation, the process is three steps — and the first one takes about two minutes."
          />
          <div className="mt-12">
            <BookingSteps />
          </div>
        </Container>
      </Section>
      <Section className="bg-secondary/40">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              title="What to have ready"
              lede="The more detail you give us up front, the more accurate your first quote will be."
            />
            <CheckList items={checklist} className="mt-8 space-y-3" />
            <p className="mt-6 text-muted-foreground">
              Not sure about something? Leave it blank — your coordinator will
              help you fill in the gaps.
            </p>
          </div>
          <div>
            <SectionHeading
              title="What happens after you submit"
              lede="Every request gets a human on the other end, not an automated price."
            />
            <ol className="mt-8 space-y-6">
              {afterSubmit.map((step, index) => (
                <li key={step.title} className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-lg font-bold text-accent-foreground"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHeading
            title="Prefer to talk it through?"
            lede="Our team walks groups through the whole process every day — call and we'll plan it together."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/quote">Start My Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`tel:${siteConfig.phone.tel}`}>
                Call {siteConfig.phone.display}
              </a>
            </Button>
          </div>
        </Container>
      </Section>
      <CtaBand
        title="Ready when you are"
        lede="Send the trip details and a coordinator will price it — free, no obligation."
      />
    </>
  );
}
