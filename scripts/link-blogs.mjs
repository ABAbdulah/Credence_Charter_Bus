import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const usage = `Usage: node scripts/link-blogs.mjs [--check]

Derives planningLinks for every migrated post: the fleet categories and service
that match the trip described, plus the nearest real city pages.

Location links are only ever chosen from cities the post actually names and that
exist in locations.json, so no post can link to a city page that does not exist.

  --check   report what would change without writing`

const options = { check: process.argv.includes("--check") }
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(usage)
  process.exit(0)
}

const root = resolve(import.meta.dirname, "..")
const contentDir = resolve(root, "src/content/blogs")

function slugsFrom(file) {
  const source = readFileSync(resolve(root, file), "utf8")
  return new Set([...source.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]))
}

const fleetSlugs = slugsFrom("src/data/fleet.ts")
const serviceSlugs = slugsFrom("src/data/services.ts")
const locations = JSON.parse(
  readFileSync(resolve(root, "src/data/locations/locations.json"), "utf8"),
)

const citiesByState = new Map()
for (const city of locations.cities) {
  if (!citiesByState.has(city.stateSlug)) citiesByState.set(city.stateSlug, [])
  citiesByState.get(city.stateSlug).push(city)
}

const FLEET_LABELS = {
  "charter-buses": "Charter buses and motorcoaches",
  "mini-buses": "Mini buses for smaller groups",
  "sprinter-vans": "Sprinter vans for executive groups",
  "school-buses": "School buses for student trips",
  "party-buses": "Party buses for celebrations",
  limousines: "Stretch limousines",
  suvs: "Luxury SUVs",
  sedans: "Executive sedans",
}

const SERVICE_LABELS = {
  "corporate-travel": "Corporate travel",
  "event-transportation": "Event transportation",
  "airport-transfers": "Airport transfers",
  "sports-team-travel": "Sports team travel",
  "wedding-transportation": "Wedding and group celebrations",
  "school-trips": "School trip transportation",
}

/**
 * Every migrated post carries the same stock sentence offering the trip to "a
 * family reunion, a corporate retreat, a school expedition…", so single-word
 * signals fire on nearly all 177. A profile only counts at MIN_PROFILE_HITS.
 */
const MIN_PROFILE_HITS = 2

const PROFILES = [
  {
    pattern: /\b(school group|school trip|students?|classroom|field trip|teachers?)\b/gi,
    service: "school-trips",
    fleet: ["school-buses"],
  },
  {
    pattern: /\b(corporate (retreat|group|outing)|conference|team.building|company outing)\b/gi,
    service: "corporate-travel",
    fleet: ["sprinter-vans"],
  },
  {
    pattern: /\b(wedding|bachelor|bachelorette|reception)\b/gi,
    service: "wedding-transportation",
    fleet: ["limousines"],
  },
  {
    pattern: /\b(tailgate|stadium|game day|tournament|ballpark)\b/gi,
    service: "sports-team-travel",
    fleet: ["mini-buses"],
  },
  {
    pattern: /\b(nightlife|casino|brewery|winery|distillery|bar hop)\b/gi,
    service: "event-transportation",
    fleet: ["party-buses"],
  },
  {
    pattern: /\b(airport|terminal|baggage claim)\b/gi,
    service: "airport-transfers",
    fleet: ["sprinter-vans"],
  },
]

function bodyText(post) {
  return post.body
    .map((block) => (block.type === "ul" ? block.items.join(" ") : block.text))
    .join("\n")
}

function pickCities(post, text) {
  const pool = citiesByState.get(post.stateSlug) ?? []
  if (pool.length === 0) return []

  const scored = []
  for (const city of pool) {
    if (city.name.length < 4) continue
    const escaped = city.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const inTitle = new RegExp(`\\b${escaped}\\b`).test(post.title)
    const contextual = (
      text.match(
        new RegExp(
          `(?:\\b(?:in|near|from|to|through|around|outside|toward|via|visit(?:ing)?)\\s+(?:the\\s+)?${escaped}\\b|\\b${escaped},\\s*(?:${post.state}|${post.stateAbbr})\\b)`,
          "g",
        ),
      ) ?? []
    ).length
    const bare = (text.match(new RegExp(`\\b${escaped}\\b`, "g")) ?? []).length
    const score = (inTitle ? 100 : 0) + contextual * 10 + (bare >= 2 ? bare : 0)
    if (score < 2) continue
    scored.push({ city, score, population: city.population })
  }

  scored.sort((a, b) => b.score - a.score || b.population - a.population)
  const chosen = scored.slice(0, 2).map((entry) => entry.city)

  if (chosen.length === 0) {
    const largest = [...pool].sort((a, b) => b.population - a.population)[0]
    if (largest) chosen.push(largest)
  }
  return chosen
}

function pickFleetAndService(text) {
  const scored = PROFILES.map((profile) => ({
    profile,
    hits: (text.match(profile.pattern) ?? []).length,
  }))
    .filter((entry) => entry.hits >= MIN_PROFILE_HITS)
    .sort((a, b) => b.hits - a.hits)

  const services = scored.slice(0, 2).map((entry) => entry.profile.service)
  if (services.length === 0) services.push("event-transportation")

  const fleet = ["charter-buses"]
  for (const entry of scored) {
    for (const slug of entry.profile.fleet) {
      if (!fleet.includes(slug) && fleet.length < 3) fleet.push(slug)
    }
  }
  if (fleet.length < 2) fleet.push("mini-buses")

  return { fleet, services: [...new Set(services)] }
}

const files = readdirSync(contentDir).filter((f) => f.endsWith(".json") && f !== "index.json")
const problems = []
let updated = 0
let locationLinkCount = 0

for (const file of files) {
  const path = resolve(contentDir, file)
  const post = JSON.parse(readFileSync(path, "utf8"))
  if (post.source !== "migrated" || post.reviewed) continue

  const text = `${post.title}\n${bodyText(post)}`
  const { fleet, services } = pickFleetAndService(text)
  const cities = pickCities(post, text)
  locationLinkCount += cities.length

  const links = [
    ...fleet.map((slug) => ({ label: FLEET_LABELS[slug], href: `/fleet/${slug}` })),
    ...services.map((slug) => ({ label: SERVICE_LABELS[slug], href: `/services/${slug}` })),
    ...cities.map((city) => ({
      label: `Charter bus rental in ${city.name}, ${post.stateAbbr}`,
      href: `/locations/${post.stateSlug}/${city.slug}`,
    })),
    { label: "Get an all-in quote for this trip", href: "/quote" },
  ]

  for (const slug of fleet) if (!fleetSlugs.has(slug)) problems.push(`${post.slug}: fleet ${slug}`)
  for (const slug of services)
    if (!serviceSlugs.has(slug)) problems.push(`${post.slug}: service ${slug}`)
  if (cities.length === 0) problems.push(`${post.slug}: no location link`)

  if (JSON.stringify(post.planningLinks) !== JSON.stringify(links)) {
    post.planningLinks = links
    updated += 1
    if (!options.check) writeFileSync(path, `${JSON.stringify(post, null, 2)}\n`)
  }
}

console.log(`
posts updated       ${updated}${options.check ? " (check only, nothing written)" : ""}
location links      ${locationLinkCount}
problems            ${problems.length}`)

for (const problem of problems.slice(0, 20)) console.log(`  ${problem}`)
if (problems.length > 20) console.log(`  … ${problems.length - 20} more`)
