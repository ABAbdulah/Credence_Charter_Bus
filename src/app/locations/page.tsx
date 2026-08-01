import Link from "next/link";

import { citiesOfState, statesByRegion } from "@/data/locations";
import { pageMetadata } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";

export const metadata = pageMetadata({
  title: "Charter Bus Rentals by Location",
  description:
    "Find charter bus, mini bus, and sprinter van rentals near you. Credence Charter Bus serves cities in all 50 states with licensed drivers and all-in quotes.",
  path: "/locations",
});

export default function LocationsPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Locations"
            title="Charter bus rentals across the country"
            lede="Choose your state to see the cities we serve. Don't see yours yet? We arrange trips in all 50 states — call us and we'll set it up."
          />
          <div className="mt-10 flex flex-col gap-12">
            {statesByRegion().map((group) => (
              <div key={group.region}>
                <h2 className="text-2xl font-semibold text-primary">
                  {group.region}
                </h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.states.map((state) => {
                    const cityCount = citiesOfState(state.slug).length;
                    return (
                      <li key={state.slug}>
                        <Card size="sm" className="h-full">
                          <CardContent>
                            <Link
                              href={`/locations/${state.slug}`}
                              className="text-lg font-semibold text-primary hover:underline"
                            >
                              {state.name}
                            </Link>
                            <p className="mt-1 text-muted-foreground">
                              {cityCount} {cityCount === 1 ? "city" : "cities"}{" "}
                              served
                            </p>
                          </CardContent>
                        </Card>
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
