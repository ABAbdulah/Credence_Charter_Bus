import type { Metadata } from "next";
import { Check } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { QuoteForm } from "@/components/site/quote-form";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Tell us your group size, dates, and route — we'll send back a clear, all-in charter quote, usually the same day.",
};

const reassurances = [
  "Free and no-obligation — compare us with anyone",
  "All-in pricing: driver, fuel, tolls, and taxes included",
  "A response within one business day, usually sooner",
];

export default function QuotePage() {
  return (
    <Section>
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Free quote"
          title="Tell us about your trip"
          lede="A few details are all we need. A real coordinator reads every request and replies with an itemized quote."
        />
        <ul className="mt-6 flex max-w-2xl flex-col gap-2">
          {reassurances.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-accent-deep"
              />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-10 max-w-3xl">
          <QuoteForm />
        </div>
      </Container>
    </Section>
  );
}
