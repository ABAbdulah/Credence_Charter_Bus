import { getLegalDocument } from "@/data/legal"
import { pageMetadata } from "@/lib/seo"
import { LegalPage, fillLegalTokens } from "@/components/site/legal-page"

const doc = getLegalDocument("privacy")!

export const metadata = pageMetadata({
  title: doc.title,
  description: fillLegalTokens(doc.description),
  path: "/privacy",
})

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />
}
