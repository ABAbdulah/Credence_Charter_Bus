import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getFleetCategory } from "@/data/fleet";
import { getService, services } from "@/data/services";
import { breadcrumbJsonLd, JsonLd, serviceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { CheckList } from "@/components/ui/check-list";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { DetailPageHeader } from "@/components/site/detail-page-header";
import { FleetGrid } from "@/components/site/fleet-grid";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seoTitle,
    description: service.short,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const relatedFleet = service.relatedFleetSlugs
    .map(getFleetCategory)
    .filter((category) => category !== undefined);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: service.name,
          description: service.short,
          path: `/services/${service.slug}`,
        })}
      />
      <Section>
        <Container>
          <DetailPageHeader
            backHref="/services"
            backLabel="All services"
            eyebrow="Services"
            title={service.name}
            lede={service.short}
          />
          <div className="mt-10 max-w-3xl">
            {service.intro.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-lg first:mt-0">
                {paragraph}
              </p>
            ))}
          </div>
          <h2 className="mt-10 text-2xl font-semibold text-primary">
            What we handle
          </h2>
          <CheckList
            items={service.whatWeHandle}
            className="mt-4 grid max-w-3xl gap-3 sm:grid-cols-2"
          />
        </Container>
      </Section>
      <Section className="bg-secondary/40">
        <Container>
          <SectionHeading
            eyebrow="Recommended vehicles"
            title={`Popular choices for ${service.name.toLowerCase()}`}
          />
          <FleetGrid categories={relatedFleet} />
        </Container>
      </Section>
      <CtaBand
        title={`Planning ${service.name.toLowerCase()}?`}
        lede="Tell us about your group and we'll send back a clear, all-in quote — usually the same day."
      />
    </>
  );
}
