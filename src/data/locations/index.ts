import locationsData from "./locations.json"

export type Region = "Northeast" | "Midwest" | "South" | "West"

export type StateEntry = {
  slug: string
  name: string
  abbr: string
  region: Region
}

export type CityEntry = {
  slug: string
  name: string
  stateSlug: string
  lat: number
  lng: number
  population: number
}

export const states = locationsData.states as StateEntry[]
export const cities = locationsData.cities as CityEntry[]

export const locationsBuildConfig = {
  prebuildCityLimit: 25,
}

export function getState(slug: string) {
  return states.find((state) => state.slug === slug)
}

export function getCity(stateSlug: string, citySlug: string) {
  return cities.find(
    (city) => city.stateSlug === stateSlug && city.slug === citySlug
  )
}

export function citiesOfState(stateSlug: string) {
  return cities
    .filter((city) => city.stateSlug === stateSlug)
    .sort((a, b) => b.population - a.population)
}

export function topCities(limit: number) {
  return [...cities].sort((a, b) => b.population - a.population).slice(0, limit)
}

const EARTH_RADIUS_MILES = 3959

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

export function distanceMiles(a: CityEntry, b: CityEntry) {
  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h))
}

export function nearbyCities(city: CityEntry, count = 8) {
  return cities
    .filter((other) => other !== city)
    .map((other) => ({ city: other, distance: distanceMiles(city, other) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map((entry) => entry.city)
}

export function statesByRegion() {
  const regions: Region[] = ["Northeast", "Midwest", "South", "West"]
  return regions
    .map((region) => ({
      region,
      states: states
        .filter((state) => state.region === region)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((group) => group.states.length > 0)
}
