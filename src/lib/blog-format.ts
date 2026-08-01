import type { BlogBlock } from "@/data/blogs"

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

export function formatBlogDate(date: string) {
  return dateFormat.format(new Date(`${date}T00:00:00`))
}

export function readingMinutes(body: BlogBlock[]) {
  const words = body
    .map((block) =>
      block.type === "ul" ? block.items.join(" ") : block.text
    )
    .join(" ")
    .split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}
