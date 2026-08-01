@AGENTS.md

# Credence Charter Bus — living memory

Marketing + lead-gen site for a charter bus company (rebrand of "Vanguard Charter Bus" — no Vanguard references may ship). Audience skews older; design for trust and ease, not flash.

## Stack
- Next.js 16.2.12 (App Router, `src/` dir, `@/*` alias) + TypeScript
- React 19.2.4, Tailwind CSS v4 (CSS-first config via `@theme` in globals.css — no tailwind.config file)
- shadcn/ui for primitives (to be added in Phase 1)
- ESLint 9 flat config
- Next 16 notes: `params`/`searchParams` are Promises (must `await`); classic ISR (`export const revalidate` + `generateStaticParams`) is supported; bundled docs live in `node_modules/next/dist/docs/` — consult before using unfamiliar APIs.

## Working conventions (non-negotiable)
- Work in phases; STOP after each phase for approval.
- Read relevant files before writing code. Smoke test at start and end of each phase.
- No inline comments, no unused imports, no dead code. Small reviewable diffs.
- **NO AI-SLOP — HARD RULE.** Concretely:
  - Zero narration comments ("// render the header", "// handle click"), zero section-divider comments, zero comments explaining what readable code already says. If a comment isn't stating a real constraint the code can't express, it doesn't exist.
  - Clean up as you go: every touched file leaves with no unused imports, no unused vars/props, no commented-out code, no leftover scaffold cruft.
  - No slop design: no gratuitous gradients-on-everything, no emoji-as-icons, no generic "✨ modern SaaS" look, no wall-of-badges, no fake urgency. Every visual choice must serve the trust-and-ease brief for an older audience.
  - No slop code patterns: no needless wrapper divs, no copy-pasted near-duplicate blocks (extract), no `any`, no default-exported anonymous helpers, no over-abstracted one-use "utils".
- All business details (name, phone, email, address, stats, established year) come ONLY from `src/config/site.ts`. Never hardcode them elsewhere.
- **No `PLACEHOLDER_*` tokens in shippable code, ever.** Unknown values use realistic dummy data (see below) so the UI never renders debug strings. Phone dummies must stay in the `555-01xx` range (reserved for fiction — can never ring a real person).

## ⚠️ HARDCODED DATA — PRE-DEPLOY CHECKLIST
**Ask for this list before deploying to hosting.** Everything below is invented and must be replaced or verified. Nothing here is real client data except where marked ✅.

### 1. Fake contact details — MUST REPLACE (wrong = lost leads)
All in `src/config/site.ts`, each marked with a `// dummy` comment. Change them there only; every page, JSON-LD, sitemap, and tel: link derives from this file.

| Field | Current dummy value |
|---|---|
| `legalName` | Credence Charter Bus LLC |
| `url` | https://www.credencecharterbus.com |
| `phone.display` | (800) 555-0142 |
| `phone.tel` | +18005550142 |
| `email` | info@credencecharterbus.com |
| `address.street` | 1200 Transit Way, Suite 400 |
| `address.city` / `.state` / `.zip` | Dallas / TX / 75201 |

Verify with: `grep -rn "dummy" src/config/site.ts` (should return 0 lines once real values are in).
`url` MUST be the live domain before launch — canonicals, OpenGraph, and sitemap URLs all build from it.

### 2. Invented business claims — MUST VERIFY WITH OWNER (accuracy/legal risk)
Written as plausible marketing copy; none confirmed by the client. If any is untrue, edit the source file.
- **"24/7 dispatch" / "answers around the clock"** — `components/site/header.tsx` ("Call us anytime"), `app/contact/page.tsx`, `data/faq.ts`
- **Quote turnaround: "same day" / "within one business day"** — `app/quote/page.tsx`, `components/site/quote-form.tsx` (success panel), `data/blogs.ts`, city pages via `lib/variation.ts`
- **"Licensed & insured", driver vetting/rest claims** — `components/site/hero.tsx` trust list, `app/about/page.tsx`, `data/faq.ts`, `data/services.ts`
- **All-in pricing promise (driver, fuel, tolls, taxes included)** — repeated in `data/faq.ts`, `data/fleet.ts`, `data/blogs.ts`, `components/site/cta-band.tsx`
- **ADA/wheelchair-lift vehicles on request** — `data/faq.ts`
- **Wi-Fi, power outlets, restrooms, seat capacities per vehicle** — `data/fleet.ts` (`capacity`, `amenities`)
- **Cancellation policy + deposit terms** — `data/faq.ts`
- **Booking lead time "4–8 weeks"** — `data/faq.ts`, `data/blogs.ts`

### 3. Placeholder content — REVIEW
- **Blog post dates** (`data/blogs.ts`) — invented June–July 2026 dates; set real publish dates.
- **Blog author** — renders "By the {siteConfig.name} team"; swap if real bylines are wanted.
- **Locations dataset** (`data/locations/locations.json`) — seed of 8 states / 60 cities only. Client wants ALL states + cities: run `node scripts/ingest-locations.mjs <full-list.csv>`.
- **Fleet + service descriptions** — original copy written for this site (intentionally not copied from the model site); owner should approve wording.
- **Logo** — `<Logo />` renders a text wordmark until `public/brand/logo.svg` exists.
- **Hero media** — falls back to `/fleet/charter-bus-exterior.png`; real image/video goes in `siteConfig.hero`.
- **Quote delivery** — `lib/quote-sender.ts` only logs to console. **Quote requests are NOT emailed anywhere until this is wired.** Highest-priority non-cosmetic gap before launch.

### 4. Confirmed real client data ✅ (do not change without owner)
- `established: 2013`
- Stats: 12+ years, 500K+ passengers, 750+ cities, 15M+ miles
- 18 vehicle photos in `public/fleet/` (owner-supplied)

## Client directives (from owner's notes, 31 Jul 2026) — treat as binding
- **No social media links anywhere.** `siteConfig.social` was REMOVED; JSON-LD has no `sameAs`. Do not re-add.
- **No reviews/testimonials.** Section and data file deleted ("Cut out reviews. No need to"). Do not re-add.
- **Neutral palette only — no orange, green, yellow.** Current navy/bronze/cream set is approved; keep it.
- **Established 2013.** `siteConfig.established`; surfaced in hero trust list, About, footer, and `foundingDate` in JSON-LD.
- **Real stats (final, not placeholders):** 12+ years, 500K+ passengers, 750+ cities, 15M+ miles.
- **Locations = "exactly same as vanguard"** — all states/cities/connecting pages. Current engine covers this; needs the owner's full city CSV via the ingestion script.
- **Fleet/services/blogs/about copy:** must be reworded away from the model site (already written fresh here, not copied). Blog + fleet imagery must be non-copyright — the 18 supplied PNGs are owner-provided and OK.
- **Still open / needs owner input:** hero animation-vs-photo choice needs approval; "different stats animation" (stats currently render static — a count-up on scroll would need to respect prefers-reduced-motion); driver + affiliate forms not yet built; tour-bus form intentionally folded into `/quote`.

## Design system (implemented Phase 1)
- Tokens live in `src/app/globals.css` (`:root` vars + `@theme inline` mapping, shadcn semantic names): background cream `#F7F5F0`, foreground ink `#22252B`, card/surface white, primary navy `#1B2A4A` (+ `--primary-hover #142138`), accent bronze `#C1A15A` (+ `--accent-hover #B08F49`), `--accent-deep #7A612A` (bronze for SMALL text — plain bronze fails 4.5:1 on light bg), muted-foreground slate `#5A6B82`, destructive muted brick `#9B3B34`, border `#DDD8CC`, input border `#857D6D` (3:1 non-text), radius 0.5rem.
- **Contrast rules:** never white text on bronze (2.6:1 — always ink); small bronze text uses `text-accent-deep` on light bg, plain `text-accent` is OK on navy (5.3:1); buttons on navy bg need `focus-visible:ring-primary-foreground/60` override (see CtaBand).
- Type: Bitter (--font-heading, headings/wordmark, slab = transit heritage) + Source Sans 3 (--font-sans, body). 18px base via `html { font-size: 112.5% }`. h1–h4 get font-heading + text-balance globally.
- Signature motif: bronze "route line" (dot—line—ring, origin→destination) via `<RouteLine />` in `section.tsx`; reuse for 3-step process connector. Keep everything else quiet.
- Primitives: `ui/` button (variants default/accent/outline/ghost; sizes default h-11, lg h-12, icon), card, container (max-w-6xl), section (Section/SectionHeading/RouteLine). Shell: `components/site/` logo (auto-swaps to `/brand/logo.svg` when present; `tone` prop for navy bg), header (sticky, nav via `src/config/nav.ts`), nav-links (client, aria-current + bronze underline), mobile-nav (client disclosure, Esc closes), footer (navy), call-bar (fixed bottom <md; body has pb-24 md:pb-0 to compensate), cta-band.
- No dark mode by design (light-only trust site). No neon, no saturated red/green.

## Responsive rules (audited across 320/360/390/414/768/1024/1280px)
- **Buttons must never use `whitespace-nowrap` with a fixed `h-*`.** The cva base wraps text and sizes use `min-h-11`/`min-h-12` + `py-*`, so a long label grows the button instead of overflowing or being clipped. This was the single biggest source of mobile breakage — long labels (`About Wedding & Group Celebrations`, `Call Now — {phone}`) blew out of cards and the call bar.
- Mobile menu is a **right-side drawer**, not a top dropdown: `fixed inset-y-0 right-0`, `w-[min(21rem,86vw)]`, scrim, body scroll lock, focus trap, Escape/scrim/nav-click all close and return focus. Header is `z-50` so the drawer paints above the `z-40` CallBar — do not lower it or the fixed bar covers the drawer.
- Type scale steps at three stops, not two: h1 `text-3xl sm:text-4xl lg:text-5xl`, h2 `text-2xl sm:text-3xl lg:text-4xl`, lede `text-base sm:text-lg`. At the 18px root, `text-4xl` is 40.5px — too heavy for a 360px phone.
- `Section` padding is `py-10 sm:py-14 lg:py-20`. 3-up card grids break at `md:`, not `sm:` (640px is too tight for three columns at 18px base).
- `body` sets `overflow-wrap: break-word` as a guard against long unbreakable strings (emails, city slugs). Never add `overflow-x: hidden` to html/body — it silently hides real overflow and breaks the sticky header.
- Footer/nav links use `flex` (not `inline-flex`) so the full row is a ≥44px tap target.
- Re-verify with a headless pass measuring `documentElement.scrollWidth` vs `clientWidth` per route per width, plus per-element `scrollWidth > clientWidth` (catches content clipped *inside* `overflow-hidden` cards, which page-level overflow checks miss).

## Accessibility acceptance criteria (verify at end of every UI phase)
- WCAG 2.1 AA min (AAA body-text contrast where feasible); 18px base font
- Targets ≥44×44px; keyboard navigable; visible focus rings; landmarks/aria
- `prefers-reduced-motion` respected; transitions ≤200ms fade/slide only
- Persistent mobile "Call Now" (tel:) button; phone in header + footer

## Data-file locations
- `src/config/site.ts` — siteConfig (business info placeholders, hero media swap point)
- `src/config/nav.ts` — main nav items (header, mobile, footer all read this)
- `src/data/fleet.ts` — 8 FleetCategory entries; images point to `public/fleet/*.png` (kebab-case, renamed from originals; motor coach images live under charter-buses as `extra`). 3 featured hero categories.
- `src/data/services.ts` — 6 services (corporate, event, airport, sports, wedding, school)
- `src/data/testimonials.ts`, `src/data/faq.ts` — home/FAQ content
- `src/data/blogs.ts` — blog preview stub (3 posts); Phase 4 replaces with full content layer
- `src/lib/quote.ts` — QuoteRequest type + validateQuote (shared client/server); `src/lib/quote-sender.ts` — QuoteSender interface, console stub is the swap point for email/CRM
- `src/data/locations/locations.json` — canonical state→city dataset (seed: 8 states, 60 cities). Regenerate with `node scripts/ingest-locations.mjs <cities.csv|json>` (columns: city,state,abbr,region,lat,lng,population; region must be Northeast/Midwest/South/West). `src/data/locations/index.ts` — typed accessors, haversine `nearbyCities()` (8 nearest, cross-state allowed), `locationsBuildConfig.prebuildCityLimit` (25 by population; the rest render on-demand via ISR).
- `src/lib/variation.ts` — deterministic copy variation for city pages: djb2 hash of `state/city` slug picks from template pools (6 openings × 5 details × 3 meta descriptions). Add templates there to increase spread; NEVER use Math.random (breaks stable rebuilds).
- ISR note: `export const revalidate` must be a LITERAL (Next static analysis) — it's `86400` at the top of both `/locations/[state]` pages; change it there, not via config import.

## Assets
- Vehicle images arrived during Phase 1: 18 PNGs in `public/` root, 9 types × ext/int (charter bus, motor coach, mini bus, sprinter van, party bus, school bus, stretch limo — filename typo "strecth", SUV, sedan). ~2MB+ each, ~1536×1024. Phase 2: move to `public/fleet/` with kebab-case names, map into fleet data model, serve via next/image (never raw — too heavy). Motor coach folds into the Charter/Coach category.
- Hero media: single swappable config value at `siteConfig.hero` (image or video).
- Logo: `<Logo />` renders placeholder wordmark; auto-uses `/public/brand/logo.svg` when present.

## SEO rules
- Every route: Metadata API title/description/canonical/OpenGraph. Canonicals self-referencing.
- JSON-LD: Organization/LocalBusiness site-wide; Service, BreadcrumbList, FAQPage, Article per page type.
- Location pages must be substantive (unique tokenized intros, nearby-city links, fleet/services blocks) — no thin doorway pages.
- Sitemap index shards location URLs ≤50k per child sitemap; robots.txt.

## Phase checklist
- [x] Phase 0 — Recon & baseline (scaffold, siteConfig, CLAUDE.md, smoke test, route/data plan)
- [x] Phase 1 — Design system + shell (tokens, Header/Footer/Logo, primitives, a11y pass)
- [x] Phase 2 — Core marketing pages (home, fleet, services, about, contact, FAQ, quote form + stub API)
- [x] Phase 3 — Programmatic location SEO engine (locations dataset, 3 route levels, ISR, variation system)
- [x] Phase 4 — Blogs (index + detail, Article JSON-LD, rewritten + new SEO posts)
- [x] Phase 5 — Technical SEO + performance (metadata everywhere, JSON-LD validation, sitemaps, Lighthouse ≥90/95/95)
- [x] Phase 6 — Final QA (build, link check, no Vanguard tokens, swap-ability confirmed, README)

## Phase 4–6 additions
- `src/data/blogs.ts` — 6 full posts as typed blocks (p/h2/ul), `planningLinks` for internal links to services/fleet/locations, `relatedPostSlugs`; `blogPreviews` derived for home teaser. `src/lib/blog-format.ts` — date + reading-time helpers.
- `src/lib/seo.ts` — `pageMetadata()` builds title/description/canonical/OG/twitter for EVERY route; home uses `title: {absolute}`. `src/lib/jsonld.tsx` — `<JsonLd>`, site-wide LocalBusiness (`organizationId` referenced by all Service/Article nodes), `breadcrumbJsonLd`, `serviceJsonLd`. Org JSON-LD rendered once in root layout.
- Sitemaps: `/sitemap.xml` (index) + `/sitemaps/core.xml` + `/sitemaps/locations-N.xml` (≤50k URLs/shard) via `src/lib/sitemap.ts`; `src/app/robots.ts`. All derive from siteConfig.url + data files — no manual lists.
- Hero split: `hero-media.tsx` is a SERVER component (image path, quality 50); `hero-video.tsx` is the client half (reduced-motion-aware autoplay). Keep it this way — moving the image back into a client component cost ~2 Lighthouse perf points.
- Lighthouse (local, throttled mobile, re-verified after the client-notes edits) — perf/a11y/bp/seo: home **91**(median of 4: 87,90,92,92)/100/100/100 · fleet 96/100/100/100 · service 95/100/100/100 · blog 96/100/100/100 · city 95/100/100/100. All targets (≥90/95/95) met.
- **Perf measurement gotcha:** the FIRST Lighthouse run after `npm run start` scores ~3 points low because `next start` optimizes the 2MB source PNGs on demand (cold cache). Always discard run 1 or take a median. On Vercel these are pre-optimized + CDN-cached, so the warm number is representative.
- Home LCP is the hero `<h1>` (~3.4s local, render-delay bound), not the image. If real-world perf needs more headroom, the highest-leverage fix is shrinking the source PNGs in `public/fleet/` (currently ~2MB each) — not more code changes.
- QA verified: 97-page link crawl all 200, zero Vanguard tokens, PLACEHOLDER only in site.ts, logo auto-swap tested both directions.
