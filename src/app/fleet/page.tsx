import Link from "next/link";

import { fleetCategories } from "@/data/fleet";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { FleetCard } from "@/components/site/fleet-card";

export const metadata = pageMetadata({
  title: "Our Fleet",
  description:
    "Charter buses, motor coaches, mini buses, sprinter vans, party buses, limousines, SUVs, and sedans — every vehicle with a professional driver and all-in pricing.",
  path: "/fleet",
});

export default function FleetPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Our fleet"
            title="Vehicles for every group size"
            lede="Ten vehicle types, one standard: clean, safe, and on time. Every rental includes a licensed professional driver and a clear, itemized quote."
          />
          <div className="mt-8 max-w-4xl rounded-xl bg-secondary/60 p-6 sm:p-8">
            <p>
              Searching for <strong>charter bus rental near me</strong>? We
              arrange group transportation{" "}
              <Link
                href="/locations"
                className="font-semibold text-primary underline underline-offset-4"
              >
                in all 50 states
              </Link>
              , matched to your pickup city. From a{" "}
              <strong>luxury charter bus</strong> with reclining seats, Wi-Fi,
              and an on-board restroom down to SUVs and sedans for small
              parties, every reservation is planned by a coordinator, driven by
              a vetted professional, and priced with one all-in quote — so your
              group rides in comfort and arrives on schedule.
            </p>
          </div>
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
