"use client"

import * as React from "react"
import Image from "next/image"

import { siteConfig } from "@/config/site"

const fallbackImage = {
  src: "/fleet/charter-bus-exterior.png",
  alt: "Credence charter bus ready for boarding",
}

function HeroMedia() {
  const { mediaType, mediaSrc } = siteConfig.hero
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.play().catch(() => undefined)
    }
  }, [])

  const frameClass =
    "aspect-[3/2] w-full rounded-xl object-cover ring-1 ring-primary-foreground/20 shadow-lg"

  if (mediaType === "video" && mediaSrc) {
    return (
      <video
        ref={videoRef}
        src={mediaSrc}
        muted
        loop
        playsInline
        preload="metadata"
        className={frameClass}
      />
    )
  }

  const image = mediaSrc ? { src: mediaSrc, alt: fallbackImage.alt } : fallbackImage

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={1602}
      height={982}
      priority
      sizes="(min-width: 1024px) 50vw, 100vw"
      className={frameClass}
    />
  )
}

export { HeroMedia }
