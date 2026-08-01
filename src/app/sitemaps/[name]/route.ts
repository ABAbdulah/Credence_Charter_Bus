import {
  corePaths,
  locationPathsForShard,
  locationShardCount,
  urlsetXml,
} from "@/lib/sitemap"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params

  let paths: string[] | null = null
  if (name === "core.xml") {
    paths = corePaths()
  } else {
    const match = name.match(/^locations-(\d+)\.xml$/)
    if (match) {
      const shard = Number(match[1])
      if (shard < locationShardCount()) {
        paths = locationPathsForShard(shard)
      }
    }
  }

  if (!paths) {
    return new Response("Not found", { status: 404 })
  }
  return new Response(urlsetXml(paths), {
    headers: { "Content-Type": "application/xml" },
  })
}
