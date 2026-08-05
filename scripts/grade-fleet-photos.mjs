import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs"
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
 * Fleet cards and category heroes render exteriors in a 3:2 box with
 * object-cover, so anything much wider gets its front and rear cropped off —
 * the 2:1 motor coach lost a third of the vehicle. Sources at or above
 * PAD_MIN_ASPECT are extended to 3:2 by mirroring the photo's own sky and
 * pavement (blurred), so the full vehicle shows without inventing imagery.
 * Blog JSONs that reference these files store per-image dimensions and must
 * be kept in sync when this threshold changes.
 */
const CARD_ASPECT = 3 / 2
const PAD_MIN_ASPECT = 1.7

/**
 * Interiors keep their lighting: the party bus is deliberately purple and the
 * cabins are deliberately dim. Neutralising those would erase the product.
 */
const isGraded = (file) => file.endsWith("-exterior.png")

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

async function padToCardAspect(buffer) {
  const { width, height } = await sharp(buffer).metadata()
  if (width / height < PAD_MIN_ASPECT) return null
  const targetHeight = Math.round(width / CARD_ASPECT)
  const padTop = Math.round((targetHeight - height) * 0.45)
  const padBottom = targetHeight - height - padTop
  const skyStrip = await sharp(buffer)
    .extract({ left: 0, top: 0, width, height: padTop })
    .toBuffer()
  const sky = await sharp(skyStrip).flip().blur(12).toBuffer()
  const pavementStrip = await sharp(buffer)
    .extract({ left: 0, top: height - padBottom, width, height: padBottom })
    .toBuffer()
  const pavement = await sharp(pavementStrip).flip().blur(8).toBuffer()
  return sharp({
    create: { width, height: targetHeight, channels: 3, background: "#ffffff" },
  })
    .composite([
      { input: sky, top: 0, left: 0 },
      { input: buffer, top: padTop, left: 0 },
      { input: pavement, top: padTop + height, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

mkdirSync(outDir, { recursive: true })
const report = []

for (const file of readdirSync(sourceDir).filter((f) => f.endsWith(".png"))) {
  const from = resolve(sourceDir, file)
  const to = resolve(outDir, file)

  if (!isGraded(file)) {
    copyFileSync(from, to)
    report.push({ file, action: "copied" })
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
    .png({ compressionLevel: 9 })
    .toBuffer()
  const padded = await padToCardAspect(graded)
  const output = padded ?? graded
  writeFileSync(to, output)

  const after = (await sharp(output).stats()).channels
    .slice(0, 3)
    .map((c) => c.mean)
  const { width, height } = await sharp(output).metadata()
  report.push({
    file,
    action: "graded",
    points,
    before,
    after,
    padded: Boolean(padded),
    size: `${width}x${height}`,
  })
}

const cast = (m) => Math.max(...m) - Math.min(...m)
const fmt = (m) => m.map((v) => v.toFixed(0)).join("/")
const graded = report.filter((r) => r.action === "graded")

for (const row of report) {
  if (row.action === "copied") {
    console.log(`${row.file.padEnd(30)} copied (interior lighting preserved)`)
  } else {
    console.log(
      `${row.file.padEnd(30)} ${fmt(row.before).padEnd(14)} -> ${fmt(row.after).padEnd(14)} cast ${cast(row.before).toFixed(0)} -> ${cast(row.after).toFixed(0)}${row.padded ? ` padded to 3:2 (${row.size})` : ""}`
    )
  }
}

const worstCast = (rows, key) => Math.max(...rows.map((r) => cast(r[key])))
console.log(`\n${graded.length} graded, ${report.length - graded.length} copied`)
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
