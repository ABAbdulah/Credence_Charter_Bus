import Link from "next/link";

import { siteConfig } from "@/config/site";
import { blogPreviews } from "@/data/blogs";
import { services } from "@/data/services";
import { formatBlogDate } from "@/lib/blog-format";
import { JsonLd, webPageJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";
import { FeaturedFleetSection } from "@/components/site/featured-fleet-section";
import { Hero } from "@/components/site/hero";
import { HowItWorksSection } from "@/components/site/how-it-works-section";
import { ServiceGrid } from "@/components/site/service-grid";
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
      <JsonLd
        data={webPageJsonLd({
          name: `${siteConfig.name} — ${siteConfig.tagline}`,
          description:
            "Charter bus, mini bus, and sprinter van rentals for groups of every size, serving all 50 states. Request a free quote or call to plan your trip.",
          path: "/",
        })}
      />
      <Hero />
      <FeaturedFleetSection
        eyebrow="Our fleet"
        title="The right vehicle for your group"
        lede="From full-size coaches to sprinter vans, every vehicle comes with a professional driver and clear, all-in pricing."
      />
      <Section className="bg-secondary/40">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Wherever your group is headed"
            lede="Six ways we keep groups moving — each with a dedicated coordinator from first call to final drop-off."
          />
          <ServiceGrid services={services} />
        </Container>
      </Section>
      <HowItWorksSection lede="No accounts, no apps, no fine print — just a quote, an agreement, and a bus at your door." />
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
