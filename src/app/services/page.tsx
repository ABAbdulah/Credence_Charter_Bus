import type { Metadata } from "next";

import { services } from "@/data/services";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { ServiceCard } from "@/components/site/service-card";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Corporate travel, event transportation, airport transfers, sports teams, weddings, and school trips — group transportation with a dedicated coordinator.",
};

export default function ServicesPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Services"
            title="Group transportation, handled end to end"
            lede="Whatever brings your group together, we plan the route, assign the right vehicle, and stay reachable from first pickup to final drop-off."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
