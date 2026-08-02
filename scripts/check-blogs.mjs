import { existsSync, readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const contentDir = resolve(root, "src/content/blogs")
const imageDir = resolve(root, "public/blogs")

function slugsFrom(file) {
  const source = readFileSync(resolve(root, file), "utf8")
  return new Set([...source.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]))
}

const fleetSlugs = slugsFrom("src/data/fleet.ts")
const serviceSlugs = slugsFrom("src/data/services.ts")
const locations = JSON.parse(
  readFileSync(resolve(root, "src/data/locations/locations.json"), "utf8"),
)
const cityKeys = new Set(locations.cities.map((c) => `${c.stateSlug}/${c.slug}`))
const stateSlugs = new Set(locations.states.map((s) => s.slug))

const staticPaths = new Set([
  "/",
  "/quote",
  "/faq",
  "/about",
  "/contact",
  "/fleet",
  "/services",
  "/locations",
  "/blogs",
])

const files = readdirSync(contentDir).filter((f) => f.endsWith(".json") && f !== "index.json")
const postSlugs = new Set(files.map((f) => f.replace(/\.json$/, "")))
const failures = []
const fail = (slug, message) => failures.push(`${slug}: ${message}`)

function checkHref(slug, href, origin) {
  if (staticPaths.has(href)) return
  const fleet = href.match(/^\/fleet\/([a-z0-9-]+)$/)
  if (fleet) {
    if (!fleetSlugs.has(fleet[1])) fail(slug, `${origin} → unknown fleet category ${href}`)
    return
  }
  const service = href.match(/^\/services\/([a-z0-9-]+)$/)
  if (service) {
    if (!serviceSlugs.has(service[1])) fail(slug, `${origin} → unknown service ${href}`)
    return
  }
  const city = href.match(/^\/locations\/([a-z0-9-]+)\/([a-z0-9-]+)$/)
  if (city) {
    if (!cityKeys.has(`${city[1]}/${city[2]}`))
      fail(slug, `${origin} → city not in locations.json ${href}`)
    return
  }
  const state = href.match(/^\/locations\/([a-z0-9-]+)$/)
  if (state) {
    if (!stateSlugs.has(state[1])) fail(slug, `${origin} → unknown state ${href}`)
    return
  }
  const post = href.match(/^\/blogs\/([a-z0-9-]+)$/)
  if (post) {
    if (!postSlugs.has(post[1])) fail(slug, `${origin} → unknown post ${href}`)
    return
  }
  const archive = href.match(/^\/blogs\/state\/([a-z0-9-]+)$/)
  if (archive) {
    if (!stateSlugs.has(archive[1])) fail(slug, `${origin} → unknown blog archive ${href}`)
    return
  }
  fail(slug, `${origin} → unrecognised path ${href}`)
}

let inlineLinks = 0
let migrated = 0
let original = 0

for (const file of files) {
  const post = JSON.parse(readFileSync(resolve(contentDir, file), "utf8"))
  const slug = post.slug

  if (slug !== file.replace(/\.json$/, "")) fail(slug, `slug does not match filename ${file}`)
  if (post.source === "migrated") migrated += 1
  else original += 1

  if (/vanguard/i.test(JSON.stringify(post))) fail(slug, "contains a Vanguard token")
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) fail(slug, `bad date "${post.date}"`)
  if (!post.title) fail(slug, "empty title")
  if (!post.excerpt) fail(slug, "empty excerpt")
  if (!post.body?.length) fail(slug, "empty body")

  if (post.source === "migrated") {
    if (!post.state || !post.stateSlug) fail(slug, "missing state")
    else if (!stateSlugs.has(post.stateSlug))
      fail(slug, `stateSlug "${post.stateSlug}" not in locations.json`)
  }

  for (const image of [post.heroImage, post.extraImage]) {
    if (!image) continue
    if (!image.alt) fail(slug, `image ${image.src} has no alt text`)
    if (!image.width || !image.height) fail(slug, `image ${image.src} has no dimensions`)
    const local = image.src.replace(/^\/blogs\//, "")
    if (image.src.startsWith("/blogs/") && !existsSync(resolve(imageDir, local)))
      fail(slug, `missing image file ${image.src}`)
  }

  for (const link of post.planningLinks ?? []) {
    if (!link.label) fail(slug, `planningLink ${link.href} has no label`)
    checkHref(slug, link.href, "planningLinks")
  }

  for (const related of post.relatedPostSlugs ?? []) {
    if (!postSlugs.has(related)) fail(slug, `relatedPostSlugs → missing post "${related}"`)
    if (related === slug) fail(slug, "relatedPostSlugs contains itself")
  }

  for (const block of post.body ?? []) {
    const texts = block.type === "ul" ? block.items : [block.text]
    for (const text of texts) {
      for (const match of text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
        inlineLinks += 1
        if (!match[2].startsWith("/")) fail(slug, `inline link is not site-relative: ${match[2]}`)
        else checkHref(slug, match[2], "body")
      }
    }
  }
}

const indexPath = resolve(contentDir, "index.json")
if (!existsSync(indexPath)) failures.push("index.json missing")
else {
  const index = JSON.parse(readFileSync(indexPath, "utf8"))
  if (index.length !== files.length)
    failures.push(`index.json has ${index.length} entries, ${files.length} post files exist`)
  for (const entry of index)
    if (!postSlugs.has(entry.slug)) failures.push(`index.json references missing post ${entry.slug}`)
}

console.log(`
posts            ${files.length} (${migrated} migrated, ${original} original)
inline links     ${inlineLinks}
failures         ${failures.length}`)

for (const failure of failures.slice(0, 40)) console.log(`  ${failure}`)
if (failures.length > 40) console.log(`  … ${failures.length - 40} more`)

process.exit(failures.length > 0 ? 1 : 0)
