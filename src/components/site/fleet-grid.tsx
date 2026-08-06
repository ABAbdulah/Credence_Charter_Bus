import type { FleetCategory } from "@/data/fleet"
import { FleetCard } from "@/components/site/fleet-card"

function FleetGrid({ categories }: { categories: FleetCategory[] }) {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <FleetCard key={category.slug} category={category} />
      ))}
    </div>
  )
}

export { FleetGrid }
