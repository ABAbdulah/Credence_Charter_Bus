import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import { fleetCategories, getFleetCategory } from "@/data/fleet";
import { breadcrumbJsonLd, JsonLd, serviceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { FleetGallery } from "@/components/site/fleet-gallery";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return fleetCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getFleetCategory(slug);
  if (!category) return {};
  const rentalName = category.vehicleName.replace(/\b[a-z]/g, (c) => c.toUpperCase());
  const article = /^[aeiou]/i.test(category.vehicleName) ? "an" : "a";
  const capacity = category.capacity[0].toLowerCase() + category.capacity.slice(1);
  return pageMetadata({
    title: `${rentalName} Rental — ${category.capacity}`,
    description: `Rent ${article} ${category.vehicleName} for ${capacity} with a professional driver and a clear, itemized quote — available nationwide.`,
    path: `/fleet/${category.slug}`,
    ogImage: {
      url: category.images.exterior.src,
      alt: category.images.exterior.alt,
    },
  });
}

export default async function FleetCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getFleetCategory(slug);
  if (!category) notFound();

  const images = [
    category.images.exterior,
    category.images.interior,
    ...(category.images.extra ?? []),
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Fleet", path: "/fleet" },
          { name: category.name, path: `/fleet/${category.slug}` },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: `${category.name} Rental`,
          description: category.short,
          path: `/fleet/${category.slug}`,
        })}
      />
      <Section>
        <Container>
          <Link
            href="/fleet"
            className="text-base font-medium text-muted-foreground hover:text-primary hover:underline"
          >
            ← All vehicles
          </Link>
          <SectionHeading
            as="h1"
            eyebrow={category.capacity}
            title={category.name}
            lede={category.short}
            className="mt-6"
          />
          <div className="mt-10">
            <FleetGallery images={images} label={category.name} />
          </div>
          <p className="mt-10 max-w-3xl text-lg">{category.description}</p>
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-primary">
                On-board amenities
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {category.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-start gap-3">
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 text-accent-deep"
                    />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-primary">Ideal for</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {category.idealFor.map((use) => (
                  <li key={use} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-2 shrink-0 rounded-full bg-accent"
                    />
                    {use}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>
      <CtaBand
        title={`Ready to book a ${category.vehicleName}?`}
        lede="Request a quote and we'll confirm availability for your dates the same day."
      />
    </>
  );
}
