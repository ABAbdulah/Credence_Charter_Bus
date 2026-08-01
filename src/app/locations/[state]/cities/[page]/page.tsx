import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getState, stateCityPageCount, states } from "@/data/locations";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { StateCities } from "@/components/site/state-cities";

export const revalidate = 86400;
export const dynamicParams = true;

type Props = {
  params: Promise<{ state: string; page: string }>;
};

export function generateStaticParams() {
  return states.flatMap((state) =>
    Array.from(
      { length: stateCityPageCount(state.slug) - 1 },
      (_, index) => ({ state: state.slug, page: String(index + 2) })
    )
  );
}

function resolvePage(stateSlug: string, raw: string) {
  const state = getState(stateSlug);
  if (!state) return null;
  if (!/^\d+$/.test(raw)) return null;
  const page = Number(raw);
  const totalPages = stateCityPageCount(stateSlug);
  if (page < 2 || page > totalPages) return null;
  return { state, page, totalPages };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, page: rawPage } = await params;
  const resolved = resolvePage(stateSlug, rawPage);
  if (!resolved) return {};
  const { state, page, totalPages } = resolved;
  return pageMetadata({
    title: `Charter Bus Rental in ${state.name} — Cities, Page ${page}`,
    description: `More ${state.name} cities served by Credence Charter Bus (page ${page} of ${totalPages}). Charter buses, mini buses, and sprinter vans with licensed drivers.`,
    path: `/locations/${state.slug}/cities/${page}`,
    noindex: true,
  });
}

export default async function StateCitiesPage({ params }: Props) {
  const { state: stateSlug, page: rawPage } = await params;
  const resolved = resolvePage(stateSlug, rawPage);
  if (!resolved) notFound();

  const { state, page } = resolved;

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
            href={`/locations/${state.slug}`}
            className="text-base font-medium text-muted-foreground hover:text-primary hover:underline"
          >
            ← {state.name} overview
          </Link>
          <SectionHeading
            as="h1"
            eyebrow={`${state.abbr} · ${state.region}`}
            title={`More cities we serve in ${state.name}`}
            lede={`Every community below gets the same service: a licensed professional driver, a vehicle sized to your group, and an itemized all-in quote.`}
            className="mt-6"
          />
          <StateCities state={state} page={page} />
        </Container>
      </Section>
      <CtaBand
        title={`Planning a trip in ${state.name}?`}
        lede="Tell us your route and headcount — your all-in quote is free and usually ready the same day."
      />
    </>
  );
}
