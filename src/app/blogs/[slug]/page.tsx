import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { allBlogPostsSorted, getBlogPost, type BlogBlock } from "@/data/blogs";
import { formatBlogDate, readingMinutes } from "@/lib/blog-format";
import { breadcrumbJsonLd, JsonLd, organizationId } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allBlogPostsSorted().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blogs/${post.slug}`,
    ogType: "article",
    publishedTime: post.date,
    ogImage: { url: post.heroImage.src, alt: post.heroImage.alt },
  });
}

function BlockRenderer({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-10 text-2xl font-semibold text-primary">{block.text}</h2>;
    case "ul":
      return (
        <ul className="mt-4 flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 size-2 shrink-0 rounded-full bg-accent"
              />
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return <p className="mt-4 text-lg">{block.text}</p>;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = post.relatedPostSlugs
    .map(getBlogPost)
    .filter((entry) => entry !== undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: `${siteConfig.url}${post.heroImage.src}`,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@id": organizationId },
    mainEntityOfPage: `${siteConfig.url}/blogs/${post.slug}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blogs" },
          { name: post.title, path: `/blogs/${post.slug}` },
        ])}
      />
      <Section>
        <Container className="max-w-4xl">
          <Link
            href="/blogs"
            className="text-base font-medium text-muted-foreground hover:text-primary hover:underline"
          >
            ← All articles
          </Link>
          <article className="mt-6">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-accent-deep">
              {formatBlogDate(post.date)} · {readingMinutes(post.body)} min read
            </p>
            <h1 className="mt-3 text-4xl font-bold text-primary sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              By the {siteConfig.name} team
            </p>
            <Image
              src={post.heroImage.src}
              alt={post.heroImage.alt}
              width={1602}
              height={982}
              priority
              sizes="(min-width: 1024px) 56rem, 100vw"
              className="mt-8 aspect-2/1 w-full rounded-xl object-cover ring-1 ring-foreground/10"
            />
            <div className="mt-4">
              {post.body.map((block, index) => (
                <BlockRenderer key={index} block={block} />
              ))}
            </div>
          </article>
          <aside className="mt-12 rounded-xl bg-secondary/40 p-6">
            <h2 className="text-xl font-semibold text-primary">
              Plan this trip
            </h2>
            <ul className="mt-3 flex flex-col gap-1">
              {post.planningLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {link.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-primary">
                Keep reading
              </h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2">
                {related.map((entry) => (
                  <li key={entry.slug}>
                    <Card size="sm" className="h-full">
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {formatBlogDate(entry.date)}
                        </p>
                        <h3 className="mt-2 font-heading text-lg font-semibold text-primary">
                          <Link
                            href={`/blogs/${entry.slug}`}
                            className="hover:underline"
                          >
                            {entry.title}
                          </Link>
                        </h3>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
