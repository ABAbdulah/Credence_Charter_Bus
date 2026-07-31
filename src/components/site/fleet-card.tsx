import Image from "next/image"
import Link from "next/link"

import type { FleetCategory } from "@/data/fleet"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function FleetCard({ category }: { category: FleetCategory }) {
  return (
    <Card className="h-full">
      <Image
        src={category.images.exterior.src}
        alt={category.images.exterior.alt}
        width={1602}
        height={982}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-[3/2] w-full object-cover"
      />
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <CardDescription>{category.capacity}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p>{category.short}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link href={`/fleet/${category.slug}`}>View {category.name}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export { FleetCard }
