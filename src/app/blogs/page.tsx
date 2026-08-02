import { blogPage, blogPageCount } from "@/data/blogs";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { BlogCardGrid } from "@/components/site/blog-card-grid";
import { BlogPagination } from "@/components/site/blog-pagination";
import { BlogStateFilter } from "@/components/site/blog-state-filter";
import { CtaBand } from "@/components/site/cta-band";

export const metadata = pageMetadata({
  title: "Blog — Group Travel Guides",
  description:
    "Destination guides and practical planning help for group travel: where to go, which vehicle fits, and what a charter bus trip actually involves.",
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
            lede="Destination guides and booking advice written by the people who plan these trips every day — no filler, no jargon, just what works."
          />
          <BlogStateFilter />
          <BlogCardGrid posts={blogPage(1)} />
          <BlogPagination page={1} totalPages={blogPageCount()} />
        </Container>
      </Section>
      <CtaBand
        title="Done reading, ready to plan?"
        lede="Send your trip details and get an itemized, all-in quote — usually the same day."
      />
    </>
  );
}
