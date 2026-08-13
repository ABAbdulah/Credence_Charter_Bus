import { breadcrumbJsonLd, JsonLd, webPageJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { CheckList } from "@/components/ui/check-list";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { QuoteForm } from "@/components/site/quote-form";

export const metadata = pageMetadata({
  title: "Get a Free Charter Bus Quote",
  description:
    "Request a free charter bus rental quote — group size, dates, and route are all we need. Clear, itemized pricing, usually the same day.",
  path: "/quote",
});

const reassurances = [
  "Free and no-obligation — compare us with anyone",
  "All-in pricing: driver, fuel, tolls, and taxes included",
  "A response within one business day, usually sooner",
];

export default function QuotePage() {
  return (
    <Section>
      <JsonLd
        data={webPageJsonLd({
          name: "Get a Free Charter Bus Quote",
          description:
            "Request a free charter bus rental quote — group size, dates, and route are all we need. Clear, itemized pricing, usually the same day.",
          path: "/quote",
          breadcrumbPath: "/quote",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Get a Quote", path: "/quote" },
        ])}
      />
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Free quote"
          title="Tell us about your trip"
          lede="A few details are all we need. A real coordinator reads every request and replies with an itemized quote."
        />
        <CheckList
          items={reassurances}
          className="mt-6 flex max-w-2xl flex-col gap-2"
        />
        <div className="mt-10 max-w-3xl">
          <QuoteForm />
        </div>
      </Container>
    </Section>
  );
}
