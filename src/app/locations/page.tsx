import Link from "next/link";

import { citiesOfState, states, statesByRegion } from "@/data/locations";
import { networkSummary } from "@/data/network";
import { breadcrumbJsonLd, itemListJsonLd, JsonLd, webPageJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { NetworkHubs } from "@/components/site/network-hubs";
import { NetworkMap } from "@/components/site/network-map";
import { NetworkSummary } from "@/components/site/network-summary";

export const metadata = pageMetadata({
  title: "Charter Bus Rentals by Location",
  description:
    "Find charter bus, mini bus, and sprinter van rentals near you. Credence Charter Bus serves cities in all 50 states with licensed drivers and all-in quotes.",
  path: "/locations",
});

export default function LocationsPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          type: "CollectionPage",
          name: "Charter Bus Rentals by Location",
          description:
            "Find charter bus, mini bus, and sprinter van rentals near you. Credence Charter Bus serves cities in all 50 states with licensed drivers and all-in quotes.",
          path: "/locations",
          breadcrumbPath: "/locations",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          states.map((state) => ({ name: state.name, path: `/locations/${state.slug}` })),
        )}
      />
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Nationwide operations network"
            title="Door-to-door charter service across all 50 states"
            lede={`Our ${networkSummary.hubs} operations hubs are drawn from the ${networkSummary.cities.toLocaleString(
              "en-US"
            )} cities we serve, grouped so that every region has coverage close by. Wherever your group starts, there is a hub within reach.`}
          />
          <NetworkMap />
          <NetworkSummary />
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHeading
            title="Operations hubs by region"
            lede="Each hub anchors the cities around it. Open one to see fleet, pricing, and pickup details for that area."
          />
          <NetworkHubs />
        </Container>
      </Section>
      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <Container>
          <SectionHeading
            title="Browse every city we serve"
            lede="Choose your state to see the full list. Don't see yours yet? We arrange trips in all 50 states — call us and we'll set it up."
          />
          <div className="mt-10 flex flex-col gap-12">
            {statesByRegion().map((group) => (
              <div key={group.region}>
                <h3 className="text-2xl font-semibold text-primary">
                  {group.region}
                </h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.states.map((state) => {
                    const cityCount = citiesOfState(state.slug).length;
                    return (
                      <li key={state.slug}>
                        <Link
                          href={`/locations/${state.slug}`}
                          className="group block h-full rounded-xl"
                        >
                          <Card
                            size="sm"
                            className="h-full transition-colors duration-150 group-hover:bg-muted group-hover:ring-primary/30"
                          >
                            <CardContent>
                              <span className="text-lg font-semibold text-primary group-hover:underline">
                                {state.name}
                              </span>
                              <p className="mt-1 text-muted-foreground">
                                {cityCount}{" "}
                                {cityCount === 1 ? "city" : "cities"} served
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand
        title="Traveling somewhere not listed?"
        lede="We arrange charters nationwide. Tell us your route and we'll cover it."
      />
    </>
  );
}
