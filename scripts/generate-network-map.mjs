import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import * as topojson from "topojson-client"
import usTopo from "us-atlas/states-10m.json" with { type: "json" }

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const outFile = resolve(root, "src/data/network/network-map.json")
const svgFile = resolve(root, "public/brand/network-map.svg")
const stillSvgFile = resolve(root, "public/brand/network-map-still.svg")

const TARGET_HUBS = 150
const COMPANY_HUBS = 70
const COMPANY_MIN_SEPARATION_MILES = 55
const SEPARATION_AT_LARGE_METRO = 48
const SEPARATION_AT_SMALL_TOWN = 155
const ANCHOR_HUBS = 108
const COVERAGE_GAP_MILES = 100
const RING_MIN_MILES = 78
const RING_MAX_MILES = 230
const RING_NEIGHBOR_FACTOR = 1
const MIN_ANCHOR_POPULATION = 25000
const MIN_FILL_POPULATION = 2500
const SNAP_MILES = 15

const VIEW_WIDTH = 1000
const MAP_PAD = 10
const INSETS = {
  alaska: { x: 14, y: -166, w: 200, h: 150, ring: 0.3 },
  hawaii: { x: 228, y: -142, w: 152, h: 126, ring: 0.24 },
}

const DEGREES = Math.PI / 180
const EARTH_RADIUS_MILES = 3959

function conicEqualAreaRaw(phi0, phi1) {
  const sy0 = Math.sin(phi0)
  const n = (sy0 + Math.sin(phi1)) / 2
  const c = 1 + sy0 * (2 * n - sy0)
  const r0 = Math.sqrt(c) / n
  return (lambda, phi) => {
    const r = Math.sqrt(c - 2 * n * Math.sin(phi)) / n
    const t = lambda * n
    return [r * Math.sin(t), r0 - r * Math.cos(t)]
  }
}

function makeAlbers({ parallels, rotate, center }) {
  const raw = conicEqualAreaRaw(parallels[0] * DEGREES, parallels[1] * DEGREES)
  const shift = (lon) => {
    let l = (lon + rotate) % 360
    if (l > 180) l -= 360
    if (l < -180) l += 360
    return l * DEGREES
  }
  const origin = raw(shift(center[0]), center[1] * DEGREES)
  let scale = 1000
  let translate = [0, 0]
  const project = ([lon, lat]) => {
    const p = raw(shift(lon), lat * DEGREES)
    return [
      translate[0] + scale * (p[0] - origin[0]),
      translate[1] - scale * (p[1] - origin[1]),
    ]
  }
  project.setFit = (points, box) => {
    scale = 1000
    translate = [0, 0]
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const point of points) {
      const [x, y] = project(point)
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
    const k = box.h ? Math.min(box.w / (maxX - minX), box.h / (maxY - minY)) : box.w / (maxX - minX)
    const width = (maxX - minX) * k
    const height = (maxY - minY) * k
    scale = 1000 * k
    translate = [
      box.x + (box.w - width) / 2 - minX * k,
      box.y + (box.h ? (box.h - height) / 2 : 0) - minY * k,
    ]
    return { width, height }
  }
  project.milesToUnits = (lat, lon, miles) => {
    const a = project([lon, lat])
    const b = project([lon, lat + miles / 69])
    return Math.hypot(b[0] - a[0], b[1] - a[1])
  }
  return project
}

function haversine(aLat, aLng, bLat, bLng) {
  const dLat = (bLat - aLat) * DEGREES
  const dLng = (bLng - aLng) * DEGREES
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * DEGREES) * Math.cos(bLat * DEGREES) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h))
}

function ringPoints(geometry) {
  const out = []
  const walk = (coords, depth) => {
    if (depth === 0) out.push(coords)
    else for (const child of coords) walk(child, depth - 1)
  }
  walk(geometry.coordinates, geometry.type === "Polygon" ? 1 : 2)
  return out
}

function ringArea(ring) {
  let sum = 0
  for (let i = 0, n = ring.length - 1; i < n; i += 1) {
    sum += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
  }
  return Math.abs(sum / 2)
}

function decimate(ring, tolerance) {
  const out = [ring[0]]
  for (let i = 1; i < ring.length - 1; i += 1) {
    const last = out[out.length - 1]
    if (Math.hypot(ring[i][0] - last[0], ring[i][1] - last[1]) >= tolerance) {
      out.push(ring[i])
    }
  }
  return out.length < 3 ? null : out
}

function toPath(geometry, project, { tolerance, minArea }) {
  const parts = []
  for (const ring of ringPoints(geometry)) {
    const projected = ring.map(project)
    if (ringArea(projected) < minArea) continue
    const thinned = decimate(projected, tolerance)
    if (!thinned) continue
    parts.push(
      `M${thinned
        .map(([x, y]) => `${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`)
        .join("L")}Z`
    )
  }
  return parts.join("")
}

function largestRingCentroid(geometry, project) {
  let best = null
  let bestArea = 0
  for (const ring of ringPoints(geometry)) {
    const projected = ring.map(project)
    const area = ringArea(projected)
    if (area > bestArea) {
      bestArea = area
      best = projected
    }
  }
  if (!best) return null
  let x = 0
  let y = 0
  let a = 0
  for (let i = 0, n = best.length - 1; i < n; i += 1) {
    const cross = best[i][0] * best[i + 1][1] - best[i + 1][0] * best[i][1]
    a += cross
    x += (best[i][0] + best[i + 1][0]) * cross
    y += (best[i][1] + best[i + 1][1]) * cross
  }
  a *= 3
  return { x: x / a, y: y / a, area: bestArea }
}

// Mirrors the tokens in src/app/globals.css. The map ships as a standalone SVG
// asset, so it cannot read CSS variables from the page; the site is light-only
// by design, so baking the values in is safe.
const COLOR = {
  card: "#ffffff",
  land: "#efece4",
  border: "#857d6d",
  primary: "#1b2a4a",
  accent: "#c1a15a",
  coverage: "#3d6193",
  coverageAlt: "#4f5b96",
  company: "#a82c31",
  ink: "#22252b",
  slate: "#5a6b82",
}

const HUB_BLINK_SECONDS = 2.6
const RING_PULSE_SECONDS = 8
const RING_TINT_SECONDS = 11

const escapeXml = (value) =>
  value.replace(/[&<>"]/g, (char) => `&${{ "&": "amp", "<": "lt", ">": "gt", '"': "quot" }[char]};`)

// Animations are staggered by longitude so the map reads as one slow wave
// crossing the country rather than 150 elements flickering independently.
const wave = (x, duration) => `animation-delay:${(-(x / VIEW_WIDTH) * duration).toFixed(2)}s`

function ringMarkup(hub, animated) {
  const company = hub.type === "company"
  const color = company ? COLOR.primary : COLOR.coverage
  const motion =
    animated && !company ? ` class="rp" style="${wave(hub.x, RING_PULSE_SECONDS)}"` : ""
  return `<circle${motion} cx="${hub.x}" cy="${hub.y}" r="${hub.r}" fill="url(#ring-${hub.type})" stroke="${color}" stroke-opacity=".18" stroke-width=".7"/>`
}

function hubMarkup(hub, animated) {
  const company = hub.type === "company"
  const motion = animated && company ? ` style="${wave(hub.x, HUB_BLINK_SECONDS)}"` : ""
  const ping =
    animated && company
      ? `<circle class="pg"${motion} cx="${hub.x}" cy="${hub.y}" r="5" fill="none" stroke="${COLOR.company}" stroke-width="1.5"/>`
      : ""
  const dot = `<circle class="${company ? "dc" : "dp"}"${motion} cx="${hub.x}" cy="${
    hub.y
  }" r="${company ? 5 : 3.4}" fill="${
    company ? COLOR.company : COLOR.accent
  }" stroke="${COLOR.card}" stroke-width="1.5"/>`
  const label = hub.label
    ? `<text class="hl${company ? " co" : ""}" x="${hub.label.x}" y="${
        hub.label.y
      }" text-anchor="${hub.label.anchor}">${escapeXml(hub.name)}</text>`
    : ""
  return `${ping}${dot}${label}`
}

// Chrome does not propagate prefers-reduced-motion into an <img>-embedded SVG,
// so the still variant is a separate file the page swaps in via <picture>.
function motionStyles() {
  return `@media (prefers-reduced-motion:no-preference){
.dc{animation:blink ${HUB_BLINK_SECONDS}s ease-in-out infinite}
.pg{animation:ping ${HUB_BLINK_SECONDS}s ease-out infinite}
.rp{animation:pulse ${RING_PULSE_SECONDS}s ease-in-out infinite}
#ring-partner stop{animation:tint ${RING_TINT_SECONDS}s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.38}}
@keyframes ping{0%{r:5px;opacity:.55}75%{opacity:0}100%{r:15px;opacity:0}}
@keyframes pulse{0%,100%{opacity:.58}50%{opacity:1}}
@keyframes tint{0%,100%{stop-color:${COLOR.coverage}}50%{stop-color:${COLOR.coverageAlt}}}
}
`
}

function renderSvg({ statePaths, insets, hubs, outlinePath, description, animated }) {
  const gradient = (id, color, peak, mid, edge) =>
    `<radialGradient id="${id}"><stop offset="0%" stop-color="${color}" stop-opacity="${peak}"/>` +
    `<stop offset="72%" stop-color="${color}" stop-opacity="${mid}"/>` +
    `<stop offset="100%" stop-color="${color}" stop-opacity="${edge}"/></radialGradient>`

  const insetMarkup = insets
    .map((inset) => {
      const insetHubs = hubs.filter((hub) => hub.inset === inset.key)
      return (
        `<rect x="${inset.box.x}" y="${inset.box.y}" width="${inset.box.w}" height="${inset.box.h}" rx="6" fill="${COLOR.card}" stroke="${COLOR.border}" stroke-opacity=".35"/>` +
        `<path d="${inset.path}" fill="${COLOR.land}"/>` +
        `<g clip-path="url(#clip-${inset.key})">${insetHubs
          .map((hub) => ringMarkup(hub, animated))
          .join("")}</g>` +
        `<path d="${inset.path}" fill="none" stroke="${COLOR.border}" stroke-opacity=".6" stroke-width=".8" stroke-linejoin="round"/>` +
        `<text class="ab" x="${inset.box.x + inset.box.w - 8}" y="${
          inset.box.y + 15
        }" text-anchor="end" font-weight="700">${inset.label}</text>`
      )
    })
    .join("")

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}" role="img" aria-labelledby="network-map-title">
<title id="network-map-title">${escapeXml(description)}</title>
<style>
text{font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",sans-serif}
.hl{font-size:8.9px;font-weight:600;fill:${COLOR.ink};fill-opacity:.85;paint-order:stroke;stroke:${COLOR.card};stroke-width:2.8px;stroke-linejoin:round}
.hl.co{font-size:9.6px;font-weight:700;fill:${COLOR.primary};fill-opacity:1}
.ab{font-size:8.6px;font-weight:600;fill:${COLOR.slate};fill-opacity:.45;letter-spacing:.6px;text-anchor:middle}
.pg{opacity:0}
@media (max-width:820px){.hl,.ab{display:none}.dc{r:6.6px}.dp{r:4.8px}}
${animated ? motionStyles() : ""}</style>
<defs>
${gradient("ring-company", COLOR.primary, 0.16, 0.13, 0.05)}
${gradient("ring-partner", COLOR.coverage, 0.17, 0.14, 0.055)}
<path id="outline" d="${outlinePath}"/>
<clipPath id="clip-mainland"><use href="#outline"/></clipPath>
${insets
  .map(
    (inset) =>
      `<clipPath id="clip-${inset.key}"><rect x="${inset.box.x}" y="${inset.box.y}" width="${inset.box.w}" height="${inset.box.h}" rx="6"/></clipPath>`
  )
  .join("")}
</defs>
<g fill="${COLOR.land}"><g id="land">${statePaths
    .map((state) => `<path d="${state.d}"/>`)
    .join("")}</g></g>
<g clip-path="url(#clip-mainland)">${hubs
    .filter((hub) => !hub.inset)
    .sort((a, b) => b.r - a.r)
    .map((hub) => ringMarkup(hub, animated))
    .join("")}</g>
<use href="#land" fill="none" stroke="${COLOR.border}" stroke-opacity=".55" stroke-width=".8" stroke-linejoin="round"/>
<use href="#outline" fill="none" stroke="${COLOR.border}" stroke-width="1.4" stroke-linejoin="round"/>
<g>${statePaths
    .filter((state) => state.label)
    .map((state) => `<text class="ab" x="${state.label.x}" y="${state.label.y}">${state.abbr}</text>`)
    .join("")}</g>
${insetMarkup}
<g>${hubs.map((hub) => hubMarkup(hub, animated)).join("")}</g>
</svg>
`
}

const locations = JSON.parse(
  readFileSync(resolve(root, "src/data/locations/locations.json"), "utf8")
)
const stateBySlug = new Map(locations.states.map((state) => [state.slug, state]))
const stateByName = new Map(locations.states.map((state) => [state.name, state]))

const NON_CIVILIAN = /air force base|naval|army|marine corps|arsenal|proving ground/i

// GeoNames reports 288,649 for this ~7k-person CDP, which would otherwise beat
// Huntington, WV for the Tri-State hub. Remove once locations.json is corrected.
const BAD_POPULATION = new Set(["kentucky/meads"])

const hubCandidates = locations.cities.filter(
  (city) =>
    !NON_CIVILIAN.test(city.name) &&
    !BAD_POPULATION.has(`${city.stateSlug}/${city.slug}`)
)

const mainland = hubCandidates.filter(
  (city) => city.stateSlug !== "alaska" && city.stateSlug !== "hawaii"
)
const alaskaCities = hubCandidates.filter((city) => city.stateSlug === "alaska")
const hawaiiCities = hubCandidates.filter((city) => city.stateSlug === "hawaii")

const METRO_RADIUS_MILES = 25
const CELL_DEGREES = 0.5

function addMetroWeights(pool) {
  const grid = new Map()
  for (const city of pool) {
    const key = `${Math.floor(city.lat / CELL_DEGREES)}:${Math.floor(city.lng / CELL_DEGREES)}`
    const bucket = grid.get(key)
    if (bucket) bucket.push(city)
    else grid.set(key, [city])
  }
  for (const city of pool) {
    const latCell = Math.floor(city.lat / CELL_DEGREES)
    const lngCell = Math.floor(city.lng / CELL_DEGREES)
    let sum = 0
    for (let dLat = -1; dLat <= 1; dLat += 1) {
      for (let dLng = -2; dLng <= 2; dLng += 1) {
        const bucket = grid.get(`${latCell + dLat}:${lngCell + dLng}`)
        if (!bucket) continue
        for (const other of bucket) {
          if (haversine(city.lat, city.lng, other.lat, other.lng) <= METRO_RADIUS_MILES) {
            sum += other.population
          }
        }
      }
    }
    city.metro = sum
  }
}

function requiredSeparation(metro) {
  const scale = Math.min(1, Math.max(0, (Math.log10(Math.max(metro, 1)) - 3.6) / 3))
  return SEPARATION_AT_SMALL_TOWN - (SEPARATION_AT_SMALL_TOWN - SEPARATION_AT_LARGE_METRO) * scale
}

function snapToLocalAnchor(city, pool, taken) {
  let best = city
  for (const other of pool) {
    if (
      other.population > best.population &&
      !taken.includes(other) &&
      haversine(city.lat, city.lng, other.lat, other.lng) <= SNAP_MILES
    ) {
      best = other
    }
  }
  return best
}

function selectHubs(pool, budget, { gapMiles, anchors, minAnchorPopulation = 0 }) {
  addMetroWeights(pool)
  const ranked = pool
    .filter((city) => city.population >= minAnchorPopulation)
    .sort((a, b) => b.population - a.population)
  const chosen = []
  for (const city of ranked) {
    if (chosen.length >= Math.min(anchors ?? budget, budget)) break
    const sep = requiredSeparation(city.metro)
    const clear = chosen.every((hub) => {
      const limit = Math.min(sep, requiredSeparation(hub.metro))
      return haversine(city.lat, city.lng, hub.lat, hub.lng) >= limit
    })
    if (clear) chosen.push(snapToLocalAnchor(city, pool, chosen))
  }

  // Every state needs a visible dot, however well its neighbours' rings cover it.
  const represented = new Set(chosen.map((city) => city.stateSlug))
  for (const city of ranked) {
    if (chosen.length >= budget) break
    if (represented.has(city.stateSlug)) continue
    represented.add(city.stateSlug)
    chosen.push(city)
  }

  const nearest = pool.map((city) =>
    chosen.reduce(
      (min, hub) => Math.min(min, haversine(city.lat, city.lng, hub.lat, hub.lng)),
      Infinity
    )
  )
  while (chosen.length < budget) {
    let pick = -1
    let pickScore = 0
    for (let i = 0; i < pool.length; i += 1) {
      if (nearest[i] <= gapMiles || pool[i].population < MIN_FILL_POPULATION) continue
      const score = nearest[i] * Math.log10(pool[i].population)
      if (score > pickScore) {
        pickScore = score
        pick = i
      }
    }
    if (pick < 0) break
    const city = snapToLocalAnchor(pool[pick], pool, chosen)
    chosen.push(city)
    for (let i = 0; i < pool.length; i += 1) {
      const d = haversine(city.lat, city.lng, pool[i].lat, pool[i].lng)
      if (d < nearest[i]) nearest[i] = d
    }
  }
  return chosen
}

const hubCities = [
  ...selectHubs(mainland, TARGET_HUBS - 4, {
    gapMiles: COVERAGE_GAP_MILES,
    anchors: ANCHOR_HUBS,
    minAnchorPopulation: MIN_ANCHOR_POPULATION,
  }),
  ...selectHubs(alaskaCities, 2, { gapMiles: 250 }),
  ...selectHubs(hawaiiCities, 2, { gapMiles: 120 }),
]

const assignedCities = hubCities.map(() => 0)
const assignedPopulation = hubCities.map(() => 0)
let covered = 0
for (const city of locations.cities) {
  let best = -1
  let bestDistance = Infinity
  for (let i = 0; i < hubCities.length; i += 1) {
    const d = haversine(city.lat, city.lng, hubCities[i].lat, hubCities[i].lng)
    if (d < bestDistance) {
      bestDistance = d
      best = i
    }
  }
  assignedCities[best] += 1
  assignedPopulation[best] += city.population
  if (bestDistance <= COVERAGE_GAP_MILES) covered += 1
}

const companyRanked = hubCities
  .map((city, index) => ({ city, index, weight: assignedPopulation[index] }))
  .sort((a, b) => b.weight - a.weight)
const companyIndexes = new Set()
for (const entry of companyRanked) {
  if (companyIndexes.size >= COMPANY_HUBS) break
  const clear = [...companyIndexes].every((index) => {
    const other = hubCities[index]
    return (
      haversine(entry.city.lat, entry.city.lng, other.lat, other.lng) >=
      COMPANY_MIN_SEPARATION_MILES
    )
  })
  if (clear) companyIndexes.add(entry.index)
}

const geo = topojson.feature(usTopo, usTopo.objects.states)
const features = geo.features.filter((feature) => stateByName.has(feature.properties.name))
function pointsOf(featureList) {
  const points = []
  for (const feature of featureList) {
    for (const ring of ringPoints(feature.geometry)) {
      for (const point of ring) points.push(point)
    }
  }
  return points
}

const mainlandFeatures = features.filter(
  (feature) =>
    !["Alaska", "Hawaii"].includes(feature.properties.name)
)

const mainProjection = makeAlbers({
  parallels: [29.5, 45.5],
  rotate: 96,
  center: [-0.6, 38.7],
})
const mainSize = mainProjection.setFit(pointsOf(mainlandFeatures), {
  x: MAP_PAD,
  y: MAP_PAD,
  w: VIEW_WIDTH - MAP_PAD * 2,
  h: 0,
})
const VIEW_HEIGHT = Math.round(mainSize.height + MAP_PAD * 2 + 26)

const insetSpecs = [
  {
    key: "alaska",
    slug: "alaska",
    label: "AK",
    features: features.filter((feature) => feature.properties.name === "Alaska"),
    projection: makeAlbers({ parallels: [55, 65], rotate: 154, center: [-2, 58.5] }),
    cities: alaskaCities,
  },
  {
    key: "hawaii",
    slug: "hawaii",
    label: "HI",
    features: features.filter((feature) => feature.properties.name === "Hawaii"),
    projection: makeAlbers({ parallels: [8, 18], rotate: 157, center: [-3, 19.9] }),
    cities: hawaiiCities,
  },
]

const insets = insetSpecs.map((spec) => {
  const frame = INSETS[spec.key]
  const box = {
    x: frame.x,
    y: frame.y < 0 ? VIEW_HEIGHT + frame.y : frame.y,
    w: frame.w,
    h: frame.h,
  }
  spec.projection.setFit(pointsOf(spec.features), {
    x: box.x + 12,
    y: box.y + 14,
    w: box.w - 24,
    h: box.h - 26,
  })
  spec.box = box
  return {
    key: spec.key,
    label: spec.label,
    box,
    path: spec.features
      .map((feature) => toPath(feature.geometry, spec.projection, { tolerance: 0.7, minArea: 0.6 }))
      .join(""),
  }
})

function projectionFor(stateSlug) {
  const spec = insetSpecs.find((entry) => entry.slug === stateSlug)
  return spec ? spec.projection : mainProjection
}

const statePaths = []
for (const feature of mainlandFeatures) {
  const state = stateByName.get(feature.properties.name)
  const centroid = largestRingCentroid(feature.geometry, mainProjection)
  statePaths.push({
    slug: state.slug,
    abbr: state.abbr,
    d: toPath(feature.geometry, mainProjection, { tolerance: 0.85, minArea: 1.2 }),
    label: centroid && centroid.area > 260
      ? { x: Math.round(centroid.x * 10) / 10, y: Math.round(centroid.y * 10) / 10 }
      : null,
  })
}

const hubs = hubCities.map((city, index) => {
  const projection = projectionFor(city.stateSlug)
  const [x, y] = projection([city.lng, city.lat])
  return {
    id: `${city.stateSlug}/${city.slug}`,
    name: city.name,
    citySlug: city.slug,
    stateSlug: city.stateSlug,
    stateName: stateBySlug.get(city.stateSlug).name,
    stateAbbr: stateBySlug.get(city.stateSlug).abbr,
    region: stateBySlug.get(city.stateSlug).region,
    type: companyIndexes.has(index) ? "company" : "partner",
    cities: assignedCities[index],
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    lat: city.lat,
    lng: city.lng,
    population: city.population,
    weight: assignedPopulation[index],
    inset: insetSpecs.some((spec) => spec.slug === city.stateSlug) ? city.stateSlug : null,
  }
})

for (const hub of hubs) {
  const neighbours = hubs
    .filter((other) => other !== hub && other.inset === hub.inset)
    .map((other) => haversine(hub.lat, hub.lng, other.lat, other.lng))
    .sort((a, b) => a - b)
  const spread = neighbours.length >= 3 ? (neighbours[1] + neighbours[2]) / 2 : RING_MAX_MILES
  const miles = Math.min(RING_MAX_MILES, Math.max(RING_MIN_MILES, spread * RING_NEIGHBOR_FACTOR))
  hub.radiusMiles = Math.round(miles)
  if (hub.inset) {
    const spec = insetSpecs.find((entry) => entry.slug === hub.inset)
    hub.r = Math.round(spec.box.w * INSETS[spec.key].ring * 10) / 10
  } else {
    hub.r = Math.round(mainProjection.milesToUnits(hub.lat, hub.lng, miles) * 10) / 10
  }
}

const LABEL_FONT = 9.4
const CHAR_WIDTH = 5.05
const LABEL_GAP = 7
const labelled = []

function overlaps(a, b) {
  return !(a.x1 < b.x0 || a.x0 > b.x1 || a.y1 < b.y0 || a.y0 > b.y1)
}

const dotBoxes = hubs.map((hub) => ({
  x0: hub.x - 6,
  x1: hub.x + 6,
  y0: hub.y - 6,
  y1: hub.y + 6,
}))

const insetBoxes = insets.map((inset) => ({
  x0: inset.box.x - 3,
  x1: inset.box.x + inset.box.w + 3,
  y0: inset.box.y - 3,
  y1: inset.box.y + inset.box.h + 3,
}))

const labelOrder = [...hubs].sort((a, b) => {
  if (a.type !== b.type) return a.type === "company" ? -1 : 1
  return b.weight - a.weight
})

const PLACEMENTS = [
  { dx: LABEL_GAP, dy: 3.3, anchor: "start" },
  { dx: -LABEL_GAP, dy: 3.3, anchor: "end" },
  { dx: 0, dy: -7.5, anchor: "middle" },
  { dx: 0, dy: 13, anchor: "middle" },
  { dx: LABEL_GAP - 2, dy: -6.5, anchor: "start" },
  { dx: 2 - LABEL_GAP, dy: -6.5, anchor: "end" },
  { dx: LABEL_GAP - 2, dy: 12.5, anchor: "start" },
  { dx: 2 - LABEL_GAP, dy: 12.5, anchor: "end" },
]

for (const hub of labelOrder) {
  const width = hub.name.length * CHAR_WIDTH
  hub.label = null
  const ordered =
    hub.x + LABEL_GAP + width > VIEW_WIDTH - 6
      ? [...PLACEMENTS].sort((a, b) => a.dx - b.dx)
      : PLACEMENTS
  for (const placement of ordered) {
    const x = hub.x + placement.dx
    const y = hub.y + placement.dy
    const x0 =
      placement.anchor === "start"
        ? x
        : placement.anchor === "end"
          ? x - width
          : x - width / 2
    const box = {
      x0: x0 - 1.5,
      x1: x0 + width + 1.5,
      y0: y - LABEL_FONT * 0.85,
      y1: y + LABEL_FONT * 0.3,
    }
    if (box.x0 < 4 || box.x1 > VIEW_WIDTH - 4 || box.y0 < 4 || box.y1 > VIEW_HEIGHT - 4) {
      continue
    }
    if (labelled.some((entry) => overlaps(entry.box, box))) continue
    if (dotBoxes.some((dot, index) => hubs[index] !== hub && overlaps(dot, box))) continue
    if (!hub.inset && insetBoxes.some((panel) => overlaps(panel, box))) continue
    labelled.push({ box, hub })
    hub.label = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, anchor: placement.anchor }
    break
  }
}

for (const state of statePaths) {
  if (!state.label) continue
  const box = {
    x0: state.label.x - 10,
    x1: state.label.x + 10,
    y0: state.label.y - 6,
    y1: state.label.y + 6,
  }
  if (labelled.some((entry) => overlaps(entry.box, box))) state.label = null
}

const mainlandNames = new Set(mainlandFeatures.map((feature) => feature.properties.name))
const outlinePath = toPath(
  topojson.merge(
    usTopo,
    usTopo.objects.states.geometries.filter((geometry) =>
      mainlandNames.has(geometry.properties.name)
    )
  ),
  mainProjection,
  { tolerance: 1.1, minArea: 1.6 }
)

const summary = {
  coverageRadiusMiles: COVERAGE_GAP_MILES,
  hubs: hubs.length,
  company: hubs.filter((hub) => hub.type === "company").length,
  partner: hubs.filter((hub) => hub.type === "partner").length,
  states: locations.states.length,
  cities: locations.cities.length,
  coveredCities: covered,
  view: { width: VIEW_WIDTH, height: VIEW_HEIGHT },
}

const description =
  `Map of the United States showing ${summary.hubs} Credence Charter Bus operations hubs — ` +
  `${summary.company} company-owned and ${summary.partner} partner — with overlapping ` +
  `service areas covering all ${summary.states - 1} states and the District of Columbia.`

const output = {
  generatedAt: new Date().toISOString().slice(0, 10),
  description,
  hubs: hubs
    .sort((a, b) => b.weight - a.weight)
    .map((hub) => ({
      id: hub.id,
      name: hub.name,
      citySlug: hub.citySlug,
      stateSlug: hub.stateSlug,
      stateName: hub.stateName,
      stateAbbr: hub.stateAbbr,
      region: hub.region,
      type: hub.type,
      cities: hub.cities,
    })),
  summary,
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, `${JSON.stringify(output)}\n`)
mkdirSync(dirname(svgFile), { recursive: true })
for (const [file, animated] of [
  [svgFile, true],
  [stillSvgFile, false],
]) {
  writeFileSync(
    file,
    renderSvg({ statePaths, insets, hubs, outlinePath, description, animated })
  )
}

const jsonBytes = readFileSync(outFile).length
const svgBytes = readFileSync(svgFile).length
console.log(
  [
    `hubs        ${summary.hubs} (${summary.company} company / ${summary.partner} partner)`,
    `labelled    ${labelled.length}`,
    `cities      ${summary.cities} assigned, ${summary.coveredCities} within ${COVERAGE_GAP_MILES} mi (${((covered / summary.cities) * 100).toFixed(1)}%)`,
    `viewBox     ${VIEW_WIDTH} x ${VIEW_HEIGHT}`,
    `json        ${(jsonBytes / 1024).toFixed(1)} KB`,
    `svg         ${(svgBytes / 1024).toFixed(1)} KB animated, ${(
      readFileSync(stillSvgFile).length / 1024
    ).toFixed(1)} KB still`,
  ].join("\n")
)
