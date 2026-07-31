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

export type CityCopyContext = {
  seed: string
  city: string
  state: string
  abbr: string
  region: string
  nearby: string[]
}

const openingTemplates: ReadonlyArray<(c: CityCopyContext) => string> = [
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
]

const detailTemplates: ReadonlyArray<(c: CityCopyContext) => string> = [
  (c) =>
    `Trips to ${c.nearby[0]}, ${c.nearby[1]}, or anywhere across the ${c.region} are all in a day's work. Local shuttles, one-way transfers, and multi-day tours each get the same treatment: a dedicated coordinator, a vetted driver, and a vehicle that matches your group.`,
  (c) =>
    `Many of our ${c.city} bookings run to ${c.nearby[0]} and ${c.nearby[1]}, but no route is too short or too long — airport runs, game days, and cross-country tours all start with the same two-minute quote request.`,
  (c) =>
    `Need to get from ${c.city} to ${c.nearby[0]}? Hosting out-of-town guests arriving from ${c.nearby[1]}? We plan pickups, timing, and parking in advance, so the day itself runs without surprises.`,
  (c) =>
    `Popular routes include ${c.city} to ${c.nearby[0]} and ${c.city} to ${c.nearby[1]}, alongside local wedding shuttles and daily corporate runs. Every trip is priced as one itemized number — no fuel surprises, no hidden fees.`,
  (c) =>
    `From quick shuttles across town to weekend trips toward ${c.nearby[0]} or ${c.nearby[1]}, groups in ${c.city} ride with drivers who know the ${c.region}'s roads and a support line that answers around the clock.`,
]

const descriptionTemplates: ReadonlyArray<(c: CityCopyContext) => string> = [
  (c) =>
    `Charter bus and mini bus rentals in ${c.city}, ${c.abbr}. Licensed drivers, all-in quotes, groups of 8 to 56. Request a free quote or call — we answer 24/7.`,
  (c) =>
    `Rent a charter bus, mini bus, or sprinter van in ${c.city}, ${c.state}. Clear itemized pricing and a professional driver on every trip. Free same-day quotes.`,
  (c) =>
    `Group transportation in ${c.city}, ${c.abbr} — weddings, corporate travel, school trips, and tours. Get a free all-in charter quote today.`,
]

export function buildCityCopy(context: CityCopyContext) {
  return {
    opening: pickVariant(`${context.seed}-opening`, openingTemplates)(context),
    detail: pickVariant(`${context.seed}-detail`, detailTemplates)(context),
    description: pickVariant(
      `${context.seed}-description`,
      descriptionTemplates
    )(context),
  }
}
