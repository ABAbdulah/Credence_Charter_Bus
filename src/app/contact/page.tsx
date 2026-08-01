import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Call, email, or request a quote — the Credence Charter Bus team answers around the clock.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Talk to a real person"
            lede="Our dispatch line answers 24/7. For trip planning, the fastest route to a price is a quote request — we usually respond the same day."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <span
                  aria-hidden="true"
                  className="mb-2 flex size-12 items-center justify-center rounded-full bg-secondary text-primary"
                >
                  <Phone className="size-6" />
                </span>
                <CardTitle>By phone</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-3">
                <p>Reservations and dispatch, around the clock.</p>
                <a
                  href={`tel:${siteConfig.phone.tel}`}
                  className="font-heading text-xl font-bold text-primary hover:underline"
                >
                  {siteConfig.phone.display}
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <span
                  aria-hidden="true"
                  className="mb-2 flex size-12 items-center justify-center rounded-full bg-secondary text-primary"
                >
                  <Mail className="size-6" />
                </span>
                <CardTitle>By email</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-3">
                <p>Itineraries, invoices, and general questions.</p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {siteConfig.email}
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <span
                  aria-hidden="true"
                  className="mb-2 flex size-12 items-center justify-center rounded-full bg-secondary text-primary"
                >
                  <MapPin className="size-6" />
                </span>
                <CardTitle>Main office</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.city}, {siteConfig.address.state}{" "}
                  {siteConfig.address.zip}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/quote">Request a Free Quote</Link>
            </Button>
          </div>
        </Container>
      </Section>
      <CtaBand
        title="Planning a trip right now?"
        lede="Skip the back-and-forth — send us the details and get an all-in quote."
      />
    </>
  );
}
