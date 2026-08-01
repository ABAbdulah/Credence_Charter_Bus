import Link from "next/link"

import {
  citiesOfState,
  locationsBuildConfig,
  type StateEntry,
} from "@/data/locations"
import { cn } from "@/lib/utils"

const pageLinkClass =
  "flex min-h-11 min-w-11 items-center justify-center rounded-md px-3 font-medium transition-colors duration-150"

function statePageHref(stateSlug: string, page: number) {
  return page === 1
    ? `/locations/${stateSlug}`
    : `/locations/${stateSlug}/cities/${page}`
}

function StateCities({ state, page }: { state: StateEntry; page: number }) {
  const all = citiesOfState(state.slug)
  const { stateCityPageSize } = locationsBuildConfig
  const totalPages = Math.max(1, Math.ceil(all.length / stateCityPageSize))
  const current = Math.min(Math.max(page, 1), totalPages)
  const slice = all.slice(
    (current - 1) * stateCityPageSize,
    current * stateCityPageSize
  )

  return (
    <>
      <h2 className="mt-10 text-2xl font-semibold text-primary">
        Cities we serve in {state.name}
      </h2>
      <p className="mt-3 text-muted-foreground">
        All {all.length.toLocaleString("en-US")} {state.name}{" "}
        {all.length === 1 ? "community" : "communities"}, largest first
        {totalPages > 1 ? ` — page ${current} of ${totalPages}` : ""}.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {slice.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/locations/${state.slug}/${city.slug}`}
              className="flex min-h-11 items-center rounded-md px-3 font-medium text-primary hover:bg-muted hover:underline"
            >
              Charter buses in {city.name}
            </Link>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <nav
          aria-label={`${state.name} city list pages`}
          className="mt-8 flex flex-wrap items-center gap-2"
        >
          {current > 1 && (
            <Link
              href={statePageHref(state.slug, current - 1)}
              rel="prev"
              className={cn(pageLinkClass, "text-primary hover:bg-muted")}
            >
              ← Previous
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (number) =>
              number === current ? (
                <span
                  key={number}
                  aria-current="page"
                  className={cn(
                    pageLinkClass,
                    "bg-primary text-primary-foreground"
                  )}
                >
                  {number}
                </span>
              ) : (
                <Link
                  key={number}
                  href={statePageHref(state.slug, number)}
                  aria-label={`Page ${number}`}
                  className={cn(
                    pageLinkClass,
                    "text-primary ring-1 ring-border hover:bg-muted"
                  )}
                >
                  {number}
                </Link>
              )
          )}
          {current < totalPages && (
            <Link
              href={statePageHref(state.slug, current + 1)}
              rel="next"
              className={cn(pageLinkClass, "text-primary hover:bg-muted")}
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </>
  )
}

export { StateCities, statePageHref }
