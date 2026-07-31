export type FleetImage = {
  src: string
  alt: string
}

export type FleetCategory = {
  slug: string
  name: string
  vehicleName: string
  capacity: string
  short: string
  description: string
  amenities: string[]
  idealFor: string[]
  images: {
    exterior: FleetImage
    interior: FleetImage
    extra?: FleetImage[]
  }
  featured: boolean
}

export const fleetCategories: FleetCategory[] = [
  {
    slug: "charter-buses",
    name: "Charter Buses",
    vehicleName: "charter bus",
    capacity: "36–56 passengers",
    short:
      "Full-size motorcoaches for large groups traveling together in comfort — the workhorse of long-distance group travel.",
    description:
      "Our full-size charter buses and motorcoaches carry 36 to 56 passengers with room to spare for luggage underneath. Reclining seats, climate control, and a restroom on board make them the right choice for long-distance trips, multi-day tours, and any occasion where a large group needs to arrive together and on time.",
    amenities: [
      "Reclining seats with seat belts",
      "On-board restroom",
      "Climate control",
      "PA system for your trip leader",
      "Under-bus luggage bays",
      "Power outlets and Wi-Fi on request",
    ],
    idealFor: [
      "Long-distance group trips",
      "Corporate outings and conferences",
      "Multi-day tours",
      "Large wedding parties",
    ],
    images: {
      exterior: {
        src: "/fleet/charter-bus-exterior.png",
        alt: "Full-size charter bus parked and ready for boarding",
      },
      interior: {
        src: "/fleet/charter-bus-interior.png",
        alt: "Charter bus interior with rows of reclining seats",
      },
      extra: [
        {
          src: "/fleet/motor-coach-exterior.png",
          alt: "Motorcoach exterior on the road",
        },
        {
          src: "/fleet/motor-coach-interior.png",
          alt: "Motorcoach interior with high-back seating",
        },
      ],
    },
    featured: true,
  },
  {
    slug: "mini-buses",
    name: "Mini Buses",
    vehicleName: "mini bus",
    capacity: "20–35 passengers",
    short:
      "Mid-size comfort for groups that don't need a full coach — easier to load, easier to park, same reliable ride.",
    description:
      "Mini buses seat 20 to 35 passengers, hitting the sweet spot between a van and a full-size coach. They board quickly, navigate city streets and hotel entrances with ease, and still give every passenger a comfortable forward-facing seat — ideal for shuttles, day trips, and mid-size groups.",
    amenities: [
      "Forward-facing cushioned seats",
      "Climate control",
      "Overhead storage",
      "PA system",
      "Luggage space",
    ],
    idealFor: [
      "Hotel and event shuttles",
      "Day trips and outings",
      "Mid-size corporate groups",
      "Campus visits",
    ],
    images: {
      exterior: {
        src: "/fleet/mini-bus-exterior.png",
        alt: "Mini bus parked outside a venue",
      },
      interior: {
        src: "/fleet/mini-bus-interior.png",
        alt: "Mini bus interior with comfortable forward-facing seats",
      },
    },
    featured: true,
  },
  {
    slug: "sprinter-vans",
    name: "Sprinter Vans",
    vehicleName: "sprinter van",
    capacity: "8–15 passengers",
    short:
      "Premium vans for small groups — executive comfort, airport-friendly, and quick around town.",
    description:
      "Sprinter vans carry 8 to 15 passengers in a tall, walk-in cabin with premium seating. They're the go-to for executive teams, airport transfers, and small groups that want to travel together without the footprint of a bus.",
    amenities: [
      "High-roof walk-in cabin",
      "Leather or executive seating",
      "Climate control",
      "Luggage space",
      "Power outlets",
    ],
    idealFor: [
      "Airport transfers",
      "Executive travel",
      "Small wedding parties",
      "Family outings",
    ],
    images: {
      exterior: {
        src: "/fleet/sprinter-van-exterior.png",
        alt: "Sprinter van parked curbside",
      },
      interior: {
        src: "/fleet/sprinter-van-interior.png",
        alt: "Sprinter van interior with executive seating",
      },
    },
    featured: true,
  },
  {
    slug: "school-buses",
    name: "School Buses",
    vehicleName: "school bus",
    capacity: "40–48 passengers",
    short:
      "The budget-friendly classic for short trips, school events, and shuttles where simple works best.",
    description:
      "School buses are the most economical way to move a large group over shorter distances. They're a familiar, dependable choice for field trips, church events, camp shuttles, and wedding guest transport between venues.",
    amenities: [
      "Bench seating",
      "Roof hatches and ventilation",
      "High-visibility safety equipment",
      "Experienced, vetted drivers",
    ],
    idealFor: [
      "Field trips",
      "Church and camp events",
      "Wedding guest shuttles",
      "Local group transport",
    ],
    images: {
      exterior: {
        src: "/fleet/school-bus-exterior.png",
        alt: "Yellow school bus parked and ready for a group",
      },
      interior: {
        src: "/fleet/school-bus-interior.png",
        alt: "School bus interior with bench seating",
      },
    },
    featured: false,
  },
  {
    slug: "party-buses",
    name: "Party Buses",
    vehicleName: "party bus",
    capacity: "20–40 passengers",
    short:
      "Celebration on wheels — perimeter seating, lighting, and sound for birthdays, bachelor and bachelorette parties, and nights out.",
    description:
      "Party buses turn the ride itself into part of the event. Perimeter seating keeps the group together and talking, with sound systems and accent lighting on board. A professional driver handles the road so everyone can enjoy the night safely.",
    amenities: [
      "Perimeter wraparound seating",
      "Premium sound system",
      "Accent lighting",
      "Coolers and cup holders",
      "Professional chauffeur",
    ],
    idealFor: [
      "Birthdays and celebrations",
      "Bachelor and bachelorette parties",
      "Concerts and game days",
      "Prom and formals",
    ],
    images: {
      exterior: {
        src: "/fleet/party-bus-exterior.png",
        alt: "Party bus exterior at night",
      },
      interior: {
        src: "/fleet/party-bus-interior.png",
        alt: "Party bus interior with wraparound seating and accent lighting",
      },
    },
    featured: false,
  },
  {
    slug: "limousines",
    name: "Limousines",
    vehicleName: "stretch limousine",
    capacity: "6–10 passengers",
    short:
      "Classic stretch limousines for weddings, formal evenings, and arrivals that deserve an entrance.",
    description:
      "Our stretch limousines bring the classic touch to weddings, anniversaries, proms, and formal nights. Plush seating, privacy, and a chauffeur at the door — the details that make an occasion feel like one.",
    amenities: [
      "Plush leather seating",
      "Privacy partition",
      "Beverage bar",
      "Ambient lighting",
      "Professional chauffeur",
    ],
    idealFor: [
      "Weddings",
      "Anniversaries and date nights",
      "Prom and formals",
      "VIP airport pickups",
    ],
    images: {
      exterior: {
        src: "/fleet/stretch-limo-exterior.png",
        alt: "Stretch limousine parked outside a venue",
      },
      interior: {
        src: "/fleet/stretch-limo-interior.png",
        alt: "Stretch limousine interior with leather seating and bar",
      },
    },
    featured: false,
  },
  {
    slug: "suvs",
    name: "SUVs",
    vehicleName: "luxury SUV",
    capacity: "1–6 passengers",
    short:
      "Roomy, discreet luxury SUVs for executives, families, and airport runs with extra luggage.",
    description:
      "Luxury SUVs offer room for up to six passengers plus luggage, with the comfort and discretion executives and families expect. A strong choice for airport transfers, client pickups, and city-to-city runs.",
    amenities: [
      "Leather seating",
      "Generous luggage space",
      "Climate control",
      "Professional chauffeur",
    ],
    idealFor: [
      "Executive transport",
      "Airport transfers",
      "Family travel",
      "Client pickups",
    ],
    images: {
      exterior: {
        src: "/fleet/suv-exterior.png",
        alt: "Black luxury SUV parked curbside",
      },
      interior: {
        src: "/fleet/suv-interior.png",
        alt: "Luxury SUV interior with leather seating",
      },
    },
    featured: false,
  },
  {
    slug: "sedans",
    name: "Sedans",
    vehicleName: "executive sedan",
    capacity: "1–3 passengers",
    short:
      "Executive sedans for individuals and pairs — punctual, polished, point-to-point.",
    description:
      "Executive sedans are the simplest way to move one to three people in comfort. Airport pickups, business meetings, and evening events — on time, every time, with a professional behind the wheel.",
    amenities: [
      "Leather seating",
      "Quiet, smooth ride",
      "Meet-and-greet service",
      "Professional chauffeur",
    ],
    idealFor: [
      "Airport pickups",
      "Business meetings",
      "Evening events",
      "Individual VIP travel",
    ],
    images: {
      exterior: {
        src: "/fleet/sedan-exterior.png",
        alt: "Executive sedan parked in front of a building",
      },
      interior: {
        src: "/fleet/sedan-interior.png",
        alt: "Executive sedan interior with leather seats",
      },
    },
    featured: false,
  },
]

export const featuredFleet = fleetCategories.filter((c) => c.featured)

export function getFleetCategory(slug: string) {
  return fleetCategories.find((c) => c.slug === slug)
}
