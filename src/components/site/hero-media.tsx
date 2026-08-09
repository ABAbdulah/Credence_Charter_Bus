import Image from "next/image"

import { siteConfig } from "@/config/site"
import { HeroVideo } from "@/components/site/hero-video"

const fallbackImage = "/fleet/charter-bus-exterior.webp"

/** Must match the animation-duration of .hero-slide in globals.css. */
const HERO_SLIDESHOW_DURATION_S = 36

/**
 * Server component on purpose — moving the image into the client half costs
 * roughly two Lighthouse performance points on the home page.
 */
function HeroMedia() {
  const { mediaType, mediaSrc, slideshowImages } = siteConfig.hero

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {mediaType === "video" && mediaSrc ? (
        <HeroVideo src={mediaSrc} className="size-full object-cover" />
      ) : slideshowImages.length > 1 ? (
        slideshowImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={index === 0}
            quality={50}
            sizes="100vw"
            className="hero-slide object-cover object-center"
            style={{
              opacity: index === 0 ? 1 : 0,
              animationDelay:
                index === 0
                  ? undefined
                  : `${(index * HERO_SLIDESHOW_DURATION_S) / slideshowImages.length - HERO_SLIDESHOW_DURATION_S}s`,
            }}
          />
        ))
      ) : (
        <Image
          src={mediaSrc || fallbackImage}
          alt=""
          fill
          priority
          quality={50}
          sizes="100vw"
          className="object-cover object-center"
        />
      )}
      <div className="absolute inset-0 bg-primary/88 lg:hidden" />
      <div className="absolute inset-0 hidden bg-linear-to-r from-primary/96 via-primary/92 via-65% to-primary/40 lg:block" />
    </div>
  )
}

export { HeroMedia }
