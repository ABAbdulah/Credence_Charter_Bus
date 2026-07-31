import Link from "next/link"
import { Phone } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"

function CallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-3 border-t bg-card p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
      <Button asChild variant="accent" size="lg">
        <a href={`tel:${siteConfig.phone.tel}`}>
          <Phone />
          Call Now
        </a>
      </Button>
      <Button asChild size="lg">
        <Link href="/quote">Get a Free Quote</Link>
      </Button>
    </div>
  )
}

export { CallBar }
