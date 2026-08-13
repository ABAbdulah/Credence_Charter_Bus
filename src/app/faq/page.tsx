import { faqCategories, faqItems } from "@/data/faq";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/site/cta-band";

export const metadata = pageMetadata({
  title: "Charter Bus Rental FAQs",
  description:
    "Booking windows, charter bus pricing, drivers, cancellations, and accessibility — answers to the questions groups ask most.",
  path: "/faq",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <Section>
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="FAQ"
            title="Answers before you ask"
            lede="Everything is written out below — no clicking to reveal. If your question isn't here, call us and a person will answer."
          />
          <div className="mt-10 flex max-w-3xl flex-col gap-14">
            {faqCategories.map((category) => (
              <section key={category} aria-label={category}>
                <h2 className="text-2xl">{category}</h2>
                <dl className="mt-6 flex flex-col gap-8 border-l-2 border-accent/40 pl-5">
                  {faqItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <div key={item.question}>
                        <dt className="font-heading text-xl font-semibold text-primary">
                          {item.question}
                        </dt>
                        <dd className="mt-3">{item.answer}</dd>
                      </div>
                    ))}
                </dl>
              </section>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand
        title="Still have a question?"
        lede="Call us — a coordinator will answer it and can price your trip on the same call."
      />
    </>
  );
}
