export type BlogPostPreview = {
  slug: string
  title: string
  excerpt: string
  date: string
}

export const blogPreviews: BlogPostPreview[] = [
  {
    slug: "how-to-rent-a-charter-bus-for-a-wedding",
    title: "How to Rent a Charter Bus for a Wedding",
    excerpt:
      "Guest shuttles, timing, and the questions to ask before you sign — a practical guide to wedding transportation.",
    date: "2026-07-15",
  },
  {
    slug: "charter-bus-vs-mini-bus",
    title: "Charter Bus vs. Mini Bus: Which Fits Your Group?",
    excerpt:
      "Capacity, cost, and comfort compared side by side, so you book the right size the first time.",
    date: "2026-07-08",
  },
  {
    slug: "what-a-charter-bus-quote-should-include",
    title: "What a Charter Bus Quote Should Include",
    excerpt:
      "Driver, fuel, tolls, gratuity — learn what belongs in an honest quote and the red flags to watch for.",
    date: "2026-07-01",
  },
]
