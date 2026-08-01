/**
 * DUMMY DATA — every value marked `dummy` below must be replaced with the real
 * business details before deploying to production. See "Hardcoded data" in
 * CLAUDE.md for the full pre-deploy checklist.
 */
export const siteConfig = {
  name: "Credence Charter Bus",
  legalName: "Credence Charter Bus LLC", // dummy
  tagline: "Charter Bus & Coach Rentals Nationwide",
  url: "https://www.credencecharterbus.com", // dummy
  phone: {
    display: "(800) 555-0142", // dummy
    tel: "+18005550142", // dummy
  },
  email: "info@credencecharterbus.com", // dummy
  address: {
    street: "1200 Transit Way, Suite 400", // dummy
    city: "Dallas", // dummy
    state: "TX", // dummy
    zip: "75201", // dummy
  },
  established: 2013,
  hero: {
    mediaType: "image" as "image" | "video",
    mediaSrc: "",
    fallbackHeadline: "Reliable Group Transportation, Coast to Coast",
    fallbackSubheadline:
      "Charter buses, mini buses, and sprinter vans for groups of every size — with clear pricing and a team you can reach.",
  },
  stats: {
    yearsInBusiness: "12+",
    passengersTransported: "500K+",
    citiesServed: "750+",
    milesTraveled: "15M+",
  },
} as const;

export type SiteConfig = typeof siteConfig;
