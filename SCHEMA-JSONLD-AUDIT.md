# Schema.org / JSON-LD Structured Data Audit — Credence Charter Bus

**Audited:** 13 Aug 2026
**Scope:** Every route template in `src/app/**/page.tsx` (22 templates, covering ~16,700 rendered pages: home, fleet ×10, services ×9, about, contact, FAQ, quote, drivers, affiliates, how-to-book, blogs ×193 + index/pagination/state archives, locations ×16,399 cities + 51 states + pagination, legal ×3) plus the shared structured-data library `src/lib/jsonld.tsx` and root layout `src/app/layout.tsx`.
**Method:** Direct code read of every template and the shared JSON-LD/metadata libraries — no assumptions from documentation. Every figure in this report (fleet/service counts, FAQ item count, city/state/blog counts, image dimensions, data field names) was verified against the live source files, not carried over from prior notes.

> **Hard constraint honored throughout:** where a fix would require business information this codebase cannot verify (opening hours, whether the registered address is a walk-in office, a fixed price), this report flags it for owner sign-off instead of inventing a value. See [Appendix A](#appendix-a--flagged-unverifiable-business-data).

---

## Implementation Status — 13 Aug 2026

**All 18 actionable findings (everything except C-1) have been implemented, built, and verified against a live production server.** Verification method: `next build` (447 static pages, zero errors), full ESLint + `tsc --noEmit` pass on every touched file, then `next start` with every representative page fetched and its rendered `<script type="application/ld+json">` blocks parsed and cross-checked (types present, `@id` references resolve, `ItemList` counts match the real data, `GeoCoordinates` are real, the new logo asset serves 200).

| ID | Status |
|---|---|
| C-1 (`LocalBusiness` vs `Organization`) | 🟡 **Still open** — left as `LocalBusiness` (no regression from what was live). Needs the owner's answer on whether the registered address is customer-visitable; see Appendix A. |
| H-1 through H-6 | ✅ Fixed |
| M-1 | ℹ️ No code change (informational finding) |
| M-2 through M-8 | ✅ Fixed |
| L-1 | ⏭️ Skipped by design — see finding text (Google discontinued the HowTo rich result; no SERP benefit) |
| L-2, L-3 | ✅ Fixed |
| L-4 | ℹ️ No code change (informational finding — pages are already `noindex`) |

See `CLAUDE.md`'s "Structured data / JSON-LD" section for the maintained summary of what shipped.

---

## 1. Executive Summary

The site already has a real structured-data foundation — a shared `JsonLd` component, a single canonical `organizationJsonLd` node rendered once site-wide, and reusable builders (`breadcrumbJsonLd`, `serviceJsonLd`, `blogJsonLd`, `itemListJsonLd`) that 10 of the 22 route templates already call correctly, including proper `@id` cross-referencing between the site-wide Organization and per-page entities. That cross-referencing pattern (a script in the root layout defining `LocalBusiness` once, and per-page scripts pointing back to it with `{"@id": organizationId}`) is done correctly and is worth preserving as-is — it is the single biggest thing this audit is **not** flagging.

Against that foundation, the audit found **19 issues**: 1 Critical needing an owner decision before any code ships, 6 High-impact gaps (including the home page shipping with zero page-level structured data, and the two primary index pages — `/fleet` and `/locations` — shipping with none at all), 8 Medium-impact gaps, and 4 Low-impact/optional refinements. No duplicated or conflicting entities were found. No invalid syntax was found in the JSON-LD that does exist.

Just as important: this report explicitly recommends **against** adding several schema types the page content does not support — `Product`/`Offer` (the business has no fixed, publishable prices), `JobPosting` on `/drivers` (an evergreen recruiting page, not a compliant single listing), `Person` (no page attributes content to a named individual), and `AggregateRating`/`Review` (the owner has explicitly banned testimonials and no real ratings exist to encode). Adding any of these would risk a Google Search Console manual action for structured-data spam, not just a wasted effort.

---

## 2. Current Architecture (what's already correct)

| Element | Location | Status |
|---|---|---|
| `JsonLd` render helper (`<script type="application/ld+json">`, XSS-safe `<` escaping) | `src/lib/jsonld.tsx:3-12` | ✅ Correct |
| `organizationJsonLd` (`LocalBusiness`, `@id`-addressable) | `src/lib/jsonld.tsx:16-36`, rendered once in `src/app/layout.tsx:35` | ✅ Present, but see Finding C-1 and H-1 |
| `breadcrumbJsonLd()` builder | `src/lib/jsonld.tsx:38-49` | ✅ Correct, used on 8 of 22 templates |
| `blogJsonLd()` / `itemListJsonLd()` / `serviceJsonLd()` builders | `src/lib/jsonld.tsx:51-113` | ✅ Correct where used |
| `BlogPosting` on every blog post, with real `ImageObject` dimensions, `wordCount`, `author`/`publisher`/`isPartOf` as `@id` references | `src/app/blogs/[slug]/page.tsx:115-139` | ✅ Best-implemented type on the site |
| `FAQPage` on `/faq`, correct `Question`/`acceptedAnswer` shape | `src/app/faq/page.tsx:15-23` | ✅ Structurally valid — see Finding M-1 for an eligibility caveat |
| `Service` on every fleet category, service detail, and city page | 3 templates | ✅ Correct type choice — see Findings for missing fields |
| Cross-document `@id` referencing (`{"@id": organizationId}` resolving against the layout's site-wide script) | Site-wide | ✅ Valid technique, confirmed correctly wired (the referenced node is present in the DOM on every page because it's in `layout.tsx`) |
| No fake per-city `LocalBusiness` nodes on the 16,399 location pages | `src/app/locations/[state]/[city]/page.tsx` | ✅ Correctly avoided — a `LocalBusiness` node per templated city page is a textbook structured-data spam pattern Google's guidelines explicitly call out; this site correctly uses `Service` + `areaServed` instead |
| No `AggregateRating`/`Review` anywhere in the codebase | Verified via full-source grep | ✅ Consistent with the owner's explicit "no reviews/testimonials" directive |
| No `sameAs` on the Organization node | `src/lib/jsonld.tsx:16-36` | ✅ Intentional — the owner removed all social links; do not re-add `sameAs` |

**10 of 22 templates emit JSON-LD today:** `layout.tsx` (site-wide), `fleet/[category]`, `services/[slug]`, `faq`, `blogs`, `blogs/[slug]`, `blogs/state/[state]`, `locations/[state]`, `locations/[state]/cities/[page]`, `locations/[state]/[city]`.

**12 templates emit none:** `page.tsx` (home), `fleet` (index), `services` (index), `about`, `contact`, `quote`, `drivers`, `affiliates`, `how-to-book`, `locations` (index), `blogs/page/[n]`, `privacy`/`terms`/`refund`.

---

## 3. Prioritized Findings

| ID | Severity | Page(s) affected | Issue |
|---|---|---|---|
| [C-1](#c-1) | 🔴 Critical | Site-wide (`Organization`/`LocalBusiness`) | `LocalBusiness` type choice is unverified against whether the registered address is a walk-in office |
| [H-1](#h-1) | 🟠 High | Site-wide (`Organization`) | No `logo` property — blocks Google's Logo/Knowledge Panel eligibility |
| [H-2](#h-2) | 🟠 High | Home (`/`) | Zero page-level structured data on the highest-authority page on the site |
| [H-3](#h-3) | 🟠 High | `/fleet` | Index page for all 9 vehicle types has no structured data at all |
| [H-4](#h-4) | 🟠 High | `/locations` | Index/hub page for the entire 16,399-city location engine has no structured data at all |
| [H-5](#h-5) | 🟠 High | `/services` | Index page for all 8 services has no structured data at all |
| [H-6](#h-6) | 🟠 High | Site-wide (`Organization`) | No `WebSite` entity — nothing on the site declares itself part of a site-level graph |
| [M-1](#m-1) | 🟡 Medium | `/faq` | `FAQPage` markup is structurally valid but Google restricted FAQ rich results to authoritative gov/health sites in Aug 2023 — flagged so the team doesn't over-index on it |
| [M-2](#m-2) | 🟡 Medium | `/faq` | No `BreadcrumbList` |
| [M-3](#m-3) | 🟡 Medium | `/about` | No `AboutPage`/`BreadcrumbList` despite being exactly the content type Schema.org's `AboutPage` models |
| [M-4](#m-4) | 🟡 Medium | `/contact` | No `ContactPage`, and the Organization node has no structured `ContactPoint` |
| [M-5](#m-5) | 🟡 Medium | 193 blog posts | `dateModified` is hardcoded equal to `datePublished` — there is no field to record a real edit date, which matters directly for the in-progress Phase 9 prose rewrite |
| [M-6](#m-6) | 🟡 Medium | `/quote`, `/drivers`, `/affiliates`, `/how-to-book` | No `WebPage`/`BreadcrumbList` on any of the four (each has real, substantive content — this is a plain gap, not a missing specialized type) |
| [M-7](#m-7) | 🟡 Medium | 16,399 city pages | `areaServed.City` doesn't carry `GeoCoordinates`, even though verified `lat`/`lng` already exist in the source data for every city |
| [M-8](#m-8) | 🟡 Medium | `/locations/[state]` | Has `BreadcrumbList` but no `ItemList` of the cities actually rendered on the page |
| [L-1](#l-1) | 🟢 Low | `/how-to-book` | Could carry `HowTo` markup, but Google discontinued the HowTo rich result in most locales — optional, no visible SERP benefit today |
| [L-2](#l-2) | 🟢 Low | `/privacy`, `/terms`, `/refund` | No generic `WebPage`/`BreadcrumbList` (cosmetic — no Schema.org type exists specifically for ToS/Privacy content) |
| [L-3](#l-3) | 🟢 Low | `src/lib/jsonld.tsx` `serviceJsonLd()` | No `@id` on `Service` nodes, so they can't be referenced from elsewhere (currently nothing needs to, but it's cheap to add) |
| [L-4](#l-4) | 🟢 Low | `/blogs/page/[n]`, `/locations/[state]/cities/[n]` | No structured data on paginated overflow pages — low priority because both are already `noindex` |

Do-not-add items (explicit anti-recommendations, not gaps) are covered separately in [Section 5](#5-what-not-to-add-and-why).

---

## 4. Detailed Findings, Impact, and Fixes

### C-1
**Site-wide — `LocalBusiness` type choice is unverified**

**What's wrong:** `organizationJsonLd` in `src/lib/jsonld.tsx:18` declares `"@type": "LocalBusiness"` and attaches the `siteConfig.address` (7901 4th St N, Ste 31686, St. Petersburg, FL) as that business's physical address. Google's structured data guidelines model `LocalBusiness` as a business with a **physical location customers visit** — a storefront, an office, a branch. This codebase has no way to confirm whether that St. Petersburg suite is a real, staffed, visitable office, or a registered-agent/virtual-mailbox address for a company that actually coordinates a nationwide network of drivers and vehicles with no walk-in location (the "Ste 31686" suite-number pattern is common for both, so the string alone doesn't resolve it).

**Why it matters:** If the address is not customer-visitable, `LocalBusiness` structured data is factually inaccurate — it tells Google's entity graph "customers can walk into this address for charter bus service," which is untrue for an appointment/dispatch-based nationwide operator. Best case, Google ignores the mismatch. Worst case, it associates the wrong entity type with local-pack/Maps signals, or the mismatch between the claimed local presence and actual nationwide service area suppresses rather than helps local relevance. This is exactly the class of business-fact assumption this audit was told not to fabricate.

**Fix — pick one, based on the real answer:**

*If the address is a real, visitable office* (customers or drivers can go there), keep `LocalBusiness` as-is — no change needed beyond the other findings in this report.

*If it is administrative/mailing-only*, switch the type and drop the physical-visit implication:

```ts
// src/lib/jsonld.tsx
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization", // was "LocalBusiness"
  "@id": organizationId,
  name: siteConfig.name,
  description: siteConfig.tagline,
  url: siteConfig.url,
  telephone: siteConfig.phone.tel,
  email: siteConfig.email,
  image: `${siteConfig.url}/fleet/charter-bus-exterior.webp`,
  // address stays — a registered/mailing address is still valid on Organization
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.state,
    postalCode: siteConfig.address.zip,
    addressCountry: "US",
  },
  areaServed: { "@type": "Country", name: "United States" },
  foundingDate: String(siteConfig.established),
}
```

**Pages affected:** every page (site-wide, root layout).
**Level:** template-level (`src/lib/jsonld.tsx`), one node.
**Do not ship either version without owner confirmation of which is true.**

---

### H-1
**Site-wide — Organization has no `logo`**

**What's wrong:** `organizationJsonLd` has `image` but no `logo`. These are different properties in Schema.org: `image` is a general representative photo (the site correctly uses a fleet exterior shot), `logo` is specifically the brand mark Google uses for the Knowledge Panel and the Logo rich result. It's currently absent entirely.

**Why it matters:** Without `logo`, the business is not eligible for Google's [Logo structured data](https://developers.google.com/search/docs/appearance/structured-data/logo) feature at all — no logo shows in the Knowledge Panel or brand search results, regardless of how good the actual artwork is.

**What's available, verified by reading the actual files:**
- `public/brand/logo-mark.png` — real, stable, statically-served file, confirmed **497×304px** (1.63:1, not square).
- `src/app/icon.png` — 512×512, square, generated by `scripts/prepare-logo.mjs` — but confirmed via the Next.js 16 docs (`node_modules/next/dist/docs/.../app-icons.md`) that this file convention is served at a **content-hashed route** (`/icon?<generated>`), not a stable `/icon.png` URL. Not safe to hardcode into JSON-LD, since the hash changes on every rebuild.

**Fix (ship now, zero new assets):**

```ts
// src/lib/jsonld.tsx — add one field to organizationJsonLd
logo: `${siteConfig.url}/brand/logo-mark.png`,
```

**Caveat to log, not fix silently:** Google's Logo guidelines prefer a roughly square image (their own example is 1:1, minimum 112×112px). At 497×304, `logo-mark.png` is valid schema but below-ideal for the Logo rich result specifically. `prepare-logo.mjs` already computes a square, navy-background version in-memory (the `squareIcon()` function, `scripts/prepare-logo.mjs:135-162`) for the two Next.js icon files — it just never writes a copy to a stable `public/` path. A one-line addition closes this gap properly:

```js
// scripts/prepare-logo.mjs — after the existing writeFileSync calls (~line 189)
writeFileSync(resolve(root, "public/brand/logo-square.png"), await squareIcon(mark, 512))
```

Then point `logo` at `/brand/logo-square.png` instead. This reuses logic that already exists and is already correct — no new visual design decision required, no fabricated asset.

**Pages affected:** site-wide.
**Level:** template-level (`src/lib/jsonld.tsx`) + one-line script change (optional, for the square variant).

---

### H-2
**Home page (`/`) — zero page-level structured data**

**What's wrong:** `src/app/page.tsx` renders `<Hero>`, featured fleet, services, how-it-works, stats, and blog previews — but the only structured data present anywhere on the rendered page is the site-wide `LocalBusiness` node from the root layout. There is no `WebPage` entity for the home page itself, and (see H-6) no `WebSite` entity for it to belong to.

**Why it matters:** The home page is the page most likely to be crawled first, linked from external sources, and used by Google to establish the site's primary entity graph. Leaving it with no page-level node means Google has no explicit `name`/`description`/`about` signal for the page beyond the `<title>`/meta description — a much weaker machine-readable signal than a `WebPage` node with `isPartOf`/`about` pointing at the `WebSite` and `Organization` entities.

**Fix:**

```tsx
// src/app/page.tsx
import { JsonLd, webPageJsonLd } from "@/lib/jsonld";
// ...
export default function Home() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: `${siteConfig.name} — ${siteConfig.tagline}`,
          description:
            "Charter bus, mini bus, and sprinter van rentals for groups of every size, serving all 50 states. Request a free quote or call to plan your trip.",
          path: "/",
        })}
      />
      <Hero />
      {/* ...unchanged... */}
```

(`webPageJsonLd` is a new helper — full implementation in [Section 6](#6-production-ready-jsonld--library-changes).) No `breadcrumbPath` is passed — the home page is the root of the breadcrumb trail and should not have a one-item `BreadcrumbList` pointing at itself; Google's own breadcrumb guidance treats the root page as breadcrumb-exempt.

**Pages affected:** `/` only.
**Level:** page-specific.

---

### H-3
**`/fleet` — index page has no structured data**

**What's wrong:** `src/app/fleet/page.tsx` lists all 9 fleet categories (verified against `src/config/nav.ts`: Motor Coaches, Coach Buses, Mini Buses, Sprinter Vans, School Buses, Party Buses, Limousines, SUVs, Sedans) via `<FleetGrid>`, but emits no `BreadcrumbList`, no `CollectionPage`, and no `ItemList` of the categories — despite the page's own SEO copy explicitly targeting "charter bus rental near me" and "luxury charter bus" as keywords. Every individual category page one level down already has correct `Service` + `BreadcrumbList` markup; the index that links to all of them has nothing.

**Why it matters:** This is the clearest missed opportunity on the site to use the `itemListJsonLd()` helper that already exists and is already proven correct (it's used for blog listings today). An `ItemList` here explicitly tells Google "these 9 URLs are the enumerated members of this collection," reinforcing the category structure and giving the crawler a direct, machine-readable path to every fleet type from one node — stronger than relying on `<a>` tags being parsed correctly out of the grid markup.

**Fix:**

```tsx
// src/app/fleet/page.tsx
import { breadcrumbJsonLd, itemListJsonLd, JsonLd, webPageJsonLd } from "@/lib/jsonld";
// ...
export default function FleetPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          type: "CollectionPage",
          name: "Charter Bus Rental Fleet — Coaches, Mini Buses & Vans",
          description:
            "Motor coaches, coach buses, mini buses, sprinter vans, party buses, limousines, SUVs, and sedans — every charter bus rental includes a professional driver and a clear, itemized quote.",
          path: "/fleet",
          breadcrumbPath: "/fleet",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Fleet", path: "/fleet" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          fleetCategories.map((category) => ({
            name: category.name,
            path: `/fleet/${category.slug}`,
          })),
        )}
      />
      <Section>
      {/* ...unchanged... */}
```

**Pages affected:** `/fleet` only.
**Level:** page-specific.

---

### H-4
**`/locations` — the entire location engine's hub page has no structured data**

**What's wrong:** `src/app/locations/page.tsx` is the entry point to the whole 16,399-city / 51-state programmatic SEO system — it renders the operations network map, the hub summary, and a browsable list of all 51 states grouped by region. It has zero JSON-LD: no `BreadcrumbList`, no `CollectionPage`, no `ItemList` of states. Every page one level down (`/locations/[state]`) has a correct `BreadcrumbList`; the page that fans out to all 51 of them has nothing.

**Why it matters:** Same class of issue as H-3, at larger scale — this page is the crawl entry point Google is most likely to use to discover the state-level pages, which in turn are the entry point to all 16,399 city pages. An explicit `ItemList` of all 51 states is a direct, low-cost signal reinforcing that discovery path, on top of the sitemap.

**Fix:**

```tsx
// src/app/locations/page.tsx
import { breadcrumbJsonLd, itemListJsonLd, JsonLd, webPageJsonLd } from "@/lib/jsonld";
import { states } from "@/data/locations";
// ...
export default function LocationsPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          type: "CollectionPage",
          name: "Charter Bus Rentals by Location",
          description:
            "Find charter bus, mini bus, and sprinter van rentals near you. Credence Charter Bus serves cities in all 50 states with licensed drivers and all-in quotes.",
          path: "/locations",
          breadcrumbPath: "/locations",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          states.map((state) => ({ name: state.name, path: `/locations/${state.slug}` })),
        )}
      />
      <Section>
      {/* ...unchanged... */}
```

**Pages affected:** `/locations` only.
**Level:** page-specific.

---

### H-5
**`/services` — index page has no structured data**

**What's wrong:** Identical pattern to H-3. `src/app/services/page.tsx` lists all 8 services (verified: Corporate Travel, Event Transportation, Airport Transfers, Sports Team Travel, Wedding & Celebrations, School Trips, City Tours, Long-Distance Charter) with no `BreadcrumbList`, `CollectionPage`, or `ItemList`, while every individual service page one level down already has correct `Service` + `BreadcrumbList` markup.

**Fix:**

```tsx
// src/app/services/page.tsx
import { breadcrumbJsonLd, itemListJsonLd, JsonLd, webPageJsonLd } from "@/lib/jsonld";
// ...
export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          type: "CollectionPage",
          name: "Group Transportation Services",
          description:
            "Corporate travel, event transportation, airport transfers, sports teams, weddings, and school trips — group transportation with a dedicated coordinator.",
          path: "/services",
          breadcrumbPath: "/services",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          services.map((service) => ({ name: service.name, path: `/services/${service.slug}` })),
        )}
      />
      <Section>
      {/* ...unchanged... */}
```

**Pages affected:** `/services` only.
**Level:** page-specific.

---

### H-6
**Site-wide — no `WebSite` entity**

**What's wrong:** Nothing on the site declares a `WebSite` node. `blogJsonLd()` already has a `publisher: { "@id": organizationId }` field pointing at the Organization, but nothing plays the equivalent "this is the site itself" role that `WebSite` is for. Every future `isPartOf` reference this report recommends (home page, collection pages) has nowhere to point without this.

**Why it matters:** `WebSite` is the standard root node search engines use to bind a domain's `name` to its `url` and its publishing `Organization` — it's the anchor that lets Google understand "this domain is the official web presence of this business" independent of any one page. It's foundational, not decorative.

**One deliberate omission — do not add `potentialAction`:** the canonical `WebSite` example everywhere online includes a `SearchAction` (`potentialAction`) for the sitelinks search box. **This site has no internal search feature** (confirmed — no search UI in `src/components/site/header.tsx` or anywhere else in the codebase). Google explicitly requires the search action to be real and functional; adding a `SearchAction` pointing at a URL pattern that doesn't work is invalid structured data and a plausible trigger for a Search Console warning. Omit it. If the site ever ships internal search, add it then.

**Fix:**

```ts
// src/lib/jsonld.tsx
export const websiteId = `${siteConfig.url}/#website`

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  name: siteConfig.name,
  url: siteConfig.url,
  publisher: { "@id": organizationId },
  inLanguage: "en-US",
}
```

Rendered once, site-wide, alongside the existing Organization script:

```tsx
// src/app/layout.tsx
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
// ...
<JsonLd data={organizationJsonLd} />
<JsonLd data={websiteJsonLd} />
```

**Pages affected:** site-wide.
**Level:** template-level (root layout), rendered once — not per page.

---

### M-1
**`/faq` — FAQPage rich-result eligibility has narrowed (informational, not a code defect)**

**What's wrong:** Nothing is broken. The existing `faqJsonLd` in `src/app/faq/page.tsx:15-23` is structurally correct `FAQPage`/`Question`/`Answer` markup. Flagging this because in August 2023 Google changed its guidelines so that the **FAQ rich result in search only displays for well-known, authoritative government and health websites** — most commercial sites, including this one, will generally not see the visual FAQ snippet even with fully valid markup. (Verify current status against Google's own Search Central FAQPage documentation before treating this as final — eligibility policies do change.)

**Why it still matters to keep the markup:** it remains valid, machine-readable Q&A content that helps entity/topic understanding and costs nothing to keep. The recommendation is purely about expectations: don't treat "FAQ rich snippet not showing in the SERP" as a bug to chase — it's expected under current policy.

**Fix:** none required. See M-2 for the one real gap on this page.

---

### M-2
**`/faq` — no `BreadcrumbList`**

**What's wrong:** Every other detail-level page on the site has a `BreadcrumbList`; `/faq` does not.

**Fix:**

```tsx
// src/app/faq/page.tsx
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
// ...
<JsonLd data={faqJsonLd} />
<JsonLd
  data={breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ])}
/>
```

**Pages affected:** `/faq` only. **Level:** page-specific.

---

### M-3
**`/about` — no `AboutPage`/`BreadcrumbList`**

**What's wrong:** `src/app/about/page.tsx` is exactly the content `AboutPage` models — company story, values, founding year, stats — and has zero structured data.

**Fix:**

```tsx
// src/app/about/page.tsx
import { breadcrumbJsonLd, JsonLd, webPageJsonLd } from "@/lib/jsonld";
// ...
export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          type: "AboutPage",
          name: "About Us",
          description:
            "Credence Charter Bus arranges group transportation in all 50 states — licensed drivers, well-maintained vehicles, and quotes without surprises.",
          path: "/about",
          breadcrumbPath: "/about",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <Section>
      {/* ...unchanged... */}
```

**Pages affected:** `/about` only. **Level:** page-specific.

---

### M-4
**`/contact` — no `ContactPage`, and Organization has no structured `ContactPoint`**

**What's wrong:** Two related gaps. First, `src/app/contact/page.tsx` — a page whose entire purpose is phone/email/address — has no `ContactPage` structured data. Second, and more consequential, `organizationJsonLd` exposes `telephone` and `email` as bare top-level strings but never as a proper `ContactPoint`, which is the shape Google's own Organization examples use to distinguish contact channels by purpose (`contactType`) and describe what they cover (`areaServed`, `availableLanguage`).

**Why it matters:** `ContactPoint` is what feeds Google's "Action Links" (Call/Send message buttons) in some Knowledge Panel presentations, and is the more complete, guideline-aligned way to expose a business phone number in structured data than a bare `telephone` field.

**Fix (two parts):**

```ts
// src/lib/jsonld.tsx — extend organizationJsonLd
contactPoint: [
  {
    "@type": "ContactPoint",
    telephone: siteConfig.phone.tel,
    contactType: "customer service",
    areaServed: "US",
    availableLanguage: ["English"],
  },
],
```

```tsx
// src/app/contact/page.tsx
import { breadcrumbJsonLd, JsonLd, webPageJsonLd } from "@/lib/jsonld";
// ...
<JsonLd
  data={webPageJsonLd({
    type: "ContactPage",
    name: "Contact Us",
    description: "Call, email, or request a quote — the Credence Charter Bus team answers around the clock.",
    path: "/contact",
    breadcrumbPath: "/contact",
  })}
/>
<JsonLd
  data={breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ])}
/>
```

**One thing NOT to encode here:** the visible copy on `/contact` and in the header says "answers 24/7" / "around the clock." Do not translate that into a machine-readable `openingHoursSpecification` claiming 24/7 hours. Per CLAUDE.md's own pre-deploy checklist, "24/7 dispatch" is marketing copy **not yet confirmed by the owner** — structured data is a stricter, machine-parsed factual claim than prose on a page, and Google can act on a false `openingHoursSpecification` in ways it can't act on ad copy. Leave hours out of the schema entirely until the owner confirms the claim; see Appendix A.

**Pages affected:** `/contact` (page-specific) + site-wide (`ContactPoint` on the Organization node). **Level:** mixed.

---

### M-5
**193 blog posts — `dateModified` is hardcoded equal to `datePublished`**

**What's wrong:** In `src/app/blogs/[slug]/page.tsx:122`, `dateModified: post.date` — the same value as `datePublished`. There is no `updated`/`dateModified` field anywhere in the `BlogPost`/`BlogSummary` type (`src/data/blogs.ts:10-29`) or the per-post JSON files, so this isn't a bug in the sense of wrong code — it's a schema gap: there's currently no way to record a true "last substantively edited" date at all.

**Why it matters directly, right now:** CLAUDE.md's Phase 9 tracker shows the blog corpus is mid-rewrite — 55 of 193 posts have had a real prose/SEO pass (`reviewed: true`), and that work is ongoing. Every time a post gets its structural rewrite, `dateModified` should change to reflect that real edit — but today it can't, because the field doesn't exist. Google's own Article guidelines specifically warn against a `dateModified` that doesn't reflect a genuine update; leaving it permanently equal to `datePublished` is at best a missed freshness signal and at worst reads as an unmaintained/never-updated date field once the corpus's actual edit history diverges from it (which it already has, for 55 posts).

**Fix:**

```ts
// src/data/blogs.ts — add an optional field
export type BlogSummary = {
  // ...existing fields...
  updated?: string // ISO date of the last substantive content edit, distinct from `date`
}
```

```tsx
// src/app/blogs/[slug]/page.tsx
dateModified: post.updated ?? post.date,
```

Then have the prose/SEO pass (already tracked per-post via `reviewed: true`) stamp `updated` at the same time it flips `reviewed`. No retroactive backfill needed — posts without `updated` correctly fall back to their publish date, which is accurate for posts that haven't been touched since ingestion.

**Pages affected:** all 193 blog posts (type-level fix; only revised posts need the new field populated). **Level:** template-level (`src/data/blogs.ts` type + `blogs/[slug]/page.tsx`) plus a process change (stamp `updated` during the prose pass).

---

### M-6
**`/quote`, `/drivers`, `/affiliates`, `/how-to-book` — no `WebPage`/`BreadcrumbList`**

**What's wrong:** All four have real, substantive content and no structured data whatsoever — not even a breadcrumb. Deliberately grouped together because **the fix for all four is the same generic pattern, and deliberately does not force a specialized type onto any of them** — see [Section 5](#5-what-not-to-add-and-why) for why `/drivers` in particular should not get `JobPosting` and `/quote` should not get any commerce type.

**Fix (repeat per page, only `name`/`description`/`path` change):**

```tsx
// src/app/quote/page.tsx
import { breadcrumbJsonLd, JsonLd, webPageJsonLd } from "@/lib/jsonld";
// ...
<JsonLd
  data={webPageJsonLd({
    name: "Get a Free Charter Bus Quote",
    description: "Request a free charter bus rental quote — group size, dates, and route are all we need. Clear, itemized pricing, usually the same day.",
    path: "/quote",
    breadcrumbPath: "/quote",
  })}
/>
<JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Get a Quote", path: "/quote" }])} />
```

```tsx
// src/app/drivers/page.tsx
<JsonLd
  data={webPageJsonLd({
    name: "Drive With Us",
    description: "Join the Credence Charter Bus driver team — competitive pay, a modern fleet, ongoing training, and routes across all 50 states.",
    path: "/drivers",
    breadcrumbPath: "/drivers",
  })}
/>
<JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Drive With Us", path: "/drivers" }])} />
```

```tsx
// src/app/affiliates/page.tsx
<JsonLd
  data={webPageJsonLd({
    name: "Affiliate Program",
    description: "Operate a charter fleet? Partner with Credence Charter Bus for a steady stream of trips in your service area, fast payments, and dedicated support.",
    path: "/affiliates",
    breadcrumbPath: "/affiliates",
  })}
/>
<JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Affiliate Program", path: "/affiliates" }])} />
```

```tsx
// src/app/how-to-book/page.tsx
<JsonLd
  data={webPageJsonLd({
    name: "How Booking Works",
    description: "Renting a charter bus with Credence takes three steps: request a quote, review your itemized estimate, and sign the agreement.",
    path: "/how-to-book",
    breadcrumbPath: "/how-to-book",
  })}
/>
<JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "How Booking Works", path: "/how-to-book" }])} />
```

**Pages affected:** the 4 listed. **Level:** page-specific, repeated per page.

---

### M-7
**16,399 city pages — `areaServed.City` has no `GeoCoordinates`**

**What's wrong:** `src/app/locations/[state]/[city]/page.tsx:96-100` builds `areaServed` as `{ "@type": "City", name, containedInPlace: { "@type": "State", name } }`. Verified in `src/data/locations/index.ts:12-19`: every `CityEntry` already carries real `lat`/`lng` (used today for the haversine `nearbyCities()` distance calculations) — this is not a value that would need to be invented; it's already loaded and accurate, just not passed into the JSON-LD.

**Why it matters:** Adding real coordinates strengthens geo/entity disambiguation at genuinely large scale (16,399 pages) for essentially free — no new data, no new build step, one object literal change reusing a field the page already imports.

**Fix:**

```tsx
// src/app/locations/[state]/[city]/page.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: `Charter Bus Rental in ${city.name}, ${state.name}`,
  serviceType: "Charter bus rental",
  description: copy.description,
  url: pageUrl,
  areaServed: {
    "@type": "City",
    name: city.name,
    containedInPlace: { "@type": "State", name: state.name },
    geo: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lng }, // new
  },
  provider: { "@id": organizationId },
};
```

**Pages affected:** all 16,399 city pages (single template change). **Level:** template-level.

---

### M-8
**`/locations/[state]` — `BreadcrumbList` exists but no `ItemList` of the rendered cities**

**What's wrong:** `src/app/locations/[state]/page.tsx` correctly renders `<JsonLd data={breadcrumbJsonLd(...)} />` but nothing else — no `ItemList` of the (up to 150, per `locationsBuildConfig.stateCityPageSize`, verified in `src/data/locations/index.ts:24-27`) cities actually rendered on page 1 by `<StateCities>` (verified windowing logic in `src/components/site/state-cities.tsx:20-27`).

**Fix — must mirror the component's exact slice so the markup matches what's visible on the page:**

```tsx
// src/app/locations/[state]/page.tsx
import { citiesOfState, getState, locationsBuildConfig, states } from "@/data/locations";
import { breadcrumbJsonLd, itemListJsonLd, JsonLd } from "@/lib/jsonld";
// ...
const pageOneCities = citiesOfState(state.slug).slice(0, locationsBuildConfig.stateCityPageSize);

<JsonLd
  data={itemListJsonLd(
    pageOneCities.map((city) => ({
      name: city.name,
      path: `/locations/${state.slug}/${city.slug}`,
    })),
  )}
/>
```

**Pages affected:** all 51 state pages (page 1 only — see L-4 for the paginated overflow pages). **Level:** template-level.

---

### L-1
**`/how-to-book` — `HowTo` markup is optional, with a real caveat**

The page's 3-step "after you submit" list (`src/app/how-to-book/page.tsx:29-42`) is legitimate `HowTo`-shaped content. Flagging as Low, not Medium/High, because **Google discontinued the visual HowTo rich result in Search for most locales** in the same August 2023 policy change that narrowed FAQ eligibility — adding this markup provides essentially no SERP visibility benefit today, only a minor machine-understanding one. Include it only if the team wants completeness for its own sake; don't prioritize it.

```ts
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to book a charter bus",
  step: [
    { "@type": "HowToStep", position: 1, name: "We review and match", text: "A coordinator reads your request and matches the trip to the right vehicle from our fleet — usually the same day." },
    { "@type": "HowToStep", position: 2, name: "You get an itemized quote", text: "The estimate covers driver, fuel, tolls, and taxes, with vehicle details and photos, so you can compare with confidence." },
    { "@type": "HowToStep", position: 3, name: "You confirm and pay securely", text: "Review the agreement, sign, and process payment. Your final confirmation lists every pickup time and stop." }
  ]
}
```

---

### L-2
**`/privacy`, `/terms`, `/refund` — no generic `WebPage`/`BreadcrumbList`**

Cosmetic. Schema.org has no dedicated type for Terms/Privacy/Refund content — the correct fallback is the generic `WebPage`. Low priority because these pages have no rich-result eligibility of any kind either way; the only value is entity/breadcrumb consistency.

```tsx
// src/app/terms/page.tsx (identical pattern for privacy/refund, swap name/description/path)
<JsonLd
  data={webPageJsonLd({
    name: "Terms and Conditions",
    description: fillLegalTokens(doc.description),
    path: "/terms",
    breadcrumbPath: "/terms",
  })}
/>
<JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Terms and Conditions", path: "/terms" }])} />
```

The cleanest place to add this is actually inside the shared `LegalPage` component (`src/components/site/legal-page.tsx`), once, rather than in each of the three thin page files — see Section 7.

---

### L-3
**`serviceJsonLd()` — no `@id` on `Service` nodes**

Purely a consistency/future-proofing nitpick — nothing today needs to reference a `Service` node by `@id`, but every other node type in the library (`organizationJsonLd`, the new `websiteJsonLd`, blog's inline `BlogPosting`) has one, and it costs nothing to add:

```ts
// src/lib/jsonld.tsx
export function serviceJsonLd({ name, description, path, areaServed, image }: {
  name: string; description: string; path: string; areaServed?: object; image?: string
}) {
  const url = `${siteConfig.url}${path}`
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`, // new
    name,
    serviceType: name,
    description,
    url,
    provider: { "@id": organizationId },
    areaServed: areaServed ?? { "@type": "Country", name: "United States" },
    ...(image ? { image } : {}), // new, optional
  }
}
```

Backward compatible — every existing call site keeps working unchanged.

---

### L-4
**Paginated overflow pages — no structured data, but also already `noindex`**

`/blogs/page/[n]` and `/locations/[state]/cities/[n]` both already ship `noindex: true` in their metadata (verified: `src/app/blogs/page/[n]/page.tsx:39`, `src/app/locations/[state]/cities/[page]/page.tsx:48`). Pages excluded from the index get essentially no value from structured data, since Google won't surface rich results for a page it isn't indexing. No fix recommended — noted only so it isn't mistaken for an oversight.

---

## 5. What NOT to Add, and Why

Explicitly called out because the brief asked not to add types the content doesn't support — these are the types an SEO checklist might reflexively suggest that this site should **not** implement:

- **`Product` / `Offer` (fleet vehicles or services):** would require a real, publishable `price`. CLAUDE.md is explicit that the site has no fixed rate card and deliberately avoids showing prices (quote-based model; "no invented rate card" is a standing rule for the recently-added cost-focused blog post). Fabricating a price in JSON-LD — even a "starting at" figure — is worse than not having it: it's a factual claim Google can surface directly in search results, and if it doesn't match what a customer is actually quoted, that's a misleading-content problem, not just an SEO one.
- **`JobPosting` (`/drivers`):** the page is an evergreen "always hiring" recruiting page, not a single dated listing. `JobPosting` has hard-required fields this page cannot honestly supply — `datePosted`, `validThrough`, a specific `jobLocation` — and Google is unusually strict here: sites that ship expired or underspecified `JobPosting` markup are one of the most common sources of manual actions in Search Console for structured-data spam. Do not add it unless the page becomes an actual single job listing with real dates.
- **`Person`:** no page on the site attributes content to a named individual. Blog posts render "By the {siteConfig.name} team" deliberately (per `src/app/blogs/[slug]/page.tsx:162`), and the Organization is correctly used as `author` for that reason. Do not invent a staff bio or byline name to hang a `Person` node on.
- **`AggregateRating` / `Review`:** the owner has explicitly banned testimonials/reviews site-wide ("Cut out reviews. No need to" — a binding directive already reflected in the fact that `src/data/testimonials.ts` was deleted). There is also no real rating data anywhere to encode. Fabricated ratings in structured data are one of the most directly enforced categories in Google's structured-data spam policies — this is not a gray area.
- **`SearchAction` on `WebSite`:** covered in H-6 — no internal search feature exists.

---

## 6. Production-Ready JSON-LD — Library Changes

Full replacement for `src/lib/jsonld.tsx`, consolidating every fix from Section 4 that lives at the library level (C-1's `Organization`/`LocalBusiness` choice is left as `LocalBusiness` below pending owner confirmation — swap per C-1 if the address turns out to be non-visitable):

```ts
import { siteConfig } from "@/config/site"

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

export const organizationId = `${siteConfig.url}/#organization`

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness", // See audit finding C-1 — confirm with owner whether the address is customer-visitable
  "@id": organizationId,
  name: siteConfig.name,
  description: siteConfig.tagline,
  url: siteConfig.url,
  telephone: siteConfig.phone.tel,
  email: siteConfig.email,
  image: `${siteConfig.url}/fleet/charter-bus-exterior.webp`,
  logo: `${siteConfig.url}/brand/logo-mark.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.state,
    postalCode: siteConfig.address.zip,
    addressCountry: "US",
  },
  areaServed: { "@type": "Country", name: "United States" },
  foundingDate: String(siteConfig.established),
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: siteConfig.phone.tel,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: ["English"],
    },
  ],
}

export const websiteId = `${siteConfig.url}/#website`

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  name: siteConfig.name,
  url: siteConfig.url,
  publisher: { "@id": organizationId },
  inLanguage: "en-US",
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const lastPath = items[items.length - 1]?.path ?? "/"
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${siteConfig.url}${lastPath}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  }
}

export function webPageJsonLd({
  type = "WebPage",
  name,
  description,
  path,
  breadcrumbPath,
  primaryImage,
}: {
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage"
  name: string
  description: string
  path: string
  breadcrumbPath?: string
  primaryImage?: string
}) {
  const url = `${siteConfig.url}${path}`
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    ...(breadcrumbPath
      ? { breadcrumb: { "@id": `${siteConfig.url}${breadcrumbPath}#breadcrumb` } }
      : {}),
    ...(primaryImage
      ? { primaryImageOfPage: { "@type": "ImageObject", url: primaryImage } }
      : {}),
  }
}

export const blogId = `${siteConfig.url}/blogs#blog`

export function blogJsonLd({
  name,
  description,
  path,
}: {
  name: string
  description: string
  path: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": blogId,
    name,
    description,
    url: `${siteConfig.url}${path}`,
    inLanguage: "en-US",
    publisher: { "@id": organizationId },
  }
}

export function itemListJsonLd(
  items: { name: string; path: string }[],
  { startAt = 1 }: { startAt?: number } = {}
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: startAt + index,
      name: item.name,
      url: `${siteConfig.url}${item.path}`,
    })),
  }
}

export function serviceJsonLd({
  name,
  description,
  path,
  areaServed,
  image,
}: {
  name: string
  description: string
  path: string
  areaServed?: object
  image?: string
}) {
  const url = `${siteConfig.url}${path}`
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: name,
    description,
    url,
    provider: { "@id": organizationId },
    areaServed: areaServed ?? { "@type": "Country", name: "United States" },
    ...(image ? { image } : {}),
  }
}
```

**What changed vs. today, and why each change is backward compatible:**
- `organizationJsonLd` gained `logo` and `contactPoint` — additive fields, no removals.
- `breadcrumbJsonLd()` gained a computed `@id` — additive field; all 8 existing call sites keep working with zero changes to their call signature.
- `websiteId` / `websiteJsonLd` — brand new exports, nothing to migrate.
- `webPageJsonLd()` — brand new export.
- `serviceJsonLd()` gained `@id` (computed, not a new required param) and an optional `image` param — every existing call site (`fleet/[category]`, `services/[slug]`) keeps working unmodified.
- `blogJsonLd()` and `itemListJsonLd()` — unchanged.

---

## 7. Per-Page Implementation Instructions

| Fix ID | File(s) | Change type | Rollout scope |
|---|---|---|---|
| C-1, H-1, H-6, M-4 (ContactPoint) | `src/lib/jsonld.tsx` | Modify existing exports + add 2 new | Site-wide (one file, affects every page via layout + shared imports) |
| H-6 | `src/app/layout.tsx` | Add one `<JsonLd data={websiteJsonLd} />` line | Site-wide, rendered once |
| H-2 | `src/app/page.tsx` | Add `webPageJsonLd` | Page-specific |
| H-3 | `src/app/fleet/page.tsx` | Add `webPageJsonLd` + `breadcrumbJsonLd` + `itemListJsonLd` | Page-specific |
| H-4 | `src/app/locations/page.tsx` | Add `webPageJsonLd` + `breadcrumbJsonLd` + `itemListJsonLd` | Page-specific |
| H-5 | `src/app/services/page.tsx` | Add `webPageJsonLd` + `breadcrumbJsonLd` + `itemListJsonLd` | Page-specific |
| M-2 | `src/app/faq/page.tsx` | Add `breadcrumbJsonLd` | Page-specific |
| M-3 | `src/app/about/page.tsx` | Add `webPageJsonLd` + `breadcrumbJsonLd` | Page-specific |
| M-4 (ContactPage) | `src/app/contact/page.tsx` | Add `webPageJsonLd` + `breadcrumbJsonLd` | Page-specific |
| M-5 | `src/data/blogs.ts`, `src/app/blogs/[slug]/page.tsx` | Add optional `updated` field + use it for `dateModified` | Template-level type change; per-post population is a content-process change, not a code rollout |
| M-6 | `src/app/quote/page.tsx`, `src/app/drivers/page.tsx`, `src/app/affiliates/page.tsx`, `src/app/how-to-book/page.tsx` | Add `webPageJsonLd` + `breadcrumbJsonLd` | Page-specific, ×4 |
| M-7 | `src/app/locations/[state]/[city]/page.tsx` | Add `geo` to the existing inline `areaServed` object | Template-level (all 16,399 city pages) |
| M-8 | `src/app/locations/[state]/page.tsx` | Add `itemListJsonLd` matching the existing `.slice()` window | Template-level (all 51 state pages) |
| L-1 (optional) | `src/app/how-to-book/page.tsx` | Add `HowTo` | Page-specific, optional |
| L-2 | `src/components/site/legal-page.tsx` | Add `webPageJsonLd` + `breadcrumbJsonLd` once, inside the shared component | Template-level (covers `/privacy`, `/terms`, `/refund` in one edit — better than editing all three thin page files, since `LegalPage` already receives `slug`/`doc` and can derive `name`/`path` from `doc.title`/`slug`) |
| L-3 | `src/lib/jsonld.tsx` | Add `@id`/`image` to `serviceJsonLd()` | Included in Section 6's full file |

**Suggested rollout order** (each step independently testable, no step depends on a later one):
1. `src/lib/jsonld.tsx` — the library rewrite (Section 6). Nothing else can be added until this lands, since every page-level fix imports from it.
2. `src/app/layout.tsx` — add `websiteJsonLd`. Verify site-wide before touching individual pages.
3. The two index pages with zero markup that also happen to be the two highest-leverage fixes: `/fleet` and `/locations` (H-3, H-4), then `/services` (H-5) and `/` (H-2).
4. The four content pages with zero markup: `/about`, `/contact`, `/quote`, `/drivers`, `/affiliates`, `/how-to-book`, `/faq` (breadcrumb only).
5. The two template-level location fixes: `M-7` (geo) and `M-8` (ItemList) — both single-file changes that apply to thousands of pages at once, so test on one state/city before trusting the rebuild.
6. `M-5` (blog `dateModified`) — ships as a no-op until the content team starts stamping `updated` during the Phase 9 prose pass.
7. Low-priority items (`L-1` through `L-4`) — batch in whenever convenient; none are time-sensitive.

---

## 8. Validation & Testing Checklist

**Per-page, after any change:**
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) on the live/preview URL — confirms which types Google actually detects and whether each is eligible for a rich result, not just whether the JSON is syntactically valid.
- [ ] [Schema.org Validator](https://validator.schema.org/) — stricter pure-spec validation; catches type/property mismatches the Rich Results Test doesn't always flag (it's Google-eligibility-focused, not spec-completeness-focused).
- [ ] View source / dev tools → confirm exactly one `<script type="application/ld+json">` per logical entity (no accidental double-render from a page importing a component that also renders the same `JsonLd`).
- [ ] Confirm every `{"@id": ...}` reference resolves against a node actually present in that page's full script set (the site-wide Organization/WebSite nodes are always present via layout, so page-level references to `organizationId`/`websiteId` will always resolve — but a new node type introduced later must not assume a node is present unless it truly is on every page).

**Site-wide, before considering the rollout done:**
- [ ] `grep -rn "PLACEHOLDER" src/lib/jsonld.tsx` and every touched page — zero results (repo-wide rule).
- [ ] Full `next build` succeeds — the type-level change to `BlogSummary`/`BlogPost` (M-5) and any new `webPageJsonLd` call sites must type-check cleanly across all 193 blog posts and ~16,700 location pages.
- [ ] Spot-check the templated pages, not just the unique ones — for M-7/M-8, hand-verify 3–5 individual city pages and 3–5 state pages across different regions (not just the first alphabetically) since a single bad template edit propagates to every page built from it.
- [ ] Google Search Console → **Enhancements** reports (once re-crawled): confirm new `BreadcrumbList`/`FAQPage` entries appear with 0 errors, and watch for any new **Unparsable structured data** or **Missing field** warnings in the following weeks.
- [ ] Confirm no `LocalBusiness`/`Service` node with `@type: LocalBusiness` was accidentally introduced on a per-city page (would reintroduce the exact spam pattern currently — correctly — avoided; see architecture table in Section 2).
- [ ] Re-run the site's own `scripts/check-blogs.mjs` after the `dateModified` change — it already validates blog JSON structure and should catch a malformed `updated` field before it ships.
- [ ] If C-1 is resolved by switching to `Organization`, re-check Rich Results Test on 3–5 sample pages to confirm nothing that depended on the `LocalBusiness` type (there is nothing today, per this audit) silently stopped validating.

---

## Appendix A — Flagged / Unverifiable Business Data

Per the audit's constraint against fabricating business facts, these values are called out explicitly rather than filled in:

| Value | Needed for | Status |
|---|---|---|
| Is `siteConfig.address` (7901 4th St N, Ste 31686, St. Petersburg, FL) a real, customer-visitable office? | Finding C-1 — determines `LocalBusiness` vs. `Organization` | **Owner must confirm.** Not determinable from the codebase. |
| Real business hours (if the "24/7 dispatch" claim is true) | An `openingHoursSpecification` on the Organization node | **Not added.** CLAUDE.md's own pre-deploy checklist lists this claim as unconfirmed by the owner; do not encode it as structured fact until confirmed. |
| A fixed price or price range for any vehicle/service | `Product`/`Offer` markup | **Deliberately not recommended at all** — see Section 5. The business has no fixed rate card by design (quote-based model). |
| Real customer ratings/reviews | `AggregateRating`/`Review` | **Deliberately not recommended at all** — owner has banned testimonials site-wide, and no real rating data exists to encode. |
| A named staff member or driver as content author | `Person` schema | **Deliberately not recommended at all** — no page currently attributes content to a named individual; the site's own byline convention ("By the {company} team") confirms this is intentional. |

---

*End of audit.*
