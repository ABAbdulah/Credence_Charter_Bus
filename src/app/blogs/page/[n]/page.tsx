import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { blogPage, blogPageCount } from "@/data/blogs";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { BlogCardGrid } from "@/components/site/blog-card-grid";
import { BlogPagination } from "@/components/site/blog-pagination";
import { BlogStateFilter } from "@/components/site/blog-state-filter";
import { CtaBand } from "@/components/site/cta-band";

type Props = {
  params: Promise<{ n: string }>;
};

export function generateStaticParams() {
  return Array.from({ length: blogPageCount() - 1 }, (_, index) => ({
    n: String(index + 2),
  }));
}

function resolvePage(raw: string) {
  if (!/^\d+$/.test(raw)) return null;
  const page = Number(raw);
  const totalPages = blogPageCount();
  if (page < 2 || page > totalPages) return null;
  return { page, totalPages };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  const resolved = resolvePage(n);
  if (!resolved) return {};
  return pageMetadata({
    title: `Blog — Page ${resolved.page}`,
    description: `More group travel guides and destination write-ups (page ${resolved.page} of ${resolved.totalPages}).`,
    path: `/blogs/page/${resolved.page}`,
    noindex: true,
  });
}

export default async function BlogsPaginatedPage({ params }: Props) {
  const { n } = await params;
  const resolved = resolvePage(n);
  if (!resolved) notFound();

  const { page, totalPages } = resolved;

  return (
    <>
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow={`Blog · page ${page} of ${totalPages}`}
            title="More group travel guides"
            lede="Every guide pairs a destination with the vehicles and services that suit the trip."
          />
          <BlogStateFilter />
          <BlogCardGrid posts={blogPage(page)} />
          <BlogPagination page={page} totalPages={totalPages} />
        </Container>
      </Section>
      <CtaBand
        title="Done reading, ready to plan?"
        lede="Send your trip details and get an itemized, all-in quote — usually the same day."
      />
    </>
  );
}
