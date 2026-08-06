import { CheckCircle2 } from "lucide-react";

import { pageMetadata } from "@/lib/seo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { AffiliateForm } from "@/components/site/affiliate-form";

export const metadata = pageMetadata({
  title: "Affiliate Program",
  description:
    "Operate a charter fleet? Partner with Credence Charter Bus for a steady stream of trips in your service area, fast payments, and dedicated support.",
  path: "/affiliates",
});

const benefits = [
  {
    title: "Steady trip volume",
    detail:
      "Charter requests in your service area, matched to your fleet and availability.",
  },
  {
    title: "Fast, transparent payment",
    detail:
      "Clear trip details up front and prompt payment when the work is done.",
  },
  {
    title: "You stay in control",
    detail:
      "Accept or decline any trip. We handle the customer relationship, booking, and payment processing — you provide the transportation.",
  },
  {
    title: "Dedicated support",
    detail:
      "A partnerships team that answers, and onboarding that doesn't drag on.",
  },
];

const requirements = [
  "Commercial insurance coverage",
  "A well-maintained fleet that meets safety standards",
  "Professional, properly licensed drivers",
  "A record of taking care of customers",
];

export default function AffiliatesPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Partnerships"
            title="Grow with our affiliate network"
            lede="We work with vetted operators across the country to serve trips we can't cover with our own fleet. If you run a quality operation, there's work waiting."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardHeader>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{benefit.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <Section className="bg-secondary/40">
        <Container>
          <SectionHeading
            title="What we require"
            lede="Every partner carries the same credentials we hold ourselves — your vehicles carry our customers."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {requirements.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-accent-deep"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              title="Start the conversation"
              lede="Tell us about your company and fleet. If it looks like a fit, our partnerships team will follow up with next steps and onboarding details."
            />
            <div className="mt-10">
              <AffiliateForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
