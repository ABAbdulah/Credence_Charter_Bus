import type { Metadata } from "next";

import { faqItems } from "@/data/faq";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Booking windows, pricing, drivers, cancellations, and accessibility — answers to the questions groups ask most.",
};

export default function FaqPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="FAQ"
            title="Answers before you ask"
            lede="Everything is written out below — no clicking to reveal. If your question isn't here, call us and a person will answer."
          />
          <dl className="mt-10 flex max-w-3xl flex-col gap-10">
            {faqItems.map((item) => (
              <div key={item.question}>
                <dt className="font-heading text-xl font-semibold text-primary">
                  {item.question}
                </dt>
                <dd className="mt-3">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
      <CtaBand
        title="Still have a question?"
        lede="Call us — a coordinator will answer it and can price your trip on the same call."
      />
    </>
  );
}
