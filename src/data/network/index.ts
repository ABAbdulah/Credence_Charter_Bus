import networkMap from "./network-map.json"

export type HubType = "company" | "partner"

export type NetworkHub = {
  id: string
  name: string
  citySlug: string
  stateSlug: string
  stateName: string
  stateAbbr: string
  region: "Northeast" | "Midwest" | "South" | "West"
  type: HubType
  cities: number
}

export const networkHubs = networkMap.hubs as NetworkHub[]
export const networkSummary = networkMap.summary
export const networkDescription = networkMap.description

export function hubsByRegion() {
  const regions = ["Northeast", "Midwest", "South", "West"] as const
  return regions.map((region) => ({
    region,
    hubs: networkHubs
      .filter((hub) => hub.region === region)
      .sort((a, b) => a.name.localeCompare(b.name)),
  }))
}
