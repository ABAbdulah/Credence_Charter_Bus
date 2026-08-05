export type NavChild = { label: string; href: string }

export type NavItem = {
  label: string
  href: string
  children?: NavChild[]
}

/**
 * Children are hand-listed rather than derived from the fleet/services data
 * files so the header — on every page — doesn't pull those modules' full
 * descriptions into the shared client bundle. Update here when a fleet
 * category or service is added.
 */
export const mainNav: NavItem[] = [
  {
    label: "Fleet",
    href: "/fleet",
    children: [
      { label: "All Fleet Vehicles", href: "/fleet" },
      { label: "Charter Buses", href: "/fleet/charter-buses" },
      { label: "Motor Coaches", href: "/fleet/motor-coaches" },
      { label: "Coach Buses", href: "/fleet/coach-buses" },
      { label: "Mini Buses", href: "/fleet/mini-buses" },
      { label: "Sprinter Vans", href: "/fleet/sprinter-vans" },
      { label: "School Buses", href: "/fleet/school-buses" },
      { label: "Party Buses", href: "/fleet/party-buses" },
      { label: "Limousines", href: "/fleet/limousines" },
      { label: "SUVs", href: "/fleet/suvs" },
      { label: "Sedans", href: "/fleet/sedans" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All Services", href: "/services" },
      { label: "Corporate Travel", href: "/services/corporate-travel" },
      { label: "Event Transportation", href: "/services/event-transportation" },
      { label: "Airport Transfers", href: "/services/airport-transfers" },
      { label: "Sports Team Travel", href: "/services/sports-team-travel" },
      {
        label: "Wedding & Celebrations",
        href: "/services/wedding-transportation",
      },
      { label: "School Trips", href: "/services/school-trips" },
      { label: "City Tours", href: "/services/city-tours" },
      {
        label: "Long-Distance Charter",
        href: "/services/long-distance-charter",
      },
    ],
  },
  { label: "Locations", href: "/locations" },
  { label: "Blog", href: "/blogs" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "How Booking Works", href: "/how-to-book" },
      { label: "FAQ", href: "/faq" },
      { label: "Drive With Us", href: "/drivers" },
      { label: "Affiliate Program", href: "/affiliates" },
    ],
  },
  { label: "Contact", href: "/contact" },
]
