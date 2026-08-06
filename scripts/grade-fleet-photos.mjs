import { mkdirSync, readdirSync, writeFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const sourceDir = resolve(root, "assets/fleet-source")
const outDir = resolve(root, "public/fleet")
const manifestFile = resolve(root, "assets/fleet-grade.json")

const TARGET_BLACK = 6
const TARGET_WHITE = 249
const LOW_PERCENTILE = 0.005
const HIGH_PERCENTILE = 0.995
const LEVELS_STRENGTH = 0.5
const CAST_STRENGTH = 0.3
const SATURATION = 0.9

/**
 * Exteriors are never padded to a card aspect. Sources run 1.5:1 to 2:1, and
 * every attempt to synthesise the missing height — mirrored sky, mirrored
 * pavement, a stretched sliver — rendered as a blurred band the owner flagged
 * on sight. The card box is 2:1 instead (the widest source), so object-cover
 * only ever trims sky and pavement and no vehicle loses its front or rear.
 * Card/gallery aspect classes and the blog JSON image dimensions are tied to
 * these output sizes; changing what this script emits means updating both.
 */

/**
 * Interiors keep their lighting: the party bus is deliberately purple and the
 * cabins are deliberately dim. Neutralising those would erase the product.
 */
const isGraded = (file) => file.endsWith("-exterior.png")
const WEBP_QUALITY = 82

function channelPoints(data) {
  const total = data.length / 3
  return [0, 1, 2].map((offset) => {
    const hist = new Uint32Array(256)
    for (let i = offset; i < data.length; i += 3) hist[data[i]] += 1
    const at = (p) => {
      const want = total * p
      let acc = 0
      for (let v = 0; v < 256; v += 1) {
        acc += hist[v]
        if (acc >= want) return v
      }
      return 255
    }
    return { black: at(LOW_PERCENTILE), white: at(HIGH_PERCENTILE) }
  })
}

/**
 * The cast correction is weighted to midtones (`4t(1-t)`, zero at both ends).
 * A flat grey-world gain turned the white coach cream, because the blue it was
 * "correcting" was sky reflected in genuinely white paint; the sky itself is
 * midtone, so this reaches it without touching the paint or the shadows.
 */
function buildLut(points, means) {
  const grey = (means[0] + means[1] + means[2]) / 3
  return points.map(({ black, white }, channel) => {
    const span = Math.max(1, white - black)
    const gain = 1 + CAST_STRENGTH * (grey / means[channel] - 1)
    const lut = Buffer.alloc(256)
    for (let v = 0; v < 256; v += 1) {
      const mapped =
        TARGET_BLACK + ((v - black) * (TARGET_WHITE - TARGET_BLACK)) / span
      const levelled = v + LEVELS_STRENGTH * (mapped - v)
      const t = Math.min(1, Math.max(0, levelled / 255))
      const weight = 4 * t * (1 - t)
      const out = levelled * (1 + weight * (gain - 1))
      lut[v] = Math.max(0, Math.min(255, Math.round(out)))
    }
    return lut
  })
}

function applyLut(data, luts) {
  for (let i = 0; i < data.length; i += 3) {
    data[i] = luts[0][data[i]]
    data[i + 1] = luts[1][data[i + 1]]
    data[i + 2] = luts[2][data[i + 2]]
  }
}

mkdirSync(outDir, { recursive: true })
const report = []

for (const file of readdirSync(sourceDir).filter((f) => f.endsWith(".png"))) {
  const from = resolve(sourceDir, file)
  const to = resolve(outDir, file.replace(/\.png$/, ".webp"))

  if (!isGraded(file)) {
    await sharp(from).webp({ quality: WEBP_QUALITY }).toFile(to)
    report.push({ file, action: "encoded" })
    continue
  }

  const image = sharp(from).removeAlpha()
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  const points = channelPoints(data)
  const before = (await image.stats()).channels.slice(0, 3).map((c) => c.mean)

  applyLut(data, buildLut(points, before))

  const graded = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 3 },
  })
    .modulate({ saturation: SATURATION })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
  writeFileSync(to, graded)

  const after = (await sharp(graded).stats()).channels
    .slice(0, 3)
    .map((c) => c.mean)
  const { width, height } = await sharp(graded).metadata()
  report.push({
    file,
    action: "graded",
    points,
    before,
    after,
    size: `${width}x${height}`,
  })
}

const cast = (m) => Math.max(...m) - Math.min(...m)
const fmt = (m) => m.map((v) => v.toFixed(0)).join("/")
const graded = report.filter((r) => r.action === "graded")

for (const row of report) {
  if (row.action === "encoded") {
    console.log(`${row.file.padEnd(30)} encoded (interior lighting preserved)`)
  } else {
    console.log(
      `${row.file.padEnd(30)} ${fmt(row.before).padEnd(14)} -> ${fmt(row.after).padEnd(14)} cast ${cast(row.before).toFixed(0)} -> ${cast(row.after).toFixed(0)} ${row.size}`
    )
  }
}

const worstCast = (rows, key) => Math.max(...rows.map((r) => cast(r[key])))
console.log(`\n${graded.length} graded, ${report.length - graded.length} encoded`)
console.log(
  `worst colour cast ${worstCast(graded, "before").toFixed(0)} -> ${worstCast(graded, "after").toFixed(0)}`
)

writeFileSync(
  manifestFile,
  JSON.stringify(
    {
      targetBlack: TARGET_BLACK,
      targetWhite: TARGET_WHITE,
      levelsStrength: LEVELS_STRENGTH,
      castStrength: CAST_STRENGTH,
      saturation: SATURATION,
      files: report,
    },
    null,
    2
  ) + "\n"
)
