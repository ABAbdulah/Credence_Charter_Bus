import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getState, states } from "@/data/locations";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { StateCities } from "@/components/site/state-cities";

export const revalidate = 86400;

type Props = {
  params: Promise<{ state: string }>;
};

export function generateStaticParams() {
  return states.map((state) => ({ state: state.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) return {};
  return pageMetadata({
    title: `Charter Bus Rental in ${state.name}`,
    description: `Charter buses, mini buses, and sprinter vans across ${state.name}. Choose your city for local details, or request a free all-in quote for any ${state.abbr} trip.`,
    path: `/locations/${state.slug}`,
  });
}

export default async function StatePage({ params }: Props) {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) notFound();


  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: state.name, path: `/locations/${state.slug}` },
        ])}
      />
      <Section>
        <Container>
          <Link
            href="/locations"
            className="text-base font-medium text-muted-foreground hover:text-primary hover:underline"
          >
            ← All locations
          </Link>
          <SectionHeading
            as="h1"
            eyebrow={`${state.abbr} · ${state.region}`}
            title={`Charter Bus Rental in ${state.name}`}
            lede={`From city shuttles to statewide tours, we pair ${state.name} groups with the right vehicle and a licensed professional driver. Pick your city below for local details.`}
            className="mt-6"
          />
          <StateCities state={state} page={1} />
        </Container>
      </Section>
      <CtaBand
        title={`Planning a trip in ${state.name}?`}
        lede="Tell us your route and headcount — your all-in quote is free and usually ready the same day."
      />
    </>
  );
}
