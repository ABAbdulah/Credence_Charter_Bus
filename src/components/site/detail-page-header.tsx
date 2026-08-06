import { BackLink } from "@/components/site/back-link"
import { SectionHeading } from "@/components/ui/section"

function DetailPageHeader({
  backHref,
  backLabel,
  eyebrow,
  title,
  lede,
}: {
  backHref: string
  backLabel: string
  eyebrow: string
  title: string
  lede: string
}) {
  return (
    <>
      <BackLink href={backHref}>{backLabel}</BackLink>
      <SectionHeading
        as="h1"
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        className="mt-6"
      />
    </>
  )
}

export { DetailPageHeader }
