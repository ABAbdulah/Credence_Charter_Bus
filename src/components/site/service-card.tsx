import Link from "next/link"
import {
  Briefcase,
  CalendarDays,
  GraduationCap,
  Heart,
  Plane,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import type { Service } from "@/data/services"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const serviceIcons: Record<string, LucideIcon> = {
  "corporate-travel": Briefcase,
  "event-transportation": CalendarDays,
  "airport-transfers": Plane,
  "sports-team-travel": Trophy,
  "wedding-transportation": Heart,
  "school-trips": GraduationCap,
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = serviceIcons[service.slug] ?? CalendarDays
  return (
    <Card className="h-full">
      <CardHeader>
        <span
          aria-hidden="true"
          className="mb-2 flex size-12 items-center justify-center rounded-full bg-secondary text-primary"
        >
          <Icon className="size-6" />
        </span>
        <CardTitle>{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p>{service.short}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link href={`/services/${service.slug}`}>About {service.name}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export { ServiceCard }
