export const mainNav = [
  { label: "Fleet", href: "/fleet" },
  { label: "Services", href: "/services" },
  { label: "Locations", href: "/locations" },
  { label: "Blog", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const

export type NavItem = (typeof mainNav)[number]
