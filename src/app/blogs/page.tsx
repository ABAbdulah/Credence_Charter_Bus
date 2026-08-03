import { blogPage, blogPageCount } from "@/data/blogs";
import { blogJsonLd, breadcrumbJsonLd, itemListJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { BlogCardGrid } from "@/components/site/blog-card-grid";
import { BlogPagination } from "@/components/site/blog-pagination";
import { BlogStateFilter } from "@/components/site/blog-state-filter";
import { CtaBand } from "@/components/site/cta-band";

const title = "Charter Bus Travel Blog — Group Trip Guides";
const description =
  "Charter bus destination guides and group travel planning help: where to go, which vehicle fits your headcount, and what a bus trip actually involves.";

export const metadata = pageMetadata({ title, description, path: "/blogs" });

export default function BlogsPage() {
  const posts = blogPage(1);

  return (
    <>
      <JsonLd data={blogJsonLd({ name: title, description, path: "/blogs" })} />
      <JsonLd
        data={itemListJsonLd(
          posts.map((post) => ({ name: post.title, path: `/blogs/${post.slug}` })),
        )}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blogs" },
        ])}
      />
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Blog"
            title="Planning help, straight answers"
            lede="Destination guides and booking advice written by the people who plan these trips every day — no filler, no jargon, just what works."
          />
          <BlogStateFilter />
          <BlogCardGrid posts={posts} />
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
