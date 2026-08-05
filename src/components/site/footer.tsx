import Link from "next/link"

import { mainNav } from "@/config/nav"
import { siteConfig } from "@/config/site"
import { Container } from "@/components/ui/container"
import { Logo } from "@/components/site/logo"
import { NewsletterForm } from "@/components/site/newsletter-form"

const footerLinkClass =
  "flex min-h-11 items-center text-primary-foreground/85 underline-offset-4 hover:text-primary-foreground hover:underline"

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
]

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div className="flex flex-col items-start gap-4">
          <Link href="/">
            <Logo tone="light" />
          </Link>
          <p className="max-w-xs text-primary-foreground/85">
            Charter buses, mini buses, and vans for groups of every size —
            serving all 50 states since {siteConfig.established}.
          </p>
          <div className="mt-2 w-full max-w-sm">
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-accent">
              Newsletter
            </h2>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-accent">
            Explore
          </h2>
          <ul className="mt-3 flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLinkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/faq" className={footerLinkClass}>
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/quote" className={footerLinkClass}>
                Get a Free Quote
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-accent">
            Contact
          </h2>
          <ul className="mt-3 flex flex-col">
            <li>
              <a
                href={`tel:${siteConfig.phone.tel}`}
                className={`${footerLinkClass} font-heading text-xl font-bold`}
              >
                {siteConfig.phone.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className={footerLinkClass}>
                {siteConfig.email}
              </a>
            </li>
            <li className="mt-2 text-primary-foreground/85">
              {siteConfig.address.street}
              <br />
              {siteConfig.address.city}, {siteConfig.address.state}{" "}
              {siteConfig.address.zip}
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-primary-foreground/15">
        <Container className="flex flex-col gap-2 py-6 text-sm text-primary-foreground/70">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
            <ul className="flex flex-wrap gap-x-6">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-11 items-center underline-offset-4 hover:text-primary-foreground hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p>
            {siteConfig.tagline} · City data ©{" "}
            <a
              href="https://www.geonames.org/"
              rel="noopener"
              className="underline underline-offset-4 hover:text-primary-foreground"
            >
              GeoNames
            </a>
            ,{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              rel="noopener"
              className="underline underline-offset-4 hover:text-primary-foreground"
            >
              CC BY 4.0
            </a>
          </p>
        </Container>
      </div>
    </footer>
  )
}

export { Footer }
