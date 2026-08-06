import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogStates, getBlogState } from "@/data/blogs";
import { breadcrumbJsonLd, itemListJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { BlogCardGrid } from "@/components/site/blog-card-grid";
import { BlogStateFilter } from "@/components/site/blog-state-filter";
import { CtaBand } from "@/components/site/cta-band";
import { DetailPageHeader } from "@/components/site/detail-page-header";

type Props = {
  params: Promise<{ state: string }>;
};

export function generateStaticParams() {
  return blogStates().map((state) => ({ state: state.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params;
  const archive = getBlogState(slug);
  if (!archive) return {};
  return pageMetadata({
    title: `${archive.name} Charter Bus Trip Guides`,
    description: `${archive.posts.length} charter bus destination guides for group trips across ${archive.name} — where to go, which vehicle fits, and how to plan each trip.`,
    path: `/blogs/state/${archive.slug}`,
  });
}

export default async function BlogStatePage({ params }: Props) {
  const { state: slug } = await params;
  const archive = getBlogState(slug);
  if (!archive) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blogs" },
          { name: archive.name, path: `/blogs/state/${archive.slug}` },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          archive.posts.map((post) => ({
            name: post.title,
            path: `/blogs/${post.slug}`,
          })),
        )}
      />
      <Section>
        <Container>
          <DetailPageHeader
            backHref="/blogs"
            backLabel="All guides"
            eyebrow={`${archive.abbr} · ${archive.posts.length} ${archive.posts.length === 1 ? "guide" : "guides"}`}
            title={`Group travel guides for ${archive.name}`}
            lede={`Destinations across ${archive.name} worth booking a group trip to, with the vehicle and service that suits each one.`}
          />
          <BlogStateFilter activeSlug={archive.slug} />
          <BlogCardGrid posts={archive.posts} />
          <Link
            href={`/locations/${archive.slug}`}
            className="mt-10 flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
          >
            Charter bus rental across {archive.name} →
          </Link>
        </Container>
      </Section>
      <CtaBand
        title={`Planning a trip in ${archive.name}?`}
        lede="Tell us your route and headcount — your all-in quote is free and usually ready the same day."
      />
    </>
  );
}
