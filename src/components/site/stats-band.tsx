import { siteConfig } from "@/config/site"
import { Container } from "@/components/ui/container"

const stats = [
  { value: siteConfig.stats.yearsInBusiness, label: "Years in business" },
  { value: siteConfig.stats.passengersTransported, label: "Passengers transported" },
  { value: siteConfig.stats.citiesServed, label: "Cities served" },
  { value: siteConfig.stats.milesTraveled, label: "Miles traveled" },
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
