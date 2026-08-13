import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  citiesOfState,
  distanceMiles,
  getCity,
  getState,
  locationsBuildConfig,
  nearbyCities,
  topCities,
} from "@/data/locations";
import { services } from "@/data/services";
import { breadcrumbJsonLd, JsonLd, organizationId } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { buildCityCopy } from "@/lib/variation";
import { BulletDot } from "@/components/ui/bullet-list";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { FeaturedFleetSection } from "@/components/site/featured-fleet-section";
import { HowItWorksSection } from "@/components/site/how-it-works-section";

export const revalidate = 86400;
export const dynamicParams = true;

type Props = {
  params: Promise<{ state: string; city: string }>;
};

export function generateStaticParams() {
  return topCities(locationsBuildConfig.prebuildCityLimit).map((city) => ({
    state: city.stateSlug,
    city: city.slug,
  }));
}

const cityCopy = cache((stateSlug: string, citySlug: string) => {
  const state = getState(stateSlug);
  const city = getCity(stateSlug, citySlug);
  if (!state || !city) return null;
  const nearby = nearbyCities(city);
  return {
    state,
    city,
    nearby,
    copy: buildCityCopy({
      seed: `${stateSlug}/${citySlug}`,
      city: city.name,
      state: state.name,
      abbr: state.abbr,
      region: state.region,
      population: city.population,
      nearby: nearby.map((entry) => ({
        name: entry.name,
        miles: Math.max(1, Math.round(distanceMiles(city, entry))),
      })),
    }),
  };
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const data = cityCopy(stateSlug, citySlug);
  if (!data) return {};
  return pageMetadata({
    title: `Charter Bus Rental in ${data.city.name}, ${data.state.name}`,
    description: data.copy.description,
    path: `/locations/${stateSlug}/${citySlug}`,
  });
}

export default async function CityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params;
  const data = cityCopy(stateSlug, citySlug);
  if (!data) notFound();

  const { state, city, nearby, copy } = data;
  const pageUrl = `${siteConfig.url}/locations/${state.slug}/${city.slug}`;
  const otherStateCities = citiesOfState(state.slug)
    .filter((entry) => entry.slug !== city.slug)
    .slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Charter Bus Rental in ${city.name}, ${state.name}`,
    serviceType: "Charter bus rental",
    description: copy.description,
    url: pageUrl,
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: { "@type": "State", name: state.name },
      geo: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lng },
    },
    provider: { "@id": organizationId },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: state.name, path: `/locations/${state.slug}` },
          { name: city.name, path: `/locations/${state.slug}/${city.slug}` },
        ])}
      />
      <Section>
        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-base text-muted-foreground">
              <li>
                <Link href="/locations" className="hover:text-primary hover:underline">
                  Locations
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/locations/${state.slug}`}
                  className="hover:text-primary hover:underline"
                >
                  {state.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                {city.name}
              </li>
            </ol>
          </nav>
          <SectionHeading
            as="h1"
            eyebrow={`${city.name}, ${state.abbr}`}
            title={`Charter Bus Rental in ${city.name}, ${state.name}`}
            className="mt-6"
          />
          <div className="mt-6 flex max-w-3xl flex-col gap-4 text-lg">
            <p>{copy.opening}</p>
            <p>{copy.scale}</p>
            <p>{copy.detail}</p>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/quote">Get a Free Quote</Link>
            </Button>
            <Button asChild size="lg" variant="accent">
              <a href={`tel:${siteConfig.phone.tel}`}>
                <Phone />
                Call Now — {siteConfig.phone.display}
              </a>
            </Button>
          </div>
        </Container>
      </Section>
      <FeaturedFleetSection
        eyebrow="Vehicles"
        title={`Popular vehicles in ${city.name}`}
        lede="Every rental includes a licensed driver and an itemized, all-in quote."
        className="bg-secondary/40"
      />
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Services"
            title={`What ${city.name} groups book most`}
          />
          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="flex min-h-11 items-center gap-3 rounded-md px-3 font-medium text-primary hover:bg-muted hover:underline"
                >
                  <BulletDot className="mt-0" />
                  {service.name} in {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <HowItWorksSection className="bg-secondary/40" />
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Popular routes"
            title={`Group trips from ${city.name}`}
            lede="One-way transfers, round trips, and multi-day tours — these nearby routes come up often, and anywhere else is fair game."
          />
          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {nearby.map((destination) => (
              <li key={`${destination.stateSlug}-${destination.slug}`}>
                <Link
                  href={`/locations/${destination.stateSlug}/${destination.slug}`}
                  className="flex min-h-11 items-center rounded-md px-3 font-medium text-primary hover:bg-muted hover:underline"
                >
                  {city.name} to {destination.name} charter bus
                </Link>
              </li>
            ))}
          </ul>
          {otherStateCities.length > 0 && (
            <>
              <h3 className="mt-10 text-xl font-semibold text-primary">
                More {state.name} cities
              </h3>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {otherStateCities.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`/locations/${state.slug}/${entry.slug}`}
                      className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {entry.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/locations/${state.slug}`}
                    className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                  >
                    All of {state.name} →
                  </Link>
                </li>
              </ul>
            </>
          )}
        </Container>
      </Section>
      <CtaBand
        title={`Ready to book in ${city.name}?`}
        lede="Send your trip details and a coordinator will reply with an all-in quote — usually the same day."
      />
    </>
  );
}
