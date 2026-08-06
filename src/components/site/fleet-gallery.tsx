"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { FleetImage } from "@/data/fleet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const frameClass = "aspect-2/1 w-full object-cover"

function FleetGallery({
  images,
  label,
}: {
  images: FleetImage[]
  label: string
}) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [index, setIndex] = React.useState(0)

  function goTo(next: number) {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    track.scrollTo({
      left: track.clientWidth * next,
      behavior: reduced ? "auto" : "smooth",
    })
  }

  function handleScroll() {
    const track = trackRef.current
    if (!track) return
    setIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const step = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0
    if (step === 0) return
    const next = index + step
    if (next < 0 || next > images.length - 1) return
    event.preventDefault()
    goTo(next)
  }

  if (images.length < 2) {
    return (
      <Image
        src={images[0].src}
        alt={images[0].alt}
        width={1600}
        height={800}
        priority
        sizes="(min-width: 1200px) 1200px, 100vw"
        className={cn(frameClass, "rounded-xl ring-1 ring-foreground/10")}
      />
    )
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${label} photos`}
      onKeyDown={handleKeyDown}
    >
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-xl ring-1 ring-foreground/10 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, position) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={1600}
              height={800}
              priority={position === 0}
              sizes="(min-width: 1200px) 1200px, 100vw"
              className={cn(frameClass, "shrink-0 snap-center")}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous photo"
            className="pointer-events-auto rounded-full shadow-md"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goTo(index + 1)}
            disabled={index === images.length - 1}
            aria-label="Next photo"
            className="pointer-events-auto rounded-full shadow-md"
          >
            <ChevronRight />
          </Button>
        </div>
        <p className="absolute bottom-3 left-3 rounded-full bg-foreground/80 px-3 py-1 text-sm font-semibold text-background">
          {index + 1} / {images.length}
        </p>
      </div>
      <p aria-live="polite" className="sr-only">
        Photo {index + 1} of {images.length}: {images[index].alt}
      </p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {images.map((image, position) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => goTo(position)}
              aria-label={`Show photo ${position + 1}`}
              aria-current={position === index}
              className={cn(
                "block overflow-hidden rounded-lg ring-1 ring-foreground/10 transition-opacity duration-150 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary",
                position === index
                  ? "ring-2 ring-accent-deep ring-offset-2 ring-offset-background"
                  : "opacity-65 hover:opacity-100"
              )}
            >
              <Image
                src={image.src}
                alt=""
                width={320}
                height={160}
                sizes="160px"
                className="aspect-2/1 w-20 object-cover sm:w-28"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { FleetGallery }
