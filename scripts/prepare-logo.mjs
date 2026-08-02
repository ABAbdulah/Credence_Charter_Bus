import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const sourceFile = resolve(root, "public/logo.png")
const markFile = resolve(root, "public/brand/logo-mark.png")
const iconFile = resolve(root, "src/app/icon.png")
const appleIconFile = resolve(root, "src/app/apple-icon.png")

const SITE_CREAM = [247, 245, 240]
const ICON_NAVY = [27, 42, 74]
const ALPHA_LOW = 8
const ALPHA_HIGH = 120
const BODY_MATCH = 6
const TRIM_PAD = 6
const ICON_SIZE = 512
const APPLE_ICON_SIZE = 180
const ICON_INSET = 0.06

function distance(data, i, [r, g, b]) {
  const dr = data[i] - r
  const dg = data[i + 1] - g
  const db = data[i + 2] - b
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

function estimateBackground(data, width, height) {
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ]
  const channel = (offset) => {
    const values = corners
      .map(([x, y]) => data[(y * width + x) * 4 + offset])
      .sort((a, b) => a - b)
    return Math.round((values[1] + values[2]) / 2)
  }
  return [channel(0), channel(1), channel(2)]
}

/**
 * The bus body is filled with the same cream as the canvas, so a global colour
 * key would erase the vehicle. Only background connected to the border is cut.
 */
function cutBackground(data, width, height, background) {
  const visited = new Uint8Array(width * height)
  const stack = []

  const push = (p) => {
    if (!visited[p]) {
      visited[p] = 1
      stack.push(p)
    }
  }
  for (let x = 0; x < width; x += 1) {
    push(x)
    push((height - 1) * width + x)
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width)
    push(y * width + width - 1)
  }

  while (stack.length > 0) {
    const p = stack.pop()
    const i = p * 4
    const d = distance(data, i, background)

    if (d >= ALPHA_HIGH) continue

    if (d <= ALPHA_LOW) {
      data[i + 3] = 0
    } else {
      const alpha = (d - ALPHA_LOW) / (ALPHA_HIGH - ALPHA_LOW)
      for (let c = 0; c < 3; c += 1) {
        const unmixed = (data[i + c] - (1 - alpha) * background[c]) / alpha
        data[i + c] = Math.max(0, Math.min(255, Math.round(unmixed)))
      }
      data[i + 3] = Math.round(alpha * 255)
      continue
    }

    const x = p % width
    const y = (p - x) / width
    if (x > 0) push(p - 1)
    if (x < width - 1) push(p + 1)
    if (y > 0) push(p - width)
    if (y < height - 1) push(p + width)
  }
}

function recolorBody(data, width, height, background) {
  let changed = 0
  for (let p = 0; p < width * height; p += 1) {
    const i = p * 4
    if (data[i + 3] !== 255) continue
    if (distance(data, i, background) > BODY_MATCH) continue
    data[i] = SITE_CREAM[0]
    data[i + 1] = SITE_CREAM[1]
    data[i + 2] = SITE_CREAM[2]
    changed += 1
  }
  return changed
}

function opaqueBounds(data, width, height) {
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] === 0) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  return {
    left: Math.max(0, minX - TRIM_PAD),
    top: Math.max(0, minY - TRIM_PAD),
    width: Math.min(width, maxX + TRIM_PAD + 1) - Math.max(0, minX - TRIM_PAD),
    height: Math.min(height, maxY + TRIM_PAD + 1) - Math.max(0, minY - TRIM_PAD),
  }
}

/** Navy, not the logo's own cream: at 32 px the cream-on-cream line art greys out. */
async function squareIcon(mark, size) {
  const inner = Math.round(size * (1 - ICON_INSET * 2))
  const fitted = await sharp(mark)
    .resize(inner, inner, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer({ resolveWithObject: true })
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: {
        r: ICON_NAVY[0],
        g: ICON_NAVY[1],
        b: ICON_NAVY[2],
        alpha: 1,
      },
    },
  })
    .composite([
      {
        input: fitted.data,
        left: Math.round((size - fitted.info.width) / 2),
        top: Math.round((size - fitted.info.height) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

const { data, info } = await sharp(sourceFile)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const { width, height } = info

if (data[3] === 0) {
  throw new Error(
    `${sourceFile} already has a transparent background. The background estimate reads the corner pixels, so this script would key on meaningless colour. Copy it to public/brand/logo-mark.png yourself and re-run only the icon step.`
  )
}

const background = estimateBackground(data, width, height)
cutBackground(data, width, height, background)
const recolored = recolorBody(data, width, height, background)
const bounds = opaqueBounds(data, width, height)

const mark = await sharp(data, { raw: { width, height, channels: 4 } })
  .extract(bounds)
  .png({ compressionLevel: 9 })
  .toBuffer()

mkdirSync(dirname(markFile), { recursive: true })
writeFileSync(markFile, mark)
writeFileSync(iconFile, await squareIcon(mark, ICON_SIZE))
writeFileSync(appleIconFile, await squareIcon(mark, APPLE_ICON_SIZE))

const transparent = (() => {
  let n = 0
  for (let p = 0; p < width * height; p += 1) if (data[p * 4 + 3] === 0) n += 1
  return n
})()

console.log(`source        ${width}x${height}`)
console.log(`background    rgb(${background.join(", ")})`)
console.log(
  `cut           ${transparent} px transparent (${((transparent / (width * height)) * 100).toFixed(1)}%)`
)
console.log(`body recolor  ${recolored} px -> rgb(${SITE_CREAM.join(", ")})`)
console.log(`mark          ${bounds.width}x${bounds.height}, ${(mark.length / 1024).toFixed(1)} KB`)
