import type { Metadata } from "next";
import Image from "next/image";

import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { StatsBand } from "@/components/site/stats-band";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Credence Charter Bus arranges group transportation in all 50 states — licensed drivers, well-maintained vehicles, and quotes without surprises.",
};

const values = [
  {
    title: "Safety before schedule",
    body: "Every driver is licensed, vetted, and rested. Every vehicle is inspected and maintained on a fixed program. We'd rather tell you a hard truth about timing than cut a corner.",
  },
  {
    title: "Straight answers",
    body: "Our quotes are itemized and all-in. If fuel, tolls, or driver lodging apply, they're on the page before you sign — never on the invoice after.",
  },
  {
    title: "Reachable, start to finish",
    body: "You get one coordinator from first call to final drop-off, and a dispatch line that answers around the clock. No phone trees, no ticket numbers.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="About us"
            title="Group travel, done the dependable way"
            lede={`${siteConfig.name} arranges charter buses, mini buses, and vans for groups across all 50 states.`}
          />
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-4 text-lg">
              <p>
                Booking a bus shouldn&apos;t feel like a gamble. Too many groups
                have stories about vague quotes, unreachable dispatchers, or a
                vehicle that didn&apos;t match the photos. We built {siteConfig.name}{" "}
                to be the company those stories aren&apos;t about.
              </p>
              <p>
                Our network pairs well-maintained vehicles with professional,
                courteous drivers in cities across the country. Whether
                it&apos;s a church retreat, a corporate shuttle that runs every
                quarter, or a wedding weekend with three venues, the same
                promise applies: a clear quote up front, a clean vehicle on
                time, and a human being on the phone whenever you need one.
              </p>
            </div>
            <Image
              src="/fleet/motor-coach-exterior.png"
              alt="Motorcoach from the Credence network on the road"
              width={1774}
              height={887}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[3/2] w-full rounded-xl object-cover ring-1 ring-foreground/10"
            />
          </div>
        </Container>
      </Section>
      <StatsBand />
      <Section>
        <Container>
          <SectionHeading eyebrow="What we stand by" title="Three promises on every trip" />
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.title}>
                <h3 className="text-xl font-semibold text-primary">
                  {value.title}
                </h3>
                <p className="mt-3 text-muted-foreground">{value.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
