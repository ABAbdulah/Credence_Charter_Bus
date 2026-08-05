import { getLegalDocument } from "@/data/legal"
import { pageMetadata } from "@/lib/seo"
import { LegalPage, fillLegalTokens } from "@/components/site/legal-page"

const doc = getLegalDocument("refund")!

export const metadata = pageMetadata({
  title: doc.title,
  description: fillLegalTokens(doc.description),
  path: "/refund",
})

export default function RefundPage() {
  return <LegalPage slug="refund" />
}
