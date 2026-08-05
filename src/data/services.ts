export type Service = {
  slug: string
  name: string
  short: string
  intro: string[]
  whatWeHandle: string[]
  relatedFleetSlugs: string[]
}

export const services: Service[] = [
  {
    slug: "corporate-travel",
    name: "Corporate Travel",
    short:
      "Shuttles, offsites, and conference transport that keep your team moving on schedule.",
    intro: [
      "When a team needs to be somewhere, the transportation should be the one thing nobody has to think about. We handle employee shuttles, offsite retreats, conference transfers, and investor days for companies of every size.",
      "One coordinator, one invoice, and a driver who's briefed on your schedule. Recurring routes and last-minute changes are both part of the job.",
    ],
    whatWeHandle: [
      "Daily and event employee shuttles",
      "Conference and trade-show transfers",
      "Offsite retreats and team events",
      "Client and investor transportation",
    ],
    relatedFleetSlugs: ["charter-buses", "mini-buses", "sprinter-vans"],
  },
  {
    slug: "event-transportation",
    name: "Event Transportation",
    short:
      "Concerts, festivals, reunions, and big days — everyone arrives together, parking solved.",
    intro: [
      "Big events come with parking headaches, staggered arrivals, and someone always running late. A dedicated bus solves all three: your group leaves together, arrives together, and gets picked up at the door when it's over.",
      "We plan pickup points, timing, and routes around your event so the ride is part of the fun rather than a logistics problem.",
    ],
    whatWeHandle: [
      "Concerts and festivals",
      "Family reunions",
      "Church and community events",
      "Convention and expo shuttles",
    ],
    relatedFleetSlugs: ["charter-buses", "party-buses", "mini-buses"],
  },
  {
    slug: "airport-transfers",
    name: "Airport Transfers",
    short:
      "Group airport pickups and drop-offs with flight tracking and meet-and-greet service.",
    intro: [
      "Landing with a group is the worst time to improvise. We track your flight, meet you at arrivals, and load everyone — and everything — into one vehicle sized for the job.",
      "From a single executive sedan to a full coach for a touring group, airport runs are timed around real arrival times, not guesses.",
    ],
    whatWeHandle: [
      "Group arrivals and departures",
      "Flight tracking and schedule adjustment",
      "Meet-and-greet at baggage claim",
      "Crew and team transfers",
    ],
    relatedFleetSlugs: ["sprinter-vans", "suvs", "sedans", "mini-buses"],
  },
  {
    slug: "sports-team-travel",
    name: "Sports Team Travel",
    short:
      "Team, gear, and staff to the venue on time — game days, tournaments, and full seasons.",
    intro: [
      "Coaches have enough to manage on game day. We move teams, equipment, and support staff to venues on time, with luggage bays that swallow gear bags and drivers who know stadium access routes.",
      "Single games, weekend tournaments, or a full season schedule — we build the transportation plan around your fixture list.",
    ],
    whatWeHandle: [
      "Game-day team transport",
      "Tournament and multi-stop trips",
      "Equipment and gear hauling",
      "Fan and booster shuttles",
    ],
    relatedFleetSlugs: ["charter-buses", "mini-buses", "school-buses"],
  },
  {
    slug: "wedding-transportation",
    name: "Wedding & Group Celebrations",
    short:
      "Guest shuttles, wedding-party limos, and send-offs — timed to the minute on the big day.",
    intro: [
      "A wedding runs on a timeline, and transportation is the thread that holds it together. We shuttle guests between hotels, ceremony, and reception, and carry the wedding party in style.",
      "Your coordinator gets a single point of contact and a schedule built around the day — first look to last dance.",
    ],
    whatWeHandle: [
      "Guest shuttles between venues",
      "Wedding-party limousines",
      "Bachelor and bachelorette outings",
      "End-of-night send-offs",
    ],
    relatedFleetSlugs: ["limousines", "party-buses", "mini-buses", "school-buses"],
  },
  {
    slug: "city-tours",
    name: "City Tours",
    short:
      "Sightseeing charters with a driver who knows the route — hop between landmarks without hunting for parking.",
    intro: [
      "Seeing a city with a group is better when nobody has to navigate, park, or count heads across three rideshares. Your driver handles the route while your group watches the city go by together.",
      "We plan tour charters around your list of stops — museums, landmarks, neighborhoods, restaurants — with dwell time at each and a warm bus waiting when you're ready for the next one.",
    ],
    whatWeHandle: [
      "Sightseeing loops and landmark routes",
      "Museum and attraction hops with timed stops",
      "Food and neighborhood tours",
      "Visiting groups, reunions, and conventions",
    ],
    relatedFleetSlugs: ["mini-buses", "charter-buses", "sprinter-vans"],
  },
  {
    slug: "long-distance-charter",
    name: "Long-Distance Charter",
    short:
      "Interstate and cross-country trips with rested drivers, planned stops, and a coach built for the miles.",
    intro: [
      "Long trips are where a real coach earns its keep: reclining seats, an on-board restroom, luggage space for everyone, and a driver whose hours are managed so the trip never depends on one person pushing through.",
      "We plan multi-day itineraries end to end — fuel and rest stops, driver lodging, overnight parking — so a 900-mile trip runs as smoothly as a crosstown shuttle.",
    ],
    whatWeHandle: [
      "Interstate and cross-country charters",
      "Multi-day tours with overnight stays",
      "Relief drivers and rest compliance on long hauls",
      "Route planning with fuel and meal stops",
    ],
    relatedFleetSlugs: ["motor-coaches", "charter-buses", "coach-buses"],
  },
  {
    slug: "school-trips",
    name: "School Trips",
    short:
      "Field trips, campus visits, and activity travel with safety-first drivers and clear pricing.",
    intro: [
      "Schools need transportation that's safe, punctual, and easy to book with an approval chain in mind. Our drivers are vetted and experienced with student groups, and our quotes are itemized for administrators.",
      "From single-day field trips to overnight academic travel, we plan routes, rest stops, and chaperone seating with the school's requirements up front.",
    ],
    whatWeHandle: [
      "Field trips and museum days",
      "College campus visits",
      "Band, choir, and club travel",
      "Graduation and event transport",
    ],
    relatedFleetSlugs: ["school-buses", "charter-buses", "mini-buses"],
  },
]

export function getService(slug: string) {
  return services.find((s) => s.slug === slug)
}
