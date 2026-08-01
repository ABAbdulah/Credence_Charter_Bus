import Image from "next/image"

import { siteConfig } from "@/config/site"
import { HeroVideo } from "@/components/site/hero-video"

const frameClass =
  "aspect-3/2 w-full rounded-xl object-cover ring-1 ring-primary-foreground/20 shadow-lg"

const fallbackImage = {
  src: "/fleet/charter-bus-exterior.png",
  alt: "Credence charter bus ready for boarding",
}

function HeroMedia() {
  const { mediaType, mediaSrc } = siteConfig.hero

  if (mediaType === "video" && mediaSrc) {
    return <HeroVideo src={mediaSrc} className={frameClass} />
  }

  const image = mediaSrc ? { src: mediaSrc, alt: fallbackImage.alt } : fallbackImage

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={1602}
      height={982}
      priority
      quality={50}
      sizes="(min-width: 1024px) 50vw, calc(100vw - 2rem)"
      className={frameClass}
    />
  )
}

export { HeroMedia }
