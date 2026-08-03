import type { BlogBlock } from "@/data/blogs"

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

export function formatBlogDate(date: string) {
  return dateFormat.format(new Date(`${date}T00:00:00`))
}

// Hero art runs from 1:1 (most migrated posts) to 2:1 (the fleet photos). A single
// fixed frame therefore either crops a third of the picture or letterboxes it, so
// each frame follows its own image and is only clamped enough to keep rows even.
export function framedAspect(
  image: { width: number; height: number },
  min: number,
  max: number
) {
  return Math.min(max, Math.max(min, image.width / image.height))
}

export function stripInlineLinks(text: string) {
  return text.replace(/\[([^\]]+)\]\(\/[^)]*\)/g, "$1")
}

export function wordCount(body: BlogBlock[]) {
  return stripInlineLinks(
    body
      .map((block) => (block.type === "ul" ? block.items.join(" ") : block.text))
      .join(" ")
  ).split(/\s+/).filter(Boolean).length
}

export function readingMinutes(body: BlogBlock[]) {
  return Math.max(1, Math.round(wordCount(body) / 220))
}
