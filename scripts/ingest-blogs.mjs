import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const usage = `Usage: node scripts/ingest-blogs.mjs [options]

Ports the destination guides from the legacy site into src/content/blogs/.

Runs in two stages. Fetching is cached to .cache/vanguard-blogs/ so the parser
can be re-run offline without touching the network again.

  --slugs a,b,c     only these slugs
  --limit N         only the first N slugs
  --gap MS          delay between requests (default 20000)
  --timeout MS      per-request timeout (default 110000)
  --skip-fetch      parse the existing cache, make no requests
  --skip-parse      fetch and cache only, write no JSON
  --skip-images     do not download hero images
  --force           re-fetch cached pages and overwrite reviewed posts
  --retry-failed    only re-attempt slugs listed in the failure log

Requires sharp (already present as a Next.js dependency) to trim the black
letterbox bars the legacy images ship with.`

const ORIGIN = "https://vanguardcharterbus.com"
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

/**
 * The legacy site publishes no dates, so migrated posts are spread evenly across
 * this window. Order comes from a hash of the slug, which keeps the assignment
 * identical on every rebuild and independent of which subset is being re-run.
 */
const DATE_WINDOW_START = Date.UTC(2024, 0, 15)
const DATE_WINDOW_END = Date.UTC(2026, 4, 15)

const root = resolve(import.meta.dirname, "..")
const cacheDir = resolve(root, ".cache/vanguard-blogs")
const contentDir = resolve(root, "src/content/blogs")
const imageDir = resolve(root, "public/blogs")
const failureLog = resolve(cacheDir, "failures.json")

function parseArgs(argv) {
  const options = {
    slugs: null,
    limit: null,
    gap: 20000,
    timeout: 110000,
    skipFetch: false,
    skipParse: false,
    skipImages: false,
    force: false,
    retryFailed: false,
  }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = () => argv[(i += 1)]
    if (arg === "--slugs") options.slugs = next().split(",").map((s) => s.trim()).filter(Boolean)
    else if (arg === "--limit") options.limit = Number(next())
    else if (arg === "--gap") options.gap = Number(next())
    else if (arg === "--timeout") options.timeout = Number(next())
    else if (arg === "--skip-fetch") options.skipFetch = true
    else if (arg === "--skip-parse") options.skipParse = true
    else if (arg === "--skip-images") options.skipImages = true
    else if (arg === "--force") options.force = true
    else if (arg === "--retry-failed") options.retryFailed = true
    else if (arg === "--help" || arg === "-h") {
      console.log(usage)
      process.exit(0)
    } else {
      console.error(`Unknown option: ${arg}\n\n${usage}`)
      process.exit(1)
    }
  }
  return options
}

const options = parseArgs(process.argv.slice(2))
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function readBrand() {
  const source = readFileSync(resolve(root, "src/config/site.ts"), "utf8")
  const match = source.match(/name:\s*"([^"]+)"/)
  if (!match) throw new Error("Could not read siteConfig.name from src/config/site.ts")
  return { full: match[1], short: match[1].split(" ")[0] }
}

const brand = readBrand()

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
}

function decodeEntities(value) {
  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-zA-Z]+);/g, (match, name) => ENTITIES[name] ?? match)
}

function stripTags(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, "")
}

function clean(html) {
  return decodeEntities(stripTags(html)).replace(/\s+/g, " ").trim()
}

let brandHits = 0

function scrubBrand(text) {
  const before = text
  const result = text
    .replace(/Vanguard\s+CHARTER\s+BUS/gi, brand.full)
    .replace(/Vanguard\s+Charter\s+Bus/gi, brand.full)
    .replace(/vanguardcharterbus\.com/gi, "")
    .replace(/Vanguard/gi, brand.short)
  if (result !== before) brandHits += 1
  return result
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml" },
    signal: AbortSignal.timeout(options.timeout),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

async function resolveSlugs() {
  const indexPath = resolve(cacheDir, "_index.html")
  let html
  if (existsSync(indexPath) && !options.force) {
    html = readFileSync(indexPath, "utf8")
  } else {
    html = await fetchText(`${ORIGIN}/blogs`)
    writeFileSync(indexPath, html)
    await sleep(options.gap)
  }
  const found = [...html.matchAll(/href="\/blogs\/([a-z0-9-]+)"/g)].map((m) => m[1])
  return [...new Set(found)].sort()
}

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/['.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/**
 * 29 legacy posts render no state link in their header, so the state is read
 * off the end of the title instead. Matching prefers the last name to end in
 * the title, then the longest, so "…Moundsville, West Virginia" resolves to
 * West Virginia rather than Virginia.
 */
const stateEntries = JSON.parse(
  readFileSync(resolve(root, "src/data/locations/locations.json"), "utf8"),
).states

const regionByState = new Map(stateEntries.map((entry) => [entry.name, entry.region]))

function stateFromTitle(title) {
  let best = null
  for (const entry of stateEntries) {
    const index = title.lastIndexOf(entry.name)
    if (index === -1) continue
    const end = index + entry.name.length
    if (!best || end > best.end || (end === best.end && entry.name.length > best.name.length))
      best = { name: entry.name, abbr: entry.abbr, end }
  }
  return best
}

function hashSlug(value) {
  let hash = 5381
  for (let i = 0; i < value.length; i += 1) hash = ((hash * 33) ^ value.charCodeAt(i)) >>> 0
  return hash
}

function buildDateMap(allSlugs) {
  const ordered = [...allSlugs].sort((a, b) => hashSlug(a) - hashSlug(b) || a.localeCompare(b))
  const span = DATE_WINDOW_END - DATE_WINDOW_START
  const map = new Map()
  ordered.forEach((slug, index) => {
    const offset = ordered.length > 1 ? Math.round((index * span) / (ordered.length - 1)) : 0
    map.set(slug, new Date(DATE_WINDOW_START + offset).toISOString().slice(0, 10))
  })
  return map
}

function bodyContainer(main) {
  const start = main.indexOf('white-space:pre-wrap"')
  if (start === -1) return null
  const open = main.lastIndexOf("<div", start)
  let depth = 0
  let i = open
  while (i < main.length) {
    if (main.startsWith("<div", i)) depth += 1
    else if (main.startsWith("</div>", i)) {
      depth -= 1
      if (depth === 0) return main.slice(open, i)
    }
    i += 1
  }
  return null
}

function looksLikeHeading(text, index) {
  if (index === 0) return false
  if (text.length > 90) return false
  if (/[.:;!?,]$/.test(text)) return false
  return text.split(/\s+/).length <= 12
}

function parseBody(container) {
  const nodes = []
  for (const match of container.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) {
    nodes.push({ at: match.index, kind: "p", text: clean(match[1]) })
  }
  for (const match of container.matchAll(
    /<div style="[^"]*padding-left:1\.5rem[^"]*"[^>]*>([\s\S]*?)<\/div>/g,
  )) {
    const text = clean(match[1]).replace(/^[••]\s*/, "")
    nodes.push({ at: match.index, kind: "li", text })
  }
  nodes.sort((a, b) => a.at - b.at)

  const blocks = []
  let paragraphIndex = 0
  for (const node of nodes) {
    if (!node.text) continue
    if (node.kind === "li") {
      const last = blocks.at(-1)
      if (last?.type === "ul") last.items.push(scrubBrand(node.text))
      else blocks.push({ type: "ul", items: [scrubBrand(node.text)] })
      continue
    }
    const text = scrubBrand(node.text)
    if (looksLikeHeading(node.text, paragraphIndex)) blocks.push({ type: "h2", text })
    else blocks.push({ type: "p", text })
    paragraphIndex += 1
  }
  return blocks
}

function parsePost(slug, html, date) {
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/)
  if (!mainMatch) throw new Error("no <main> element")
  const main = mainMatch[0]

  const titleMatch = main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
  if (!titleMatch) throw new Error("no <h1>")
  const title = scrubBrand(clean(titleMatch[1]))

  const stateLinks = [...main.matchAll(/href="\/locations\/state\/([a-z]{2})"[^>]*>([\s\S]*?)<\/a>/g)]
  const fromTitle = stateLinks.length === 0 ? stateFromTitle(title) : null
  const state = stateLinks[0] ? clean(stateLinks[0][2]) : (fromTitle?.name ?? "")
  const stateAbbr = stateLinks[0] ? stateLinks[0][1].toUpperCase() : (fromTitle?.abbr ?? "")

  const container = bodyContainer(main)
  if (!container) throw new Error("no article body container")
  const body = parseBody(container)
  if (body.length === 0) throw new Error("empty body")

  const images = [...main.matchAll(/%2Fassets%2Fblogs%2F([^&"]+\.webp)/g)].map((m) =>
    decodeURIComponent(m[1]),
  )
  const heroFile = images.find((name) => name.includes("-1.webp")) ?? images[0] ?? null
  const extraFile = images.find((name) => name.includes("-2.webp")) ?? null

  const related = [
    ...new Set(
      [...main.matchAll(/class="related-card"[^>]*href="\/blogs\/([a-z0-9-]+)"/g)].map((m) => m[1]),
    ),
  ].filter((entry) => entry !== slug)

  const firstParagraph = body.find((block) => block.type === "p")?.text ?? ""
  const excerpt =
    firstParagraph.length > 175 ? `${firstParagraph.slice(0, 172).trimEnd()}…` : firstParagraph

  const wordCount = body.reduce((total, block) => {
    const text = block.type === "ul" ? block.items.join(" ") : block.text
    return total + text.split(/\s+/).length
  }, 0)

  return {
    post: {
      slug,
      title,
      excerpt,
      date,
      state,
      stateAbbr,
      stateSlug: state ? slugify(state) : "",
      heroImage: { src: `/blogs/${slug}.webp`, alt: title },
      extraImage: extraFile ? { src: `/blogs/${slug}-2.webp`, alt: title } : null,
      body,
      planningLinks: [],
      relatedPostSlugs: related,
      source: "migrated",
      reviewed: false,
    },
    sourceImages: { hero: heroFile, extra: extraFile },
    wordCount,
  }
}

async function downloadImage(remoteName, targetPath) {
  if (existsSync(targetPath)) return { skipped: true, bytes: 0 }
  const res = await fetch(`${ORIGIN}/assets/blogs/${encodeURIComponent(remoteName)}`, {
    headers: { "user-agent": UA },
    signal: AbortSignal.timeout(options.timeout),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  writeFileSync(targetPath, buffer)
  return { skipped: false, bytes: buffer.length }
}

/**
 * Some legacy heroes are squares with the photo letterboxed inside flat bars.
 * The bars are dark grey rather than black, and plenty of images have none at
 * all, so a brightness threshold alone both misses and over-crops. A bar row is
 * identified by being FLAT (near-zero variance) as well as dark, and no more
 * than MAX_TRIM_RATIO is ever taken off either edge — that keeps genuinely dark
 * photographs (night skies, the Milky Way post) intact. Trimming is idempotent.
 */
const BAR_MAX_MEAN = 60
const BAR_MAX_DEVIATION = 4
const MAX_TRIM_RATIO = 0.3

async function trimLetterbox(path) {
  const { default: sharp } = await import("sharp")
  const input = readFileSync(path)
  const { data, info } = await sharp(input)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rowIsBar = (y) => {
    const offset = y * info.width
    let total = 0
    for (let x = 0; x < info.width; x += 1) total += data[offset + x]
    const mean = total / info.width
    if (mean > BAR_MAX_MEAN) return false
    let variance = 0
    for (let x = 0; x < info.width; x += 1) variance += (data[offset + x] - mean) ** 2
    return Math.sqrt(variance / info.width) < BAR_MAX_DEVIATION
  }

  const limit = Math.floor(info.height * MAX_TRIM_RATIO)
  let top = 0
  while (top < limit && rowIsBar(top)) top += 1
  let bottom = info.height - 1
  while (bottom > info.height - 1 - limit && bottom > top && rowIsBar(bottom)) bottom -= 1

  const height = bottom - top + 1
  if (top === 0 && height === info.height) return { width: info.width, height: info.height }

  const output = await sharp(input)
    .extract({ left: 0, top, width: info.width, height })
    .webp({ quality: 82 })
    .toBuffer()
  writeFileSync(path, output)
  return { width: info.width, height }
}

for (const dir of [cacheDir, contentDir, imageDir]) mkdirSync(dir, { recursive: true })

const allSlugs = await resolveSlugs()
const dateMap = buildDateMap(allSlugs)

let slugs = allSlugs
if (options.retryFailed) {
  const logged = JSON.parse(existsSync(failureLog) ? readFileSync(failureLog, "utf8") : "[]")
  slugs = [...new Set(logged.map((entry) => entry.slug))]
} else if (options.slugs) {
  slugs = options.slugs
}
if (options.limit) slugs = slugs.slice(0, options.limit)

const unknown = slugs.filter((slug) => !dateMap.has(slug))
if (unknown.length > 0) {
  console.error(`Not present in the legacy blog index: ${unknown.join(", ")}`)
  process.exit(1)
}

console.log(`${slugs.length} of ${allSlugs.length} slug(s) targeted`)

const failures = []
let fetched = 0
let cachedAlready = 0

if (!options.skipFetch) {
  for (const [i, slug] of slugs.entries()) {
    const cachePath = resolve(cacheDir, `${slug}.html`)
    if (existsSync(cachePath) && !options.force) {
      cachedAlready += 1
      continue
    }
    const started = Date.now()
    try {
      const html = await fetchText(`${ORIGIN}/blogs/${slug}`)
      writeFileSync(cachePath, html)
      fetched += 1
      const secs = ((Date.now() - started) / 1000).toFixed(1)
      console.log(`[${i + 1}/${slugs.length}] fetched ${slug} (${secs}s, ${html.length}b)`)
    } catch (err) {
      failures.push({ slug, stage: "fetch", error: `${err.name}: ${err.message}` })
      console.log(`[${i + 1}/${slugs.length}] FAILED ${slug} — ${err.name}: ${err.message}`)
    }
    await sleep(options.gap)
  }
}

if (options.skipParse) {
  writeFileSync(failureLog, JSON.stringify(failures, null, 2))
  console.log(`\nfetched ${fetched}, already cached ${cachedAlready}, failed ${failures.length}`)
  process.exit(failures.length > 0 ? 1 : 0)
}

const parsed = []
for (const slug of slugs) {
  const cachePath = resolve(cacheDir, `${slug}.html`)
  if (!existsSync(cachePath)) {
    failures.push({ slug, stage: "parse", error: "not in cache" })
    continue
  }
  try {
    parsed.push({ slug, ...parsePost(slug, readFileSync(cachePath, "utf8"), dateMap.get(slug)) })
  } catch (err) {
    failures.push({ slug, stage: "parse", error: err.message })
    console.log(`PARSE FAILED ${slug} — ${err.message}`)
  }
}

let imagesDownloaded = 0
let imageBytes = 0
if (!options.skipImages) {
  for (const entry of parsed) {
    const jobs = [
      [entry.sourceImages.hero, resolve(imageDir, `${entry.slug}.webp`)],
      [entry.sourceImages.extra, resolve(imageDir, `${entry.slug}-2.webp`)],
    ].filter(([remote]) => remote)
    for (const [remote, target] of jobs) {
      try {
        const result = await downloadImage(remote, target)
        if (!result.skipped) {
          imagesDownloaded += 1
          imageBytes += result.bytes
          await sleep(options.gap)
        }
      } catch (err) {
        failures.push({ slug: entry.slug, stage: "image", error: `${remote}: ${err.message}` })
        console.log(`IMAGE FAILED ${entry.slug} (${remote}) — ${err.message}`)
      }
    }
  }
}

/**
 * A handful of legacy posts reference hero images that 404 on the old host.
 * They fall back to a fleet photo so nothing renders broken; the report lists
 * them so the owner can supply replacements.
 */
const FALLBACK_IMAGE = {
  src: "/fleet/charter-bus-exterior.png",
  alt: "Charter bus parked and ready for a group departure",
  width: 1602,
  height: 982,
}

const missingImages = []
for (const entry of parsed) {
  if (!existsSync(resolve(imageDir, `${entry.slug}.webp`))) {
    entry.post.heroImage = { ...FALLBACK_IMAGE }
    entry.post.extraImage = null
    missingImages.push(entry.slug)
  } else if (
    entry.post.extraImage &&
    !existsSync(resolve(imageDir, `${entry.slug}-2.webp`))
  ) {
    entry.post.extraImage = null
  }
}

let trimmed = 0
for (const entry of parsed) {
  for (const image of [entry.post.heroImage, entry.post.extraImage]) {
    if (!image || !image.src.startsWith("/blogs/")) continue
    const file = resolve(imageDir, image.src.replace(/^\/blogs\//, ""))
    if (!existsSync(file)) continue
    const size = await trimLetterbox(file)
    if (size.height !== size.width) trimmed += 1
    image.width = size.width
    image.height = size.height
  }
}

let keptReviewed = 0
for (const entry of parsed) {
  const target = resolve(contentDir, `${entry.slug}.json`)
  if (existsSync(target) && !options.force) {
    const existing = JSON.parse(readFileSync(target, "utf8"))
    if (existing.reviewed) {
      keptReviewed += 1
      continue
    }
  }
  writeFileSync(target, `${JSON.stringify(entry.post, null, 2)}\n`)
}

const indexEntries = readdirSync(contentDir)
  .filter((file) => file.endsWith(".json") && file !== "index.json")
  .map((file) => JSON.parse(readFileSync(resolve(contentDir, file), "utf8")))
  .map((post) => ({
    slug: post.slug,
    title: post.title,
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

writeFileSync(resolve(contentDir, "index.json"), `${JSON.stringify(indexEntries, null, 2)}\n`)
writeFileSync(failureLog, JSON.stringify(failures, null, 2))

const words = parsed.map((entry) => entry.wordCount).sort((a, b) => a - b)
const median = words.length > 0 ? words[Math.floor(words.length / 2)] : 0
const noState = parsed.filter((entry) => !entry.post.state).map((entry) => entry.slug)
const noExtra = parsed.filter((entry) => !entry.sourceImages.extra).map((entry) => entry.slug)
const noRelated = parsed.filter((entry) => entry.post.relatedPostSlugs.length === 0).map((e) => e.slug)
const headingCounts = parsed.map((e) => e.post.body.filter((b) => b.type === "h2").length)

console.log(`
pages fetched      ${fetched} (${cachedAlready} already cached)
posts parsed       ${parsed.length}
images downloaded  ${imagesDownloaded} (${(imageBytes / 1048576).toFixed(1)} MB)
images letterboxed ${trimmed} trimmed
reviewed kept      ${keptReviewed} (hand-edited, not overwritten)
brand replacements ${brandHits}
index entries      ${indexEntries.length}
failures           ${failures.length}

word count         min ${words[0] ?? 0} / median ${median} / max ${words.at(-1) ?? 0}
h2 per post        min ${Math.min(...headingCounts)} / max ${Math.max(...headingCounts)}
missing state      ${noState.length}${noState.length ? ` (${noState.join(", ")})` : ""}
missing 2nd image  ${noExtra.length}${noExtra.length ? ` (${noExtra.join(", ")})` : ""}
no image on host   ${missingImages.length}${missingImages.length ? ` (${missingImages.join(", ")} — using fleet fallback, owner should supply)` : ""}
no related posts   ${noRelated.length}${noRelated.length ? ` (${noRelated.join(", ")})` : ""}`)

if (failures.length > 0) {
  console.log(`\nfailure log: ${failureLog}`)
  process.exit(1)
}
