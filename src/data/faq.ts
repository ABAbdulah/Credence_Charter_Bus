export type FaqCategory =
  | "Booking"
  | "Pricing"
  | "Fleet"
  | "Safety"
  | "Policies"
  | "Services"

export type FaqItem = {
  question: string
  answer: string
  category: FaqCategory
}

export const faqCategories: FaqCategory[] = [
  "Booking",
  "Pricing",
  "Fleet",
  "Safety",
  "Policies",
  "Services",
]

export const faqItems: FaqItem[] = [
  {
    category: "Booking",
    question: "How far in advance should I book?",
    answer:
      "For weekends, holidays, and popular months like May, June, and October, we recommend booking 4–8 weeks ahead. That said, call us even for last-minute trips — we can often accommodate requests within a few days.",
  },
  {
    category: "Booking",
    question: "Can I change my reservation after booking?",
    answer:
      "Yes. Tell your coordinator as early as you can and we'll rework the itinerary. Changes close to departure may carry a fee or depend on vehicle availability — the exact terms are spelled out in your rental agreement and on our Terms page.",
  },
  {
    category: "Booking",
    question: "Do I need to pay a deposit?",
    answer:
      "Most reservations are held with a deposit, with the balance due before departure. Your agreement lays out the exact payment schedule before you sign, so there are no surprises.",
  },
  {
    category: "Booking",
    question: "What is your cancellation policy?",
    answer:
      "Plans change — we get it. Cancellation terms are spelled out clearly in your rental agreement before you sign, and the full schedule is published on our Refund Policy page. Ask your coordinator about the timeline for a full refund.",
  },
  {
    category: "Pricing",
    question: "How much does it cost to rent a charter bus?",
    answer:
      "Pricing depends on vehicle type, trip distance, duration, and dates. Every quote we send is itemized and all-in — driver, fuel, tolls, and taxes included — so the number you see is the number you pay. Request a free quote and you'll have it the same day in most cases.",
  },
  {
    category: "Pricing",
    question: "Is the driver included in the price?",
    answer:
      "Yes. Every rental includes a licensed, professionally trained driver. Their time, lodging on multi-day trips, and all driving-hour compliance are handled by us and included in your quote.",
  },
  {
    category: "Pricing",
    question: "Are there any additional fees?",
    answer:
      "Your quote covers the driver, fuel, tolls, and taxes. Venue-specific costs — stadium or park entry permits, parking at your destination — are the group's responsibility, and your coordinator will flag any that apply to your route before you book.",
  },
  {
    category: "Pricing",
    question: "Do round trips or multi-day trips cost less?",
    answer:
      "Per day, usually yes — a vehicle and driver booked across several days is priced better than separate one-day rentals. Send us the full itinerary and we'll quote it as one trip so you see the complete number.",
  },
  {
    category: "Fleet",
    question: "What types of vehicles do you offer?",
    answer:
      "Full-size charter buses and motor coaches, coach buses, mini buses, sprinter vans, school buses, party buses, stretch limousines, SUVs, and sedans — from 4 passengers to 56. If you're not sure what fits, tell us the group size and we'll recommend the right vehicle.",
  },
  {
    category: "Fleet",
    question: "What amenities are included?",
    answer:
      "It varies by vehicle. Charter buses and motor coaches come with reclining seats, climate control, Wi-Fi, power outlets, and an on-board restroom. Mini buses and sprinter vans include Wi-Fi and comfortable seating. Party buses add premium sound, LED lighting, a dance floor, and a bar area. Each fleet page lists exactly what's on board.",
  },
  {
    category: "Fleet",
    question: "Are your vehicles accessible?",
    answer:
      "ADA-compliant vehicles with wheelchair lifts are available on request. Let us know your group's needs when you request a quote and we'll match you with the right vehicle.",
  },
  {
    category: "Fleet",
    question: "How old are your vehicles?",
    answer:
      "We run a modern fleet maintained on a strict service schedule, with inspections before every trip — not after something fails. If your organization requires vehicle documentation, your coordinator can provide it.",
  },
  {
    category: "Safety",
    question: "Are your drivers licensed and insured?",
    answer:
      "Yes. Every driver holds a commercial license with a passenger endorsement, passes background and driving-record checks, and is covered by commercial insurance. Safety is the first requirement of the job, not a feature.",
  },
  {
    category: "Safety",
    question: "What safety measures do you have in place?",
    answer:
      "Vetted drivers, enforced rest and driving-hour limits, scheduled vehicle maintenance, and pre-trip inspections on every departure. Our dispatch team also monitors weather and road conditions along your route.",
  },
  {
    category: "Safety",
    question: "What happens if something goes wrong mid-trip?",
    answer:
      "Dispatch is reachable around the clock, and your driver is in contact with them throughout the trip. If a vehicle develops a mechanical problem, we arrange a repair or a replacement vehicle to keep your itinerary moving.",
  },
  {
    category: "Policies",
    question: "What is your smoking policy?",
    answer:
      "All vehicles are smoke-free, including e-cigarettes and vaping. Your driver will build in rest stops on longer trips.",
  },
  {
    category: "Policies",
    question: "Can we bring food and drinks on board?",
    answer:
      "Snacks and non-alcoholic drinks are welcome on most vehicles. Alcohol policies vary by vehicle and state — tell your coordinator what you have in mind and we'll set it up properly.",
  },
  {
    category: "Policies",
    question: "How much luggage can we bring?",
    answer:
      "Full-size buses have under-bus bays that hold a suitcase and a carry-on per passenger with room to spare; smaller vehicles have dedicated luggage space listed on their fleet pages. Traveling with instruments, sports gear, or other oversized items? Tell your coordinator and we'll plan the space.",
  },
  {
    category: "Services",
    question: "Where do you operate?",
    answer:
      "Nationwide — we arrange charters in all 50 states, from single-city shuttles to cross-country tours.",
  },
  {
    category: "Services",
    question: "Can you handle airport transfers?",
    answer:
      "Yes — group airport pickups and drop-offs are a core service. We track your flight, adjust for delays, and meet your group at arrivals with a vehicle sized for the passenger count and the luggage.",
  },
  {
    category: "Services",
    question: "What happens if our plans change on the day?",
    answer:
      "Your driver and coordinator stay reachable throughout the trip. Reasonable schedule adjustments on the day are part of the service — talk to your driver and we'll make it work.",
  },
]
