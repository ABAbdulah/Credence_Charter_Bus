import { siteConfig } from "@/config/site"
import { getLegalDocument, type LegalBlock } from "@/data/legal"
import { Container } from "@/components/ui/container"
import { Section, SectionHeading } from "@/components/ui/section"

export function fillLegalTokens(text: string) {
  return text
    .replaceAll("{legalName}", siteConfig.legalName)
    .replaceAll("{company}", siteConfig.name)
    .replaceAll("{email}", siteConfig.email)
    .replaceAll("{phone}", siteConfig.phone.display)
    .replaceAll("{domain}", siteConfig.url.replace(/^https?:\/\/(www\.)?/, ""))
}

function LegalBlockView({ block }: { block: LegalBlock }) {
  if (block.type === "ul") {
    return (
      <ul className="list-disc space-y-2 pl-6">
        {block.items.map((item) => (
          <li key={item}>{fillLegalTokens(item)}</li>
        ))}
      </ul>
    )
  }
  if (block.type === "h2") {
    return <h2 className="pt-4 text-2xl">{fillLegalTokens(block.text)}</h2>
  }
  if (block.type === "h3") {
    return <h3 className="pt-2 text-xl">{fillLegalTokens(block.text)}</h3>
  }
  return <p>{fillLegalTokens(block.text)}</p>
}

function LegalPage({ slug }: { slug: string }) {
  const doc = getLegalDocument(slug)
  if (!doc) return null
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            as="h1"
            eyebrow="Legal"
            title={doc.title}
            lede={`Last updated: ${doc.updated}`}
          />
          <div className="mt-10 space-y-5">
            {doc.blocks.map((block, index) => (
              <LegalBlockView key={index} block={block} />
            ))}
          </div>
          <div className="mt-12 rounded-xl bg-secondary p-6">
            <h2 className="text-xl">Questions about this policy?</h2>
            <p className="mt-2">
              Call{" "}
              <a
                href={`tel:${siteConfig.phone.tel}`}
                className="font-semibold text-primary underline underline-offset-4"
              >
                {siteConfig.phone.display}
              </a>{" "}
              or email{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-semibold text-primary underline underline-offset-4"
              >
                {siteConfig.email}
              </a>{" "}
              and our team will walk you through it.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export { LegalPage }
