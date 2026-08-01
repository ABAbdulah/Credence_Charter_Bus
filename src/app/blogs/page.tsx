import Image from "next/image";
import Link from "next/link";

import { allBlogPostsSorted } from "@/data/blogs";
import { formatBlogDate } from "@/lib/blog-format";
import { pageMetadata } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";

export const metadata = pageMetadata({
  title: "Blog — Group Travel Guides",
  description:
    "Practical guides for booking group transportation: wedding shuttles, school trips, corporate events, and how to read a charter quote.",
  path: "/blogs",
});

export default function BlogsPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Blog"
            title="Planning help, straight answers"
            lede="Guides written by the people who plan these trips every day — no filler, no jargon, just what works."
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allBlogPostsSorted().map((post) => (
              <li key={post.slug}>
                <Card className="h-full">
                  <Image
                    src={post.heroImage.src}
                    alt={post.heroImage.alt}
                    width={1602}
                    height={982}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-3/2 w-full object-cover"
                  />
                  <CardContent className="flex flex-col">
                    <p className="text-sm text-muted-foreground">
                      {formatBlogDate(post.date)}
                    </p>
                    <h2 className="mt-2 font-heading text-xl font-semibold text-primary">
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand
        title="Done reading, ready to plan?"
        lede="Send your trip details and get an itemized, all-in quote — usually the same day."
      />
    </>
  );
}
