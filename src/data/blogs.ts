import blogIndex from "@/content/blogs/index.json"

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }

export type BlogImage = { src: string; alt: string; width: number; height: number }

export type BlogSummary = {
  slug: string
  title: string
  excerpt: string
  date: string
  state: string
  stateAbbr: string
  stateSlug: string
  stateRegion: string
  heroImage: BlogImage
  source: "original" | "migrated"
}

export type BlogPost = BlogSummary & {
  extraImage: BlogImage | null
  body: BlogBlock[]
  planningLinks: { label: string; href: string }[]
  relatedPostSlugs: string[]
}

const summaries = (blogIndex as BlogSummary[])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))

const bySlug = new Map(summaries.map((post) => [post.slug, post]))

export function allBlogPostsSorted() {
  return summaries
}

export function getBlogSummary(slug: string) {
  return bySlug.get(slug)
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  if (!bySlug.has(slug)) return undefined
  const loaded = await import(`../content/blogs/${slug}.json`)
  return loaded.default as BlogPost
}

export const BLOG_PAGE_SIZE = 24

export function blogPageCount() {
  return Math.max(1, Math.ceil(summaries.length / BLOG_PAGE_SIZE))
}

export function blogPage(page: number) {
  const start = (page - 1) * BLOG_PAGE_SIZE
  return summaries.slice(start, start + BLOG_PAGE_SIZE)
}

const stateArchives = summaries.reduce((archives, post) => {
  if (!post.stateSlug) return archives
  const existing = archives.get(post.stateSlug)
  if (existing) existing.posts.push(post)
  else
    archives.set(post.stateSlug, {
      slug: post.stateSlug,
      name: post.state,
      abbr: post.stateAbbr,
      region: post.stateRegion,
      posts: [post],
    })
  return archives
}, new Map<string, BlogStateArchive>())

export type BlogStateArchive = {
  slug: string
  name: string
  abbr: string
  region: string
  posts: BlogSummary[]
}

export const BLOG_REGIONS = ["Northeast", "Midwest", "South", "West"] as const

export function blogStates() {
  return [...stateArchives.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export function getBlogState(slug: string) {
  return stateArchives.get(slug)
}

export const blogPreviews = summaries.slice(0, 3).map((post) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  date: post.date,
}))
