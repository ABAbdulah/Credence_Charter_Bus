import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

const defaultOgImage = {
  url: "/fleet/charter-bus-exterior.png",
  width: 1602,
  height: 982,
  alt: "Credence charter bus ready for boarding",
}

export function pageMetadata({
  title,
  description,
  path,
  ogType = "website",
  ogImage,
  publishedTime,
  noindex = false,
}: {
  title: string | { absolute: string }
  description: string
  path: string
  ogType?: "website" | "article"
  ogImage?: { url: string; alt: string; width?: number; height?: number }
  publishedTime?: string
  noindex?: boolean
}): Metadata {
  const ogTitle = typeof title === "string" ? title : title.absolute
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      type: ogType,
      ...(publishedTime ? { publishedTime } : {}),
      images: [
        ogImage
          ? {
              ...ogImage,
              width: ogImage.width ?? defaultOgImage.width,
              height: ogImage.height ?? defaultOgImage.height,
            }
          : defaultOgImage,
      ],
    },
    twitter: { card: "summary_large_image" },
  }
}
