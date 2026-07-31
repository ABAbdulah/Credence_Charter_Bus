export const siteConfig = {
  name: "Credence Charter Bus",
  legalName: "PLACEHOLDER_LEGAL_NAME",
  tagline: "Charter Bus & Coach Rentals Nationwide",
  url: "https://PLACEHOLDER_DOMAIN.com",
  phone: {
    display: "PLACEHOLDER_PHONE_DISPLAY",
    tel: "PLACEHOLDER_PHONE_TEL",
  },
  email: "PLACEHOLDER_EMAIL",
  address: {
    street: "PLACEHOLDER_STREET",
    city: "PLACEHOLDER_CITY",
    state: "PLACEHOLDER_STATE",
    zip: "PLACEHOLDER_ZIP",
  },
  social: {
    facebook: "PLACEHOLDER_FACEBOOK_URL",
    instagram: "PLACEHOLDER_INSTAGRAM_URL",
    linkedin: "PLACEHOLDER_LINKEDIN_URL",
  },
  hero: {
    mediaType: "image" as "image" | "video",
    mediaSrc: "",
    fallbackHeadline: "Reliable Group Transportation, Coast to Coast",
    fallbackSubheadline:
      "Charter buses, mini buses, and sprinter vans for groups of every size — with clear pricing and a team you can reach.",
  },
  stats: {
    milesDriven: "PLACEHOLDER_MILES",
    buses: "PLACEHOLDER_BUS_COUNT",
    cities: "PLACEHOLDER_CITY_COUNT",
    happyCustomers: "PLACEHOLDER_CUSTOMER_COUNT",
  },
} as const;

export type SiteConfig = typeof siteConfig;
