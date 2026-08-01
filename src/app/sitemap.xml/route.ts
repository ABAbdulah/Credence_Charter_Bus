import { sitemapIndexXml } from "@/lib/sitemap"

export function GET() {
  return new Response(sitemapIndexXml(), {
    headers: { "Content-Type": "application/xml" },
  })
}
