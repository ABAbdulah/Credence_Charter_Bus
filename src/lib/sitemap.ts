import { siteConfig } from "@/config/site"
import { allBlogPostsSorted } from "@/data/blogs"
import { fleetCategories } from "@/data/fleet"
import { cities, states } from "@/data/locations"
import { services } from "@/data/services"

export const LOCATION_URLS_PER_SITEMAP = 50000

export function corePaths() {
  return [
    "/",
    "/fleet",
    ...fleetCategories.map((category) => `/fleet/${category.slug}`),
    "/services",
    ...services.map((service) => `/services/${service.slug}`),
    "/about",
    "/contact",
    "/faq",
    "/quote",
    "/blogs",
    ...allBlogPostsSorted().map((post) => `/blogs/${post.slug}`),
    "/locations",
    ...states.map((state) => `/locations/${state.slug}`),
  ]
}

export function locationShardCount() {
  return Math.max(1, Math.ceil(cities.length / LOCATION_URLS_PER_SITEMAP))
}

export function locationPathsForShard(shard: number) {
  const start = shard * LOCATION_URLS_PER_SITEMAP
  return cities
    .slice(start, start + LOCATION_URLS_PER_SITEMAP)
    .map((city) => `/locations/${city.stateSlug}/${city.slug}`)
}

export function urlsetXml(paths: string[]) {
  const urls = paths
    .map((path) => `  <url><loc>${siteConfig.url}${path}</loc></url>`)
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function sitemapIndexXml() {
  const children = [
    "core.xml",
    ...Array.from(
      { length: locationShardCount() },
      (_, shard) => `locations-${shard}.xml`
    ),
  ]
  const entries = children
    .map(
      (name) => `  <sitemap><loc>${siteConfig.url}/sitemaps/${name}</loc></sitemap>`
    )
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`
}
