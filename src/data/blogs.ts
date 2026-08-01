export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  heroImage: { src: string; alt: string }
  body: BlogBlock[]
  planningLinks: { label: string; href: string }[]
  relatedPostSlugs: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-rent-a-charter-bus-for-a-wedding",
    title: "How to Rent a Charter Bus for a Wedding",
    excerpt:
      "Guest shuttles, timing, and the questions to ask before you sign — a practical guide to wedding transportation.",
    date: "2026-07-15",
    heroImage: {
      src: "/fleet/stretch-limo-exterior.png",
      alt: "Stretch limousine waiting outside a wedding venue",
    },
    body: [
      {
        type: "p",
        text: "A wedding day runs on a timeline, and transportation is the thread that holds it together. Guests staying at three hotels, a ceremony across town, a reception that ends at midnight — a well-planned shuttle turns all of that from a risk into a detail nobody has to think about.",
      },
      { type: "h2", text: "Start with the guest count, not the vehicle" },
      {
        type: "p",
        text: "Before you look at buses, count riders. A good rule: about 60 to 70 percent of out-of-town guests will use a shuttle if you offer one. For 120 invited guests with 80 from out of town, plan seats for roughly 50 to 60 riders — one full-size charter bus, or two mini buses running a loop.",
      },
      { type: "h2", text: "Map the day before you request quotes" },
      {
        type: "ul",
        items: [
          "Pickup points: usually one or two hotels where room blocks are held",
          "Ceremony arrival: shuttles should land 20–30 minutes before start time",
          "The gap: if there's downtime between ceremony and reception, decide where guests wait",
          "The night run: schedule at least two departure times so early leavers don't strand the dance floor",
        ],
      },
      { type: "h2", text: "Book the wedding party separately" },
      {
        type: "p",
        text: "The wedding party moves on a different schedule — photos, first looks, a champagne toast en route. A limousine or party bus for 6 to 20 keeps that group together without holding up guest shuttles. Book it as its own vehicle with its own itinerary.",
      },
      { type: "h2", text: "Questions to ask before signing" },
      {
        type: "ul",
        items: [
          "Is the quote all-in — driver, fuel, tolls, and taxes included?",
          "How is overtime billed if the reception runs long?",
          "Who is the day-of contact, and are they reachable during the event?",
          "What is the cancellation and weather policy?",
        ],
      },
      {
        type: "p",
        text: "Book eight to twelve weeks out for peak months — May, June, September, and October fill first. A deposit typically holds the vehicle, and a final headcount is usually due two weeks before the day.",
      },
    ],
    planningLinks: [
      { label: "Wedding & group celebration transportation", href: "/services/wedding-transportation" },
      { label: "Limousines in our fleet", href: "/fleet/limousines" },
      { label: "Mini buses for guest shuttles", href: "/fleet/mini-buses" },
      { label: "Get a wedding shuttle quote", href: "/quote" },
    ],
    relatedPostSlugs: ["what-a-charter-bus-quote-should-include", "charter-bus-vs-mini-bus"],
  },
  {
    slug: "charter-bus-vs-mini-bus",
    title: "Charter Bus vs. Mini Bus: Which Fits Your Group?",
    excerpt:
      "Capacity, cost, and comfort compared side by side, so you book the right size the first time.",
    date: "2026-07-08",
    heroImage: {
      src: "/fleet/mini-bus-exterior.png",
      alt: "Mini bus parked beside a full-size charter bus",
    },
    body: [
      {
        type: "p",
        text: "The most common question we hear: do we need a full-size charter bus, or will a mini bus do? The honest answer depends on three things — headcount, trip length, and luggage. Here's how to decide in five minutes.",
      },
      { type: "h2", text: "Headcount is the first filter" },
      {
        type: "p",
        text: "A full-size charter bus seats 36 to 56 passengers; a mini bus seats 20 to 35. If your confirmed count is under 30, a mini bus almost always wins on price and maneuverability. Between 30 and 36, get quotes for both — the price gap narrows and the coach adds comfort.",
      },
      { type: "h2", text: "Trip length changes the math" },
      {
        type: "ul",
        items: [
          "Under two hours each way: mini bus comfort is fine for most groups",
          "Two to five hours: the coach's reclining seats and on-board restroom start earning their keep",
          "Overnight or multi-day: full-size charter, almost without exception — luggage bays matter",
        ],
      },
      { type: "h2", text: "Where the mini bus wins" },
      {
        type: "p",
        text: "Tight city streets, hotel porte-cochères, winery driveways, and parking lots that were never designed for a 45-foot coach. Mini buses load faster, park closer, and cost less per trip. For shuttle loops — weddings, conferences, campus tours — they're usually the right call.",
      },
      { type: "h2", text: "Where the charter bus wins" },
      {
        type: "p",
        text: "Long highway miles with a big group. The restroom means fewer stops, under-bus bays swallow everyone's luggage, and the ride is noticeably smoother at speed. Per-person, a full coach is often the cheapest way to move 40+ people anywhere.",
      },
      {
        type: "p",
        text: "Still torn? Send us both scenarios in one quote request — we'll price each and tell you plainly which we'd book for your trip.",
      },
    ],
    planningLinks: [
      { label: "Charter buses in detail", href: "/fleet/charter-buses" },
      { label: "Mini buses in detail", href: "/fleet/mini-buses" },
      { label: "Compare the full fleet", href: "/fleet" },
      { label: "Price both options with one quote", href: "/quote" },
    ],
    relatedPostSlugs: ["what-a-charter-bus-quote-should-include", "corporate-event-transportation-guide"],
  },
  {
    slug: "what-a-charter-bus-quote-should-include",
    title: "What a Charter Bus Quote Should Include",
    excerpt:
      "Driver, fuel, tolls, gratuity — learn what belongs in an honest quote and the red flags to watch for.",
    date: "2026-07-01",
    heroImage: {
      src: "/fleet/charter-bus-exterior.png",
      alt: "Charter bus ready for departure",
    },
    body: [
      {
        type: "p",
        text: "Two quotes for the same trip can differ by hundreds of dollars — and the cheaper one can cost more by the end. The difference is almost always what's left out. Here's what a complete charter quote includes, so you can compare like for like.",
      },
      { type: "h2", text: "The six line items that belong in every quote" },
      {
        type: "ul",
        items: [
          "Base rate: hourly, daily, or per-mile — stated clearly with the applicable minimum",
          "Driver: wages and, on multi-day trips, the driver's lodging",
          "Fuel: included, or estimated with the assumption written down",
          "Tolls and parking: itemized for your actual route and venues",
          "Taxes and fees: spelled out, not summarized as 'plus fees'",
          "Gratuity: whether it's included, expected, or genuinely optional",
        ],
      },
      { type: "h2", text: "Red flags worth walking away from" },
      {
        type: "ul",
        items: [
          "A total that isn't itemized — 'all-inclusive' with no breakdown",
          "Fuel surcharges 'to be determined' after the trip",
          "No written overtime rate for events that might run long",
          "A deposit larger than 50 percent, or cancellation terms that aren't in writing",
        ],
      },
      { type: "h2", text: "Questions that separate good operators from cheap ones" },
      {
        type: "p",
        text: "Ask how old the vehicle is and whether the one quoted is the one that arrives. Ask about the interstate operating authority and insurance minimums — a legitimate operator answers without hesitation. Ask who you call at 6 a.m. on trip day. The quality of those answers predicts the quality of the trip.",
      },
      {
        type: "p",
        text: "Our quotes arrive itemized and all-in by default — the number you see is the number you pay. If you're comparing us against someone else's quote, we'll walk through both with you line by line.",
      },
    ],
    planningLinks: [
      { label: "Request an itemized quote", href: "/quote" },
      { label: "Pricing questions in our FAQ", href: "/faq" },
      { label: "Browse the fleet", href: "/fleet" },
    ],
    relatedPostSlugs: ["charter-bus-vs-mini-bus", "how-to-rent-a-charter-bus-for-a-wedding"],
  },
  {
    slug: "planning-a-school-trip-by-charter-bus",
    title: "Planning a School Trip by Charter Bus: A Checklist for Organizers",
    excerpt:
      "Approvals, chaperone ratios, and vehicle choice — everything a teacher or administrator needs to book student travel with confidence.",
    date: "2026-06-24",
    heroImage: {
      src: "/fleet/school-bus-exterior.png",
      alt: "School bus ready for a field trip departure",
    },
    body: [
      {
        type: "p",
        text: "School trips carry a longer checklist than any other charter — approvals, permission slips, chaperone ratios, and a schedule that has to work around the bell. Handled in the right order, none of it is difficult. Here's the sequence experienced organizers follow.",
      },
      { type: "h2", text: "Eight weeks out: lock the framework" },
      {
        type: "ul",
        items: [
          "Get administrative approval and confirm the budget owner",
          "Request quotes with your student count, grade level, and any district vendor requirements",
          "Confirm the operator's insurance certificates and driver vetting meet district policy",
        ],
      },
      { type: "h2", text: "Choosing the vehicle" },
      {
        type: "p",
        text: "For local trips under two hours, a classic school bus is the economical, familiar choice. For longer academic travel — state competitions, college visits, overnight trips — a full charter bus earns its cost with seat belts, luggage bays, a restroom, and a smoother highway ride that keeps students rested.",
      },
      { type: "h2", text: "Two weeks out: finalize the manifest" },
      {
        type: "ul",
        items: [
          "Confirm final headcount and the chaperone ratio your district requires",
          "Share the seating plan and emergency contact sheet with the operator",
          "Walk the schedule with your coordinator: load time, rest stops, and pickup point for the return",
        ],
      },
      { type: "h2", text: "On the day" },
      {
        type: "p",
        text: "Board by roster, count twice, and exchange cell numbers with the driver before wheels roll. A good operator's dispatch stays reachable for the whole trip — if a museum runs late or weather shifts the schedule, one call adjusts the plan.",
      },
    ],
    planningLinks: [
      { label: "School trip transportation", href: "/services/school-trips" },
      { label: "School buses in our fleet", href: "/fleet/school-buses" },
      { label: "Charter buses for longer trips", href: "/fleet/charter-buses" },
      { label: "Get a school trip quote", href: "/quote" },
    ],
    relatedPostSlugs: ["what-a-charter-bus-quote-should-include", "charter-bus-vs-mini-bus"],
  },
  {
    slug: "corporate-event-transportation-guide",
    title: "Corporate Event Transportation: A Planner's Guide",
    excerpt:
      "Offsites, conferences, and client days — how to move a company without losing a single working hour.",
    date: "2026-06-17",
    heroImage: {
      src: "/fleet/sprinter-van-exterior.png",
      alt: "Executive sprinter van outside an office",
    },
    body: [
      {
        type: "p",
        text: "The measure of corporate transportation is simple: nobody talks about it afterward. The team arrives together, on time, expenses land on one invoice, and the planner never takes a panicked call. Getting there is mostly about decisions made before the quote request.",
      },
      { type: "h2", text: "Match the vehicle to the meeting" },
      {
        type: "ul",
        items: [
          "Executive groups of 8–14: a sprinter van — walk-in cabin, room for laptops and garment bags",
          "Department offsites of 20–35: a mini bus keeps the group together without coach-scale logistics",
          "Company-wide moves of 40+: full charter buses, staggered if the venue loads slowly",
        ],
      },
      { type: "h2", text: "The three details planners forget" },
      {
        type: "ul",
        items: [
          "Load time: boarding 45 people takes 15 minutes, not five — build it into the agenda",
          "The return trigger: set a hard departure time or a named decision-maker, not 'when it wraps up'",
          "Phone chain: driver, coordinator, and one on-site contact should have each other's numbers before the day",
        ],
      },
      { type: "h2", text: "Recurring routes deserve a standing arrangement" },
      {
        type: "p",
        text: "If your company runs the same shuttle every quarter — airport to HQ, campus to conference center — ask for a recurring arrangement. You'll get the same coordinator, consistent vehicles, and pricing that doesn't reset with every request. Procurement gets one vendor file; you get a phone number that already knows your account.",
      },
      {
        type: "p",
        text: "Send us your event date and headcount, and we'll return an itemized quote with a load plan — usually the same business day.",
      },
    ],
    planningLinks: [
      { label: "Corporate travel services", href: "/services/corporate-travel" },
      { label: "Sprinter vans for executive teams", href: "/fleet/sprinter-vans" },
      { label: "Airport transfer service", href: "/services/airport-transfers" },
      { label: "Get a corporate quote", href: "/quote" },
    ],
    relatedPostSlugs: ["charter-bus-vs-mini-bus", "what-a-charter-bus-quote-should-include"],
  },
  {
    slug: "six-group-trips-worth-chartering-a-bus-for",
    title: "Six Group Trips Worth Chartering a Bus For",
    excerpt:
      "From Texas Hill Country to the Georgia coast — destination ideas where the bus ride is part of the fun.",
    date: "2026-06-10",
    heroImage: {
      src: "/fleet/motor-coach-exterior.png",
      alt: "Motorcoach on a scenic highway",
    },
    body: [
      {
        type: "p",
        text: "Some trips only work when everyone rides together — the tasting tour where nobody should drive, the game day where parking costs more than tickets, the reunion where the conversation on the bus is half the point. Six ideas our groups book again and again.",
      },
      { type: "h2", text: "1. Texas Hill Country wine trail" },
      {
        type: "p",
        text: "The stretch between Austin and Fredericksburg holds dozens of wineries along winding ranch roads. A chartered mini bus turns a designated-driver problem into a rolling party of 20 — and the vineyards welcome groups that arrive on one vehicle.",
      },
      { type: "h2", text: "2. The Georgia coast: Savannah in a day" },
      {
        type: "p",
        text: "Squares draped in live oak, a walkable historic district, and a riverfront made for long lunches. From Atlanta, Savannah is a comfortable coach ride — leave at seven, walk the squares by eleven, and sleep on the way home.",
      },
      { type: "h2", text: "3. Fall football Saturdays" },
      {
        type: "p",
        text: "College game days were built for buses: tailgate gear in the luggage bays, no parking scramble, and the group stays together from lot to gate. Book early for rivalry weekends — vehicles sell out weeks ahead in every college town.",
      },
      { type: "h2", text: "4. Arizona's red rock country" },
      {
        type: "p",
        text: "Phoenix to Sedona is two hours of climbing scenery with a payoff at every overlook. For retreats and family reunions, a charter turns the drive into the opening act — and nobody white-knuckles the switchbacks.",
      },
      { type: "h2", text: "5. The Florida theme park run" },
      {
        type: "p",
        text: "Church groups, school bands, and family reunions converge on Orlando year-round. A coach with a restroom and movie screens is the difference between arriving frazzled and arriving ready — especially with kids aboard.",
      },
      { type: "h2", text: "6. City food and history crawls" },
      {
        type: "p",
        text: "Philadelphia, Chicago, San Antonio — pick a city, chain four neighborhoods, and let a mini bus do the connecting. It's the reunion format that works for every generation: everyone walks the fun parts and rides the boring ones.",
      },
    ],
    planningLinks: [
      { label: "Charter buses in Texas", href: "/locations/texas" },
      { label: "Charter buses in Georgia", href: "/locations/georgia" },
      { label: "Charter buses in Arizona", href: "/locations/arizona" },
      { label: "Charter buses in Florida", href: "/locations/florida" },
      { label: "Event transportation services", href: "/services/event-transportation" },
    ],
    relatedPostSlugs: ["charter-bus-vs-mini-bus", "how-to-rent-a-charter-bus-for-a-wedding"],
  },
]

const sortedPosts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))

export const blogPreviews = sortedPosts.slice(0, 3).map((post) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  date: post.date,
}))

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

export function allBlogPostsSorted() {
  return sortedPosts
}
