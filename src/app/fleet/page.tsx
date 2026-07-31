import type { Metadata } from "next";

import { fleetCategories } from "@/data/fleet";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { FleetCard } from "@/components/site/fleet-card";

export const metadata: Metadata = {
  title: "Our Fleet",
  description:
    "Charter buses, mini buses, sprinter vans, party buses, limousines, SUVs, and sedans — every vehicle with a professional driver and all-in pricing.",
};

export default function FleetPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Our fleet"
            title="Vehicles for every group size"
            lede="Eight vehicle types, one standard: clean, safe, and on time. Every rental includes a licensed professional driver and a clear, itemized quote."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fleetCategories.map((category) => (
              <FleetCard key={category.slug} category={category} />
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand title="Not sure which vehicle fits?" lede="Tell us your group size and route — we'll recommend the right option and send an all-in quote." />
    </>
  );
}
