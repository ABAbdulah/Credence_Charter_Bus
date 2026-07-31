import Link from "next/link";
import { Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";

export default function Home() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Nationwide group transportation"
            title={siteConfig.hero.fallbackHeadline}
            lede={siteConfig.hero.fallbackSubheadline}
          />
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/quote">Get a Free Quote</Link>
            </Button>
            <Button asChild size="lg" variant="accent">
              <a href={`tel:${siteConfig.phone.tel}`}>
                <Phone />
                Call Now — {siteConfig.phone.display}
              </a>
            </Button>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
