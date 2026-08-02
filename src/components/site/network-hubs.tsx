import Link from "next/link"

import { hubsByRegion } from "@/data/network"

function NetworkHubs() {
  return (
    <div className="mt-10 grid gap-8 md:grid-cols-2">
      {hubsByRegion().map((group) => (
        <div key={group.region}>
          <h3 className="font-heading text-lg font-bold text-primary">
            {group.region}
            <span className="ml-2 text-sm font-semibold text-muted-foreground">
              {group.hubs.length} hubs ·{" "}
              {group.hubs
                .reduce((total, hub) => total + hub.cities, 0)
                .toLocaleString("en-US")}{" "}
              cities
            </span>
          </h3>
          <ul className="mt-3 columns-2 gap-6 text-sm">
            {group.hubs.map((hub) => (
              <li key={hub.id} className="break-inside-avoid py-1">
                <Link
                  href={`/locations/${hub.stateSlug}/${hub.citySlug}`}
                  className="flex items-baseline gap-1.5 text-foreground hover:text-primary hover:underline"
                >
                  <span
                    aria-hidden="true"
                    className={`size-2 shrink-0 self-center rounded-full ${
                      hub.type === "company" ? "bg-map-company" : "bg-accent"
                    }`}
                  />
                  {hub.name}
                  <span className="text-xs text-muted-foreground">
                    {hub.stateAbbr}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export { NetworkHubs }
