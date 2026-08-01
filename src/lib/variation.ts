import { siteConfig } from "@/config/site"

export function hashString(input: string) {
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    hash = ((hash * 33) ^ input.charCodeAt(i)) >>> 0
  }
  return hash
}

export function pickVariant<T>(seed: string, pool: readonly T[]): T {
  return pool[hashString(seed) % pool.length]
}

export type CityNeighbor = {
  name: string
  miles: number
}

export type CityCopyContext = {
  seed: string
  city: string
  state: string
  abbr: string
  region: string
  population: number
  nearby: CityNeighbor[]
}

type Template = (c: CityCopyContext) => string

const openingTemplates: ReadonlyArray<Template> = [
  (c) =>
    `Planning group travel in ${c.city}? Credence Charter Bus arranges charter buses, mini buses, and sprinter vans throughout ${c.state} — each with a licensed professional driver and a clear, all-in quote before you commit to anything.`,
  (c) =>
    `When a ${c.city} group needs to move together — a wedding weekend, a corporate offsite, a school trip — we put the right vehicle at the door with a professional driver behind the wheel, anywhere in ${c.state} and beyond.`,
  (c) =>
    `${c.city} groups book with Credence because the process is simple: tell us your dates and headcount, get an itemized quote, and your bus arrives early. It works that way across ${c.state} and all 50 states.`,
  (c) =>
    `From ${c.city}, your group can reach any corner of ${c.abbr} — or the country — in one comfortable vehicle. We handle the route, the driver, and the schedule; you handle the guest list.`,
  (c) =>
    `Renting a charter bus in ${c.city} shouldn't require guesswork. Our coordinators price your trip up front — driver, fuel, and tolls included — and stay reachable from first pickup to final stop anywhere in ${c.state}.`,
  (c) =>
    `Whether it's forty colleagues headed to a conference or a full wedding guest list moving between venues, Credence keeps ${c.city} groups together and on schedule, with vehicles sized for every headcount.`,
  (c) =>
    `Group transportation out of ${c.city} comes down to three things: the right size vehicle, a driver who knows the route, and a price that doesn't move after you sign. That's what we quote, every time, anywhere in ${c.state}.`,
  (c) =>
    `Moving a group through ${c.city} is easier in one vehicle than in a dozen cars. Credence matches your headcount to a charter bus, mini bus, or van, then handles the driver, the timing, and the parking.`,
  (c) =>
    `${siteConfig.name} has been arranging group travel since ${siteConfig.established} — including trips starting in ${c.city} and running clear across ${c.state}. One coordinator stays with your booking from the first quote to the final drop-off.`,
  (c) =>
    `If your ${c.city} event depends on everyone arriving at once, a chartered vehicle is the simplest way to guarantee it. We size the bus to your group and confirm the route before your date.`,
  (c) =>
    `${c.city} weddings, corporate shuttles, team travel, and church outings all run through the same Credence process: a two-minute quote request, an itemized price, and a vetted driver on the day.`,
  (c) =>
    `Chartering a bus from ${c.city} means no one drives, no one parks, and no one gets lost on the way. We cover the whole ${c.region} and every state beyond it.`,
]

const detailTemplates: ReadonlyArray<Template> = [
  (c) =>
    `Trips to ${c.nearby[0].name}, ${c.nearby[1].name}, or anywhere across the ${c.region} are all in a day's work. Local shuttles, one-way transfers, and multi-day tours each get the same treatment: a dedicated coordinator, a vetted driver, and a vehicle that matches your group.`,
  (c) =>
    `Many of our ${c.city} bookings run to ${c.nearby[0].name}, about ${c.nearby[0].miles} miles out, but no route is too short or too long — airport runs, game days, and cross-country tours all start with the same two-minute quote request.`,
  (c) =>
    `Need to get from ${c.city} to ${c.nearby[0].name}? Hosting out-of-town guests arriving from ${c.nearby[1].name}? We plan pickups, timing, and parking in advance, so the day itself runs without surprises.`,
  (c) =>
    `Popular routes include ${c.city} to ${c.nearby[0].name} (${c.nearby[0].miles} miles) and ${c.city} to ${c.nearby[1].name} (${c.nearby[1].miles} miles), alongside local wedding shuttles and daily corporate runs. Every trip is priced as one itemized number — no fuel surprises, no hidden fees.`,
  (c) =>
    `From quick shuttles across town to weekend trips toward ${c.nearby[0].name} or ${c.nearby[1].name}, groups in ${c.city} ride with drivers who know the ${c.region}'s roads and a support line that answers around the clock.`,
  (c) =>
    `${c.nearby[0].name} sits roughly ${c.nearby[0].miles} miles from ${c.city}, and ${c.nearby[1].name} about ${c.nearby[1].miles} — both common stops on routes we run. Longer hauls across ${c.state} and into neighbouring states are just as routine.`,
  (c) =>
    `A typical ${c.city} booking covers a single day and a handful of stops, but multi-day itineraries through ${c.nearby[0].name} and beyond are priced the same transparent way: driver, fuel, tolls, and taxes in one number.`,
  (c) =>
    `Groups leaving ${c.city} regularly head toward ${c.nearby[0].name} and ${c.nearby[1].name}. Wherever you are going, we confirm pickup points and travel time up front so your schedule holds.`,
  (c) =>
    `Whether you need a short hop to ${c.nearby[0].name} or a full week touring the ${c.region}, the same coordinator handles your ${c.city} booking end to end — no call centre, no handoffs.`,
  (c) =>
    `Airport transfers, venue shuttles, and intercity runs toward ${c.nearby[1].name} all leave from ${c.city} on a regular basis. Tell us the headcount and the date, and we will size the vehicle to fit.`,
]

const scaleTemplates: Record<string, ReadonlyArray<Template>> = {
  metro: [
    (c) =>
      `With a population near ${formatPopulation(c.population)}, ${c.city} sees steady demand for conference shuttles and event transport, so booking early on peak weekends is worth the call.`,
    (c) =>
      `${c.city} is one of the larger markets in ${c.state}, and traffic and venue access matter here — our drivers plan loading zones and staging in advance.`,
  ],
  city: [
    (c) =>
      `${c.city} is home to roughly ${formatPopulation(c.population)} people, big enough for full-size coach work and small enough that pickups stay simple.`,
    (c) =>
      `At about ${formatPopulation(c.population)} residents, ${c.city} supports everything from a 14-seat van to a 56-passenger coach depending on your group.`,
  ],
  town: [
    (c) =>
      `${c.city} has around ${formatPopulation(c.population)} residents, so mini buses and sprinter vans are the usual fit — though a full coach is available whenever the group calls for one.`,
    (c) =>
      `Smaller communities like ${c.city}, population roughly ${formatPopulation(c.population)}, are exactly where a single chartered vehicle beats a convoy of cars.`,
  ],
  small: [
    (c) =>
      `${c.city} is a small community, so most bookings here are vans and mini buses — but we bring in whatever size the group needs, and there is no surcharge for the distance.`,
    (c) =>
      `Even in a town the size of ${c.city}, a chartered vehicle is often the cheapest way to move a group once you count fuel, parking, and everyone's time.`,
  ],
}

const descriptionTemplates: ReadonlyArray<Template> = [
  (c) =>
    `Charter bus and mini bus rentals in ${c.city}, ${c.abbr}. Licensed drivers, all-in quotes, groups of 8 to 56. Request a free quote or call — we answer 24/7.`,
  (c) =>
    `Rent a charter bus, mini bus, or sprinter van in ${c.city}, ${c.state}. Clear itemized pricing and a professional driver on every trip. Free same-day quotes.`,
  (c) =>
    `Group transportation in ${c.city}, ${c.abbr} — weddings, corporate travel, school trips, and tours. Get a free all-in charter quote today.`,
  (c) =>
    `Charter bus rental in ${c.city}, ${c.abbr} for groups of any size. Vetted drivers, no hidden fees, routes throughout ${c.state}. Free quote in minutes.`,
  (c) =>
    `Book a charter bus or mini bus in ${c.city}, ${c.state}. Wedding shuttles, corporate runs, and team travel with itemized all-in pricing. Call anytime.`,
  (c) =>
    `${c.city}, ${c.abbr} charter bus and van rentals with a professional driver included. Straightforward quotes, no surprises. Serving all of ${c.state}.`,
]

function formatPopulation(population: number) {
  if (population >= 1000000) return `${(population / 1000000).toFixed(1)} million`
  if (population >= 10000) return `${Math.round(population / 1000)},000`
  return population.toLocaleString("en-US")
}

function scaleOf(population: number) {
  if (population >= 250000) return "metro"
  if (population >= 50000) return "city"
  if (population >= 10000) return "town"
  return "small"
}

export function buildCityCopy(context: CityCopyContext) {
  const scalePool = scaleTemplates[scaleOf(context.population)]
  return {
    opening: pickVariant(`${context.seed}-opening`, openingTemplates)(context),
    detail: pickVariant(`${context.seed}-detail`, detailTemplates)(context),
    scale: pickVariant(`${context.seed}-scale`, scalePool)(context),
    description: pickVariant(
      `${context.seed}-description`,
      descriptionTemplates
    )(context),
  }
}
