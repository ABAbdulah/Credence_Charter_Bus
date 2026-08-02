import Link from "next/link"
import { ChevronDown } from "lucide-react"

import { BLOG_REGIONS, blogStates } from "@/data/blogs"
import { cn } from "@/lib/utils"

const stateLinkClass =
  "flex min-h-11 items-center justify-between gap-3 rounded-md px-3 transition-colors duration-150"

function BlogStateFilter({ activeSlug }: { activeSlug?: string }) {
  const states = blogStates()
  if (states.length === 0) return null

  const active = activeSlug ? states.find((state) => state.slug === activeSlug) : undefined
  const totalPosts = states.reduce((total, state) => total + state.posts.length, 0)

  return (
    <details className="group mt-8 rounded-xl bg-card ring-1 ring-border">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 [&::-webkit-details-marker]:hidden">
        <span className="font-medium text-primary">
          {active ? `Showing ${active.name} guides` : "Browse guides by state"}
          <span className="ml-2 font-normal text-muted-foreground">
            {totalPosts} guides across {states.length} states
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-5 shrink-0 text-primary transition-transform duration-150 group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-border px-5 py-5">
        {active && (
          <Link
            href="/blogs"
            className="mb-4 flex min-h-11 w-fit items-center rounded-md px-3 font-medium text-primary ring-1 ring-border hover:bg-muted"
          >
            ← Show all {totalPosts} guides
          </Link>
        )}
        <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {BLOG_REGIONS.map((region) => {
            const group = states.filter((state) => state.region === region)
            if (group.length === 0) return null
            return (
              <div key={region}>
                <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-accent-deep">
                  {region}
                </h3>
                <ul className="mt-2 flex flex-col">
                  {group.map((state) => {
                    const isActive = state.slug === activeSlug
                    return (
                      <li key={state.slug}>
                        <Link
                          href={`/blogs/state/${state.slug}`}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            stateLinkClass,
                            isActive
                              ? "bg-primary font-medium text-primary-foreground"
                              : "text-primary hover:bg-muted",
                          )}
                        >
                          <span>{state.name}</span>
                          <span className={cn("text-sm", isActive ? "opacity-70" : "text-muted-foreground")}>
                            {state.posts.length}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </details>
  )
}

export { BlogStateFilter }
