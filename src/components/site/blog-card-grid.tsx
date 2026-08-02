import Image from "next/image"
import Link from "next/link"

import type { BlogSummary } from "@/data/blogs"
import { formatBlogDate, framedAspect } from "@/lib/blog-format"
import { Card, CardContent } from "@/components/ui/card"

function BlogCardGrid({ posts }: { posts: BlogSummary[] }) {
  return (
    <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <li key={post.slug}>
          <Card className="relative h-full transition-shadow duration-150 hover:shadow-md">
            <Image
              src={post.heroImage.src}
              alt={post.heroImage.alt}
              width={post.heroImage.width}
              height={post.heroImage.height}
              priority={index < 3}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              style={{ aspectRatio: framedAspect(post.heroImage, 1.3, 1.9) }}
              className="w-full bg-muted object-cover"
            />
            <CardContent className="flex flex-col">
              <p className="text-sm text-muted-foreground">
                {formatBlogDate(post.date)}
                {post.state ? ` · ${post.state}` : ""}
              </p>
              <h2 className="mt-2 font-heading text-xl font-semibold text-primary">
                <Link
                  href={`/blogs/${post.slug}`}
                  className="after:absolute after:inset-0 group-hover/card:underline"
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
  )
}

export { BlogCardGrid }
