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

/**
 * Three migrated posts inherited a wrong state from the legacy site's own tag
 * ("Mount Washington, New Hampshire" filed under Washington). Where a title
 * ends in a state name, that name is authoritative — longest wins, so
 * "…Moundsville, West Virginia" resolves to West Virginia, not Virginia.
 */
const stateNamesByLength = locations.states
  .map((s) => s.name)
  .sort((a, b) => b.length - a.length)

const stateByAbbr = new Map(locations.states.map((s) => [s.abbr, s.name]))

function stateFromTitle(title) {
  const trimmed = title.trim()
  const named = stateNamesByLength.find((name) => trimmed.endsWith(name))
  if (named) return named
  // "Washington, DC" ends in an abbreviation, not a state name.
  const abbr = trimmed.match(/,\s*([A-Z]{2})$/)
  return abbr ? stateByAbbr.get(abbr[1]) : undefined
}

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

/**
 * The SEO standard every finished post must meet. It is enforced as a hard
 * failure only on `reviewed: true` posts — the rest are still faithful ports
 * and are reported as a backlog so progress through the corpus is visible.
 */
const PRIMARY_PHRASE = /charter bus|bus rental|motorcoach|group transportation/i

function seoIssues(post) {
  const issues = []
  const blocks = post.body ?? []
  const text = blocks
    .map((b) => (b.type === "ul" ? b.items.join(" ") : b.text))
    .join(" ")
  const plain = text.replace(/\[([^\]]+)\]\(\/[^)]*\)/g, "$1")
  const links = [...text.matchAll(/\[[^\]]+\]\((\/[^)]*)\)/g)].map((m) => m[1])
  const count = (prefix) => links.filter((l) => l.startsWith(prefix)).length
  const seoTitle = post.seoTitle ?? post.title
  const firstPara = blocks.find((b) => b.type === "p")?.text ?? ""

  if (seoTitle.length > 60) issues.push(`seoTitle ${seoTitle.length} chars (max 60)`)
  if (!PRIMARY_PHRASE.test(seoTitle)) issues.push("seoTitle has no primary phrase")
  if (post.excerpt.length < 70 || post.excerpt.length > 160)
    issues.push(`excerpt ${post.excerpt.length} chars (want 70-160)`)
  if (/…|\.\.\./.test(post.excerpt)) issues.push("excerpt is truncated prose")
  if (!PRIMARY_PHRASE.test(post.excerpt)) issues.push("excerpt has no primary phrase")
  if (
    !PRIMARY_PHRASE.test(
      firstPara.replace(/\[([^\]]+)\]\(\/[^)]*\)/g, "$1").split(/\s+/).slice(0, 100).join(" "),
    )
  )
    issues.push("no primary phrase in first 100 words")

  const headings = blocks.filter((b) => b.type === "h2")
  if (headings.length < 4) issues.push(`${headings.length} h2 headings (min 4)`)
  else if (!headings.some((h) => PRIMARY_PHRASE.test(h.text)))
    issues.push("no h2 carries the primary phrase")

  if (plain.split(/\s+/).filter(Boolean).length < 800) issues.push("under 800 words")
  if (count("/fleet/") < 2) issues.push(`${count("/fleet/")} in-body fleet links (min 2)`)
  if (count("/services/") < 1) issues.push("no in-body service link")
  if (count("/locations") < 1) issues.push("no in-body location link")
  if (!links.includes("/quote")) issues.push("no in-body /quote link")

  const nearMe = (plain.match(/near me/gi) ?? []).length
  if (nearMe > 1) issues.push(`"near me" used ${nearMe}x (max 1)`)

  for (const [label, image] of [["hero", post.heroImage], ["extra", post.extraImage]]) {
    if (!image) continue
    if (image.alt.trim() === post.title.trim()) issues.push(`${label} alt is just the title`)
    else if (image.alt.trim().length < 25) issues.push(`${label} alt is too thin`)
  }
  if (post.extraImage && post.extraImage.alt.trim() === post.heroImage.alt.trim())
    issues.push("both images share one alt")
  if ((post.relatedPostSlugs ?? []).length < 2) issues.push("fewer than 2 related posts")

  return issues
}

let inlineLinks = 0
let migrated = 0
let original = 0
const seoBacklog = []
let seoClean = 0

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
    const titled = stateFromTitle(post.title)
    if (titled && titled !== post.state)
      fail(slug, `title ends in "${titled}" but state is "${post.state}"`)
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

  const issues = seoIssues(post)
  if (issues.length === 0) seoClean += 1
  else if (post.reviewed) for (const issue of issues) fail(slug, `SEO — ${issue}`)
  else seoBacklog.push({ slug, issues })
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

const issueTally = new Map()
for (const entry of seoBacklog)
  for (const issue of entry.issues) {
    const key = issue.replace(/\d+/g, "N")
    issueTally.set(key, (issueTally.get(key) ?? 0) + 1)
  }

console.log(`
posts            ${files.length} (${migrated} migrated, ${original} original)
inline links     ${inlineLinks}
SEO complete     ${seoClean}/${files.length}
SEO backlog      ${seoBacklog.length}
failures         ${failures.length}`)

if (issueTally.size > 0) {
  console.log(`\nopen SEO issues across the backlog:`)
  for (const [issue, n] of [...issueTally.entries()].sort((a, b) => b[1] - a[1]))
    console.log(`  ${String(n).padStart(4)}  ${issue}`)
}

if (failures.length > 0) console.log(`\nfailures:`)
for (const failure of failures.slice(0, 40)) console.log(`  ${failure}`)
if (failures.length > 40) console.log(`  … ${failures.length - 40} more`)

process.exit(failures.length > 0 ? 1 : 0)
