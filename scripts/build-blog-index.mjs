import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"

const root = resolve(import.meta.dirname, "..")
const contentDir = resolve(root, "src/content/blogs")

const regionByState = new Map(
  JSON.parse(
    readFileSync(resolve(root, "src/data/locations/locations.json"), "utf8"),
  ).states.map((entry) => [entry.name, entry.region]),
)

export function buildBlogIndex() {
  const entries = readdirSync(contentDir)
    .filter((file) => file.endsWith(".json") && file !== "index.json")
    .map((file) => JSON.parse(readFileSync(resolve(contentDir, file), "utf8")))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      seoTitle: post.seoTitle ?? post.title,
      excerpt: post.excerpt,
      date: post.date,
      state: post.state,
      stateAbbr: post.stateAbbr,
      stateSlug: post.stateSlug,
      stateRegion: regionByState.get(post.state) ?? "",
      heroImage: post.heroImage,
      source: post.source,
    }))
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))

  writeFileSync(
    resolve(contentDir, "index.json"),
    `${JSON.stringify(entries, null, 2)}\n`,
  )
  return entries
}

if (pathToFileURL(process.argv[1]).href === import.meta.url) {
  console.log(`index.json rebuilt: ${buildBlogIndex().length} posts`)
}
