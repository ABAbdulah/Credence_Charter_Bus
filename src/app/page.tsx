import Link from "next/link";

import { siteConfig } from "@/config/site";
import { blogPreviews } from "@/data/blogs";
import { featuredFleet } from "@/data/fleet";
import { services } from "@/data/services";
import { formatBlogDate } from "@/lib/blog-format";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { BookingSteps } from "@/components/site/booking-steps";
import { CtaBand } from "@/components/site/cta-band";
import { FleetCard } from "@/components/site/fleet-card";
import { Hero } from "@/components/site/hero";
import { ServiceCard } from "@/components/site/service-card";
import { StatsBand } from "@/components/site/stats-band";

export const metadata = pageMetadata({
  title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
  description:
    "Charter bus, mini bus, and sprinter van rentals for groups of every size, serving all 50 states. Request a free quote or call to plan your trip.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Our fleet"
            title="The right vehicle for your group"
            lede="From full-size coaches to sprinter vans, every vehicle comes with a professional driver and clear, all-in pricing."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredFleet.map((category) => (
              <FleetCard key={category.slug} category={category} />
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/fleet">View the full fleet</Link>
            </Button>
          </div>
        </Container>
      </Section>
      <Section className="bg-secondary/40">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Wherever your group is headed"
            lede="Six ways we keep groups moving — each with a dedicated coordinator from first call to final drop-off."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Booked in three simple steps"
            lede="No accounts, no apps, no fine print — just a quote, an agreement, and a bus at your door."
          />
          <div className="mt-10">
            <BookingSteps />
          </div>
        </Container>
      </Section>
      <StatsBand />
      <Section className="bg-secondary/40">
        <Container>
          <SectionHeading
            eyebrow="From the blog"
            title="Planning help, straight answers"
            lede="Practical guides for booking group transportation with confidence."
          />
          <ul className="mt-10 grid gap-6 lg:grid-cols-3">
            {blogPreviews.map((post) => (
              <li key={post.slug}>
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col">
                    <p className="text-sm text-muted-foreground">
                      {formatBlogDate(post.date)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-primary">
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 flex-1 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
