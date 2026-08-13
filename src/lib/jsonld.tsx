import { siteConfig } from "@/config/site"

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

export const organizationId = `${siteConfig.url}/#organization`

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": organizationId,
  name: siteConfig.name,
  description: siteConfig.tagline,
  url: siteConfig.url,
  telephone: siteConfig.phone.tel,
  email: siteConfig.email,
  image: `${siteConfig.url}/fleet/charter-bus-exterior.webp`,
  logo: `${siteConfig.url}/brand/logo-square.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.state,
    postalCode: siteConfig.address.zip,
    addressCountry: "US",
  },
  areaServed: { "@type": "Country", name: "United States" },
  foundingDate: String(siteConfig.established),
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: siteConfig.phone.tel,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: ["English"],
    },
  ],
}

export const websiteId = `${siteConfig.url}/#website`

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  name: siteConfig.name,
  url: siteConfig.url,
  publisher: { "@id": organizationId },
  inLanguage: "en-US",
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const lastPath = items[items.length - 1]?.path ?? "/"
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${siteConfig.url}${lastPath}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  }
}

export function webPageJsonLd({
  type = "WebPage",
  name,
  description,
  path,
  breadcrumbPath,
  primaryImage,
}: {
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage"
  name: string
  description: string
  path: string
  breadcrumbPath?: string
  primaryImage?: string
}) {
  const url = `${siteConfig.url}${path}`
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    ...(breadcrumbPath
      ? { breadcrumb: { "@id": `${siteConfig.url}${breadcrumbPath}#breadcrumb` } }
      : {}),
    ...(primaryImage
      ? { primaryImageOfPage: { "@type": "ImageObject", url: primaryImage } }
      : {}),
  }
}

export const blogId = `${siteConfig.url}/blogs#blog`

export function blogJsonLd({
  name,
  description,
  path,
}: {
  name: string
  description: string
  path: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": blogId,
    name,
    description,
    url: `${siteConfig.url}${path}`,
    inLanguage: "en-US",
    publisher: { "@id": organizationId },
  }
}

export function itemListJsonLd(
  items: { name: string; path: string }[],
  { startAt = 1 }: { startAt?: number } = {}
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: startAt + index,
      name: item.name,
      url: `${siteConfig.url}${item.path}`,
    })),
  }
}

export function serviceJsonLd({
  name,
  description,
  path,
  areaServed,
  image,
}: {
  name: string
  description: string
  path: string
  areaServed?: object
  image?: string
}) {
  const url = `${siteConfig.url}${path}`
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: name,
    description,
    url,
    provider: { "@id": organizationId },
    areaServed: areaServed ?? { "@type": "Country", name: "United States" },
    ...(image ? { image } : {}),
  }
}
