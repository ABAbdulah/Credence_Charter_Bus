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
  image: `${siteConfig.url}/fleet/charter-bus-exterior.png`,
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
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
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
}: {
  name: string
  description: string
  path: string
  areaServed?: object
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url: `${siteConfig.url}${path}`,
    provider: { "@id": organizationId },
    areaServed: areaServed ?? { "@type": "Country", name: "United States" },
  }
}
