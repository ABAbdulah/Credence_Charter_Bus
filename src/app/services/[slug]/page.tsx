import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import { getFleetCategory } from "@/data/fleet";
import { getService, services } from "@/data/services";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { FleetCard } from "@/components/site/fleet-card";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.short,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const relatedFleet = service.relatedFleetSlugs
    .map(getFleetCategory)
    .filter((category) => category !== undefined);

  return (
    <>
      <Section>
        <Container>
          <Link
            href="/services"
            className="text-base font-medium text-muted-foreground hover:text-primary hover:underline"
          >
            ← All services
          </Link>
          <SectionHeading
            as="h1"
            eyebrow="Services"
            title={service.name}
            lede={service.short}
            className="mt-6"
          />
          <div className="mt-10 max-w-3xl">
            {service.intro.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-lg first:mt-0">
                {paragraph}
              </p>
            ))}
          </div>
          <h2 className="mt-10 text-2xl font-semibold text-primary">
            What we handle
          </h2>
          <ul className="mt-4 grid max-w-3xl gap-3 sm:grid-cols-2">
            {service.whatWeHandle.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-accent-deep"
                />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section className="bg-secondary/40">
        <Container>
          <SectionHeading
            eyebrow="Recommended vehicles"
            title={`Popular choices for ${service.name.toLowerCase()}`}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedFleet.map((category) => (
              <FleetCard key={category.slug} category={category} />
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand
        title={`Planning ${service.name.toLowerCase()}?`}
        lede="Tell us about your group and we'll send back a clear, all-in quote — usually the same day."
      />
    </>
  );
}
