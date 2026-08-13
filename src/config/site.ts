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
    display: "(302) 499-4074",
    tel: "+13024994074",
  },
  email: "info@credencecharterbus.com", // dummy
  address: {
    street: "7901 4th St N, Ste 31686",
    city: "St. Petersburg",
    state: "FL",
    zip: "33702",
  },
  established: 2013,
  hero: {
    mediaType: "image" as "image" | "video",
    mediaSrc: "",
    slideshowImages: [
      "/fleet/charter-bus-exterior.webp",
      "/hero/blue-ridge-parkway.webp",
      "/hero/big-sur-bixby-bridge.webp",
      "/hero/yosemite-tour-coach.webp",
      "/hero/mountain-pass.webp",
      "/hero/pacific-coast-curve.webp",
    ],
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
