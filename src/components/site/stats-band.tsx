import { siteConfig } from "@/config/site"
import { Container } from "@/components/ui/container"

const stats = [
  { value: siteConfig.stats.milesDriven, label: "Miles driven" },
  { value: siteConfig.stats.buses, label: "Vehicles in network" },
  { value: siteConfig.stats.cities, label: "Cities served" },
  { value: siteConfig.stats.happyCustomers, label: "Happy customers" },
]

function StatsBand() {
  return (
    <section aria-label="Company statistics" className="bg-primary">
      <Container className="grid grid-cols-2 gap-8 py-12 text-center md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-heading text-3xl font-bold text-accent sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-primary-foreground/85">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  )
}

export { StatsBand }
