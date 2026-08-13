import Link from "next/link";

import { fleetCategories } from "@/data/fleet";
import { breadcrumbJsonLd, itemListJsonLd, JsonLd, webPageJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { FleetGrid } from "@/components/site/fleet-grid";

export const metadata = pageMetadata({
  title: "Charter Bus Rental Fleet — Coaches, Mini Buses & Vans",
  description:
    "Motor coaches, coach buses, mini buses, sprinter vans, party buses, limousines, SUVs, and sedans — every charter bus rental includes a professional driver and a clear, itemized quote.",
  path: "/fleet",
});

export default function FleetPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          type: "CollectionPage",
          name: "Charter Bus Rental Fleet — Coaches, Mini Buses & Vans",
          description:
            "Motor coaches, coach buses, mini buses, sprinter vans, party buses, limousines, SUVs, and sedans — every charter bus rental includes a professional driver and a clear, itemized quote.",
          path: "/fleet",
          breadcrumbPath: "/fleet",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Fleet", path: "/fleet" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          fleetCategories.map((category) => ({
            name: category.name,
            path: `/fleet/${category.slug}`,
          })),
        )}
      />
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Our fleet"
            title="Vehicles for every group size"
            lede="Nine vehicle types, one standard: clean, safe, and on time. Every rental includes a licensed professional driver and a clear, itemized quote."
          />
          <FleetGrid categories={fleetCategories} />
          <div className="mt-10 rounded-xl bg-secondary/60 p-6 sm:p-8">
            <p>
              When you search for <strong>charter bus rental near me</strong>,
              what you need is a company that already works where you are. We
              serve{" "}
              <Link
                href="/locations"
                className="font-semibold text-primary underline underline-offset-4"
              >
                all 50 states
              </Link>{" "}
              and plan every trip from your pickup city. Large groups travel in
              a <strong>luxury charter bus</strong>{" "}
              with reclining seats, Wi-Fi, and an on-board restroom; smaller
              parties ride mini buses, sprinter vans, SUVs, or sedans. However
              far you&apos;re going, a coordinator plans the reservation and a
              vetted professional drives it.
            </p>
          </div>
        </Container>
      </Section>
      <CtaBand title="Not sure which vehicle fits?" lede="Tell us your group size and route — we'll recommend the right option and send a clear, itemized quote." />
    </>
  );
}
