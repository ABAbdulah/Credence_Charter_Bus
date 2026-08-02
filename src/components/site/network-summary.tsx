import { Route, ShieldCheck, Timer, Wrench } from "lucide-react"

import { networkSummary } from "@/data/network"

const stats = [
  { value: networkSummary.company, label: "Company-owned operations hubs" },
  { value: networkSummary.partner, label: "Partner operations hubs" },
  { value: networkSummary.hubs, label: "Total hubs nationwide" },
  { value: networkSummary.states - 1, label: "States covered, plus Washington DC" },
]

const strengths = [
  {
    icon: Route,
    title: "Positioned on the corridors",
    body: "Hubs sit near interstates and freight corridors, so a coach reaches your pickup without a long deadhead run.",
  },
  {
    icon: Timer,
    title: "Shorter response times",
    body: "Overlapping service areas mean more than one hub can cover most trips, which keeps availability high on busy dates.",
  },
  {
    icon: Wrench,
    title: "Maintenance where it matters",
    body: "Company hubs handle inspection, fueling, and servicing so vehicles are checked close to where they run.",
  },
  {
    icon: ShieldCheck,
    title: "One standard everywhere",
    body: "Partner hubs extend the same vetting, licensing, and insurance requirements we hold our own fleet to.",
  },
]

function NetworkSummary() {
  return (
    <div className="mt-12">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 rounded-xl border border-border bg-card px-6 py-8 text-center shadow-sm md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="font-heading text-3xl font-bold text-primary sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <h2 className="mt-12 text-2xl font-bold text-primary sm:text-3xl">
        Built for efficiency, driven by service
      </h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {strengths.map((strength) => (
          <li
            key={strength.title}
            className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <strength.icon
              aria-hidden="true"
              className="mt-0.5 size-6 shrink-0 text-accent-deep"
              strokeWidth={1.75}
            />
            <div>
              <h3 className="font-heading text-base font-bold text-primary">
                {strength.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{strength.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { NetworkSummary }
