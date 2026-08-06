import { services } from "@/data/services";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { ServiceGrid } from "@/components/site/service-grid";

export const metadata = pageMetadata({
  title: "Group Transportation Services",
  description:
    "Corporate travel, event transportation, airport transfers, sports teams, weddings, and school trips — group transportation with a dedicated coordinator.",
  path: "/services",
});

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
          <ServiceGrid services={services} />
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
