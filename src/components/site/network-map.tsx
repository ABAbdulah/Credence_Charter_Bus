import { networkDescription, networkSummary } from "@/data/network"

function NetworkMap() {
  return (
    <figure className="mt-10">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Chrome does not pass prefers-reduced-motion into an <img>-embedded SVG,
            so the still map is swapped in by <picture>, which the page does evaluate.
            next/image cannot optimize SVG, and the map must stay vector for sharp labels. */}
        <picture>
          <source
            srcSet="/brand/network-map-still.svg"
            media="(prefers-reduced-motion: reduce)"
          />
          <img
            src="/brand/network-map.svg"
            alt={networkDescription}
            width={networkSummary.view.width}
            height={networkSummary.view.height}
            fetchPriority="high"
            className="h-auto w-full p-3 sm:p-5"
          />
        </picture>
        <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <ul className="flex flex-col gap-3 sm:flex-row sm:gap-7">
            <li className="flex items-center gap-2.5 text-sm">
              <span
                aria-hidden="true"
                className="size-4 shrink-0 rounded-full border-2 border-card bg-map-company ring-1 ring-map-company/40"
              />
              <span className="font-semibold text-foreground">
                Company-owned operations hub
              </span>
            </li>
            <li className="flex items-center gap-2.5 text-sm">
              <span
                aria-hidden="true"
                className="size-4 shrink-0 rounded-full border-2 border-card bg-accent ring-1 ring-accent-deep/40"
              />
              <span className="font-semibold text-foreground">
                Partner operations hub
              </span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground sm:max-w-md sm:text-right">
            Shaded areas show where each hub picks up and drops off. They overlap,
            so most routes are covered by more than one hub.
          </p>
        </div>
      </div>
      <figcaption className="mt-4 text-sm text-muted-foreground">
        Service areas are approximate. Hubs are grouped from the{" "}
        {networkSummary.cities.toLocaleString("en-US")} cities in our service
        directory —{" "}
        {Math.round((networkSummary.coveredCities / networkSummary.cities) * 100)}%
        of them sit within {networkSummary.coverageRadiusMiles} miles of a hub, and
        we arrange charters to the rest on request.
      </figcaption>
    </figure>
  )
}

export { NetworkMap }
