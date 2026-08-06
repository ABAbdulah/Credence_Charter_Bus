import type { Service } from "@/data/services"
import { ServiceCard } from "@/components/site/service-card"

function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </div>
  )
}

export { ServiceGrid }
