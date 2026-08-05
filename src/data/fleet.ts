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
    slug: "motor-coaches",
    name: "Motor Coaches",
    vehicleName: "motor coach",
    capacity: "50–56 passengers",
    short:
      "Our largest coaches, built for the long haul — high-back seating, deep luggage bays, and a smooth ride hour after hour.",
    description:
      "Motor coaches seat 50 to 56 passengers and are built for distance. Raised-deck seating gives every passenger a view and a quieter ride, the luggage bays underneath swallow suitcases and equipment for a week away, and an on-board restroom keeps stops to a minimum. When a group is crossing state lines or touring for several days, this is the vehicle we recommend first.",
    amenities: [
      "Reclining high-back seats with seat belts",
      "On-board restroom",
      "Climate control",
      "Wi-Fi on board",
      "Power outlets",
      "Overhead monitors and PA system",
      "Oversized under-bus luggage bays",
    ],
    idealFor: [
      "Cross-country and interstate travel",
      "Multi-day tours and itineraries",
      "Conferences and convention groups",
      "Band, choir, and team travel with equipment",
    ],
    images: {
      exterior: {
        src: "/fleet/motor-coach-exterior.png",
        alt: "Motor coach exterior parked and ready for a long-distance trip",
      },
      interior: {
        src: "/fleet/motor-coach-interior.png",
        alt: "Motor coach interior with high-back reclining seats",
      },
    },
    featured: true,
  },
  {
    slug: "coach-buses",
    name: "Coach Buses",
    vehicleName: "coach bus",
    capacity: "40–45 passengers",
    short:
      "A step between mini bus and full-size coach — full comfort for mid-large groups without paying for empty seats.",
    description:
      "Coach buses seat 40 to 45 passengers — the right size when a full 56-seat coach would ride half empty but a mini bus can't hold everyone. You keep the comforts that matter on a longer ride, with a vehicle matched to your actual headcount.",
    amenities: [
      "Reclining seats with seat belts",
      "Climate control",
      "Wi-Fi on board",
      "Power outlets",
      "PA system",
      "Under-bus luggage bays",
    ],
    idealFor: [
      "Mid-large group trips",
      "Regional day trips and outings",
      "Church and community travel",
      "Conference and event shuttles",
    ],
    images: {
      exterior: {
        src: "/fleet/coach-bus-exterior.png",
        alt: "Coach bus exterior ready for boarding",
      },
      interior: {
        src: "/fleet/motor-coach-interior.png",
        alt: "Coach bus interior with reclining seats",
      },
    },
    featured: false,
  },
  {
    slug: "mini-buses",
    name: "Mini Buses",
    vehicleName: "mini bus",
    capacity: "20–32 passengers",
    short:
      "Mid-size comfort for groups that don't need a full coach — easier to load, easier to park, same reliable ride.",
    description:
      "Mini buses seat 20 to 32 passengers, hitting the sweet spot between a van and a full-size coach. They board quickly, navigate city streets and hotel entrances with ease, and still give every passenger a comfortable reclining seat — ideal for shuttles, day trips, and mid-size groups.",
    amenities: [
      "Reclining forward-facing seats",
      "Climate control",
      "Wi-Fi on board",
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
    capacity: "10–14 passengers",
    short:
      "Premium vans for small groups — executive comfort, airport-friendly, and quick around town.",
    description:
      "Sprinter vans carry 10 to 14 passengers in a tall, walk-in cabin with premium seating. They're the go-to for executive teams, airport transfers, and small groups that want to travel together without the footprint of a bus.",
    amenities: [
      "High-roof walk-in cabin",
      "Leather or executive seating",
      "Climate control",
      "Wi-Fi on board",
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
    capacity: "28–60 passengers",
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
    capacity: "14–40 passengers",
    short:
      "Celebration on wheels — perimeter seating, lighting, and sound for birthdays, bachelor and bachelorette parties, and nights out.",
    description:
      "Party buses turn the ride itself into part of the event. Perimeter seating keeps the group together and talking, with sound systems and accent lighting on board. A professional driver handles the road so everyone can enjoy the night safely.",
    amenities: [
      "Perimeter wraparound seating",
      "Premium sound system",
      "LED accent lighting",
      "Dance floor",
      "Bar area with coolers",
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
    capacity: "Up to 10 passengers",
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
    capacity: "Up to 7 passengers",
    short:
      "Roomy, discreet luxury SUVs for executives, families, and airport runs with extra luggage.",
    description:
      "Luxury SUVs offer room for up to seven passengers plus luggage, with the comfort and discretion executives and families expect. A strong choice for airport transfers, client pickups, and city-to-city runs.",
    amenities: [
      "Premium leather seating",
      "Generous cargo space",
      "Climate control",
      "Entertainment system",
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
    capacity: "Up to 4 passengers",
    short:
      "Executive sedans for individuals and pairs — punctual, polished, point-to-point.",
    description:
      "Executive sedans are the simplest way to move up to four people in comfort. Airport pickups, business meetings, and evening events — on time, every time, with a professional behind the wheel.",
    amenities: [
      "Premium leather interior",
      "Climate control",
      "Entertainment system",
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
