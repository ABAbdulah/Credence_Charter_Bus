import { services } from "@/data/services";
import { breadcrumbJsonLd, itemListJsonLd, JsonLd, webPageJsonLd } from "@/lib/jsonld";
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
      <JsonLd
        data={webPageJsonLd({
          type: "CollectionPage",
          name: "Group Transportation Services",
          description:
            "Corporate travel, event transportation, airport transfers, sports teams, weddings, and school trips — group transportation with a dedicated coordinator.",
          path: "/services",
          breadcrumbPath: "/services",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          services.map((service) => ({ name: service.name, path: `/services/${service.slug}` })),
        )}
      />
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
