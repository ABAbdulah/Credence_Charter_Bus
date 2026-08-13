import { breadcrumbJsonLd, JsonLd, webPageJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckList } from "@/components/ui/check-list";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { DriverForm } from "@/components/site/driver-form";

export const metadata = pageMetadata({
  title: "Drive With Us",
  description:
    "Join the Credence Charter Bus driver team — competitive pay, a modern fleet, ongoing training, and routes across all 50 states. Apply online today.",
  path: "/drivers",
});

const benefits = [
  {
    title: "Competitive pay",
    detail: "Strong base compensation with bonus opportunities on top.",
  },
  {
    title: "See the country",
    detail: "Routes run nationwide — the windshield view changes every week.",
  },
  {
    title: "Modern, maintained fleet",
    detail: "You drive vehicles that are serviced on schedule, not on failure.",
  },
  {
    title: "Flexible scheduling",
    detail: "Full-time, part-time, and weekend arrangements to fit your life.",
  },
  {
    title: "Real support",
    detail:
      "Dispatch answers when you call, and safety training never stops.",
  },
  {
    title: "Room to grow",
    detail: "Senior routes, trainer roles, and operations paths for the long haul.",
  },
];

const requirements = [
  "Commercial Driver's License (CDL) with a passenger (P) endorsement",
  "Clean driving record with no major violations",
  "Prior commercial driving experience, preferred",
  "Ability to pass a DOT physical examination",
  "Courteous, customer-first professionalism",
  "Punctuality and dependability, every trip",
];

const training = [
  "Safety protocols and defensive driving",
  "Customer service for group travel",
  "Vehicle operation and daily inspection",
  "Route planning and navigation",
  "Emergency response procedures",
];

export default function DriversPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: "Drive With Us",
          description:
            "Join the Credence Charter Bus driver team — competitive pay, a modern fleet, ongoing training, and routes across all 50 states. Apply online today.",
          path: "/drivers",
          breadcrumbPath: "/drivers",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Drive With Us", path: "/drivers" },
        ])}
      />
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Careers"
            title="Drive with Credence"
            lede="Our drivers are the reason groups come back. If you take pride in a safe, on-time, friendly trip, we'd like to meet you."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardHeader>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{benefit.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <Section className="bg-secondary/40">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              title="What we look for"
              lede="Every driver on our roster meets the same bar before their first trip."
            />
            <CheckList items={requirements} className="mt-8 space-y-3" />
          </div>
          <div>
            <SectionHeading
              title="Training that continues"
              lede="New drivers complete a full onboarding program, and refresher training keeps everyone current with regulations and best practices."
            />
            <CheckList items={training} className="mt-8 space-y-3" />
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              title="Apply to drive"
              lede="Tell us about yourself and your experience behind the wheel. Our team reviews every application and responds about next steps."
            />
            <div className="mt-10">
              <DriverForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
