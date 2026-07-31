import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const usage = `Usage: node scripts/ingest-locations.mjs <input.csv|input.json>

CSV columns (header row required, any order):
  city,state,abbr,region,lat,lng,population

JSON input: either the {states,cities} shape written by this script,
or an array of rows with the CSV fields above.

Writes: src/data/locations/locations.json`

const inputPath = process.argv[2]
if (!inputPath) {
  console.error(usage)
  process.exit(1)
}

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/['.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const VALID_REGIONS = new Set(["Northeast", "Midwest", "South", "West"])

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
  return lines.slice(1).map((line) => {
    const cells = []
    let current = ""
    let inQuotes = false
    for (const char of line) {
      if (char === '"') inQuotes = !inQuotes
      else if (char === "," && !inQuotes) {
        cells.push(current)
        current = ""
      } else current += char
    }
    cells.push(current)
    const row = {}
    headers.forEach((header, index) => {
      row[header] = (cells[index] ?? "").trim()
    })
    return row
  })
}

function fromRows(rows) {
  const statesBySlug = new Map()
  const cities = []
  for (const row of rows) {
    const stateName = row.state
    const region = row.region
    if (!VALID_REGIONS.has(region)) {
      throw new Error(
        `Row for "${row.city}": region "${region}" must be one of ${[...VALID_REGIONS].join(", ")}`
      )
    }
    const stateSlug = slugify(stateName)
    if (!statesBySlug.has(stateSlug)) {
      statesBySlug.set(stateSlug, {
        slug: stateSlug,
        name: stateName,
        abbr: row.abbr.toUpperCase(),
        region,
      })
    }
    cities.push({
      slug: slugify(row.city),
      name: row.city,
      stateSlug,
      lat: Number(row.lat),
      lng: Number(row.lng),
      population: Number(row.population) || 0,
    })
  }
  const invalid = cities.filter(
    (city) => !Number.isFinite(city.lat) || !Number.isFinite(city.lng)
  )
  if (invalid.length > 0) {
    throw new Error(
      `Missing/invalid lat-lng for: ${invalid.map((c) => c.name).join(", ")}`
    )
  }
  return {
    states: [...statesBySlug.values()].sort((a, b) => a.name.localeCompare(b.name)),
    cities,
  }
}

const raw = readFileSync(resolve(inputPath), "utf8")
const data = inputPath.endsWith(".json")
  ? (() => {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? fromRows(parsed) : parsed
    })()
  : fromRows(parseCsv(raw))

const outPath = resolve("src/data/locations/locations.json")
writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`)
console.log(
  `Wrote ${data.cities.length} cities across ${data.states.length} states to ${outPath}`
)
