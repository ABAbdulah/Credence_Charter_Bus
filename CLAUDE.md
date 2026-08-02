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
- **Locations dataset** (`data/locations/locations.json`) — now the full national set: 16,399 cities / 50 states + DC, built from GeoNames on 1 Aug 2026. **Attribution is a licence condition** (see SEO rules below) and is not yet on the site.
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
- **Tailwind v4 gotcha:** v4's preflight does NOT give `<button>` `cursor: pointer` (v3 did). `globals.css` restores it once via `:where(button, [role="button"]):not(:disabled)` — zero specificity so utilities still win, and disabled controls correctly keep the default arrow. Don't sprinkle `cursor-pointer` on individual buttons.
- **Never combine `active:translate-y-px` (button base) with a positioning `-translate-y-1/2`** — they set the same `--tw-translate-y`, so pressing the button makes it jump half its height and the mouseup lands elsewhere, silently swallowing the click. Center overlay controls with a `flex items-center` wrapper instead (see `fleet-gallery.tsx`).

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
- `src/data/locations/locations.json` — canonical state→city dataset: **16,399 cities across 50 states + DC** (2.7 MB). Regenerate with `node scripts/ingest-locations.mjs <cities.csv|json>` (columns: city,state,abbr,region,lat,lng,population; region must be Northeast/Midwest/South/West). `src/data/locations/index.ts` — typed accessors, haversine `nearbyCities()` (8 nearest, cross-state allowed), `locationsBuildConfig.prebuildCityLimit` (25 by population; the rest render on-demand via ISR) and `stateCityPageSize` (150 per page). State pages are **paginated**, not truncated: page 1 is `/locations/[state]`, pages 2+ are `/locations/[state]/cities/[n]`, so every city is reachable by clicking. Uncapped on one page, California was 575 KB of HTML with ~2,000 links; paginated it is 120 KB and max 7 pages. Pages 2+ are `noindex, follow` (`pageMetadata({ noindex: true })`) — they exist for humans and crawl paths, and every city is already in the sitemap, so they add no thin pages to the index. **The pagination segment is `cities`, not `page`** — "page" is a real city slug (Page, Arizona).
- **Source of the dataset:** GeoNames `cities1000` (`https://download.geonames.org/export/dump/cities1000.zip`), filtered to `country=US`, feature class `P`, and feature codes `PPL/PPLA/PPLA2/PPLA3/PPLC` only. **`PPLX` (neighbourhood sections like "Central 14th Street / WMATA Northern Bus Barn"), `PPLQ` (abandoned), `PPLS`, `PPLL` must stay excluded** — they produce absurd "Charter Bus Rental in …" pages. Also name-filter `(historical)`, mobile home parks, and courthouse annexes. Dedupe on the **slugified** name per state, not the raw name, or "St. Marys" and "St Marys" collide on one URL.
- `src/lib/variation.ts` — deterministic copy variation for city pages: djb2 hash of `state/city` slug picks from template pools (12 openings × 10 details × 6 meta descriptions), plus a `scale` paragraph chosen by population tier (metro ≥250k / city ≥50k / town ≥10k / small) that quotes the real population and real distances to nearby cities. Facts differ per city, which is what keeps 16k pages from reading as one template. Add templates to increase spread; NEVER use Math.random (breaks stable rebuilds).
- ISR note: `export const revalidate` must be a LITERAL (Next static analysis) — it's `86400` at the top of both `/locations/[state]` pages; change it there, not via config import.

## Assets
- Vehicle images arrived during Phase 1: 18 PNGs in `public/` root, 9 types × ext/int (charter bus, motor coach, mini bus, sprinter van, party bus, school bus, stretch limo — filename typo "strecth", SUV, sedan). ~2MB+ each, ~1536×1024. Phase 2: move to `public/fleet/` with kebab-case names, map into fleet data model, serve via next/image (never raw — too heavy). Motor coach folds into the Charter/Coach category.
- Hero media: single swappable config value at `siteConfig.hero` (image or video).
- Logo: `<Logo />` renders placeholder wordmark; auto-uses `/public/brand/logo.svg` when present.

## SEO rules
- Every route: Metadata API title/description/canonical/OpenGraph. Canonicals self-referencing.
- JSON-LD: Organization/LocalBusiness site-wide; Service, BreadcrumbList, FAQPage, Article per page type.
- Location pages must be substantive (unique tokenized intros, nearby-city links, fleet/services blocks) — no thin doorway pages.
- Sitemap index shards location URLs ≤50k per child sitemap; robots.txt. Currently 16,399 location URLs (one shard) + 80 core URLs.
- **GeoNames attribution is outstanding.** The city dataset is CC BY 4.0, which requires visible credit. Add a line such as "City data © GeoNames, CC BY 4.0" to the footer or `/locations` before launch — this is a licence obligation, not a nicety.
- **Scaled-content risk is live now.** 16k programmatic city pages is the exact pattern Google's scaled-content-abuse policy targets. Mitigations in place: per-city population and real inter-city distances in the copy, a 4-tier scale paragraph, and 720 body-template combinations. If rankings stall or pages get deindexed, the fix is fewer/better pages (raise the population floor in the prep step), not more templates.

## Phase checklist
- [x] Phase 0 — Recon & baseline (scaffold, siteConfig, CLAUDE.md, smoke test, route/data plan)
- [x] Phase 1 — Design system + shell (tokens, Header/Footer/Logo, primitives, a11y pass)
- [x] Phase 2 — Core marketing pages (home, fleet, services, about, contact, FAQ, quote form + stub API)
- [x] Phase 3 — Programmatic location SEO engine (locations dataset, 3 route levels, ISR, variation system)
- [x] Phase 4 — Blogs (index + detail, Article JSON-LD, rewritten + new SEO posts)
- [x] Phase 5 — Technical SEO + performance (metadata everywhere, JSON-LD validation, sitemaps, Lighthouse ≥90/95/95)
- [x] Phase 6 — Final QA (build, link check, no Vanguard tokens, swap-ability confirmed, README)
- [ ] Phase 9 — Blog migration (177 legacy destination guides → 183 posts total). See "Phase 9" below.

## Phase 4–6 additions
- `src/data/blogs.ts` — 6 full posts as typed blocks (p/h2/ul), `planningLinks` for internal links to services/fleet/locations, `relatedPostSlugs`; `blogPreviews` derived for home teaser. `src/lib/blog-format.ts` — date + reading-time helpers.
- `src/lib/seo.ts` — `pageMetadata()` builds title/description/canonical/OG/twitter for EVERY route; home uses `title: {absolute}`. `src/lib/jsonld.tsx` — `<JsonLd>`, site-wide LocalBusiness (`organizationId` referenced by all Service/Article nodes), `breadcrumbJsonLd`, `serviceJsonLd`. Org JSON-LD rendered once in root layout.
- Sitemaps: `/sitemap.xml` (index) + `/sitemaps/core.xml` + `/sitemaps/locations-N.xml` (≤50k URLs/shard) via `src/lib/sitemap.ts`; `src/app/robots.ts`. All derive from siteConfig.url + data files — no manual lists.
- Hero split: `hero-media.tsx` is a SERVER component (image path, quality 50); `hero-video.tsx` is the client half (reduced-motion-aware autoplay). Keep it this way — moving the image back into a client component cost ~2 Lighthouse perf points.
- Lighthouse (local, throttled mobile, re-verified after the client-notes edits) — perf/a11y/bp/seo: home **91**(median of 4: 87,90,92,92)/100/100/100 · fleet 96/100/100/100 · service 95/100/100/100 · blog 96/100/100/100 · city 95/100/100/100. All targets (≥90/95/95) met.
- **Perf measurement gotcha:** the FIRST Lighthouse run after `npm run start` scores ~3 points low because `next start` optimizes the 2MB source PNGs on demand (cold cache). Always discard run 1 or take a median. On Vercel these are pre-optimized + CDN-cached, so the warm number is representative.
- Home LCP is the hero `<h1>` (~3.4s local, render-delay bound), not the image. If real-world perf needs more headroom, the highest-leverage fix is shrinking the source PNGs in `public/fleet/` (currently ~2MB each) — not more code changes.
- QA verified: 97-page link crawl all 200, zero Vanguard tokens, PLACEHOLDER only in site.ts, logo auto-swap tested both directions.

## Phase 9 — blog migration (in progress)

Ports the 177 destination guides from the legacy site. Target end state: **183 posts** (177 migrated + the 6 original how-to posts). Briefs: `MIGRATION-AUDIT.md` §2, `BLOG-MIGRATION-BRIEF.md`.

### Owner decisions settled this phase (binding)
- **Port + keyword/link pass**, not verbatim and not a from-scratch rewrite. This supersedes the older "reword the blogs away from the model site" note.
- **The old domain stays live — there will be no 301.** So a light touch is not enough: two live copies of the same text means Google picks one, and it will usually pick the 12-year-old domain. Each ported post must end up materially different — reworked intro, imposed `h2` structure, a vehicle-recommendation section and a logistics section the original does not have.
- **The legacy fleet specs are authoritative** — capacities and amenities in `src/data/fleet.ts` were changed to match the old site (see below). Blog copy must agree with `fleet.ts`, never contradict it.
- **No client keyword list exists.** Use the inferred tiers in `BLOG-MIGRATION-BRIEF.md` §2b.
- **The keyword pass covers all 183 posts**, including the 6 originals.
- `BLOG-MIGRATION-BRIEF.md` §7.1 ("year minus seven CDA") is **not about blogs** — dropped, do not resurface it.

### Fleet reconciliation applied (was new-site values → now legacy values)
charter-buses 36–56 → **40–56** + Wi-Fi standard (was "on request") · mini-buses 20–35 → **20–32** +Wi-Fi/reclining · sprinter-vans 8–15 → **10–14** +Wi-Fi · school-buses 40–48 → **28–60** · party-buses 20–40 → **14–40** +dance floor/bar area · limousines 6–10 → **up to 10** · suvs 1–6 → **up to 7** · sedans 1–3 → **up to 4**.
Two existing posts were corrected to match (`charter-bus-vs-mini-bus`, `corporate-event-transportation-guide`).
**Wi-Fi as standard, the dance floor, and the bar area are now firm promises on the site** — owner-confirmed, but they are the claims most likely to draw a complaint if a vehicle arrives without them.

### What the legacy site actually turned out to be (corrects MIGRATION-AUDIT)
- **Hero images live at `/assets/blogs/…`, not `/blogs/…`.** Appendix A records the wrong path; fetching by it 404s.
- **Every post has a second image** (`{Name}-2.webp`) that Appendix A does not list — 354 images, not 177.
- **There are no publish dates anywhere** — not in post HTML, not on the index, and the sitemap has no `lastmod`. The brief's "use the real publish date" is unsatisfiable. Migrated posts are spread deterministically across `DATE_WINDOW_START`/`DATE_WINDOW_END` in `scripts/ingest-blogs.mjs` (currently Jan 2024 – May 2026), ordered by a djb2 hash of the slug so the assignment is stable across rebuilds and independent of which subset is re-run. Change the window there, in one place.
- **The host is not slow.** Every request returned 200 in well under a second. The previous session's total failure to fetch any post body was transient. Full run at a 5s gap is ~45 minutes.
- **Roughly half the posts have no internal structure at all** — no `h2`, no lists, no bold, just 8–10 paragraphs, 743–831 words. Imposing structure is therefore part of the keyword pass, not optional polish.

### Architecture
- `src/content/blogs/{slug}.json` — one file per post; `index.json` is generated and holds only the light summary fields. `src/data/blogs.ts` is now a thin accessor over it: `allBlogPostsSorted()`/`getBlogSummary()` read the index (cheap), `getBlogPost()` is **async** and dynamic-imports the single post body. Never import the whole corpus eagerly.
- `BlogSummary` carries `stateSlug`, written by the ingest script. **Blogs must never import `@/data/locations`** — that would pull the 2.7 MB `locations.json` into every page that touches blog data, including the home page.
- **Inline links inside body copy use markdown syntax** — `[label](/fleet/mini-buses)` in `p` text and `ul` items, rendered by `InlineText` in `src/app/blogs/[slug]/page.tsx`. `BlogBlock` is plain text, so this is what makes `BLOG-MIGRATION-BRIEF.md` §3's "links inside the copy, not dumped in a footer" possible. `stripInlineLinks()` in `lib/blog-format.ts` keeps reading-time honest. Excerpts stay link-free.
- `extraImage` renders mid-article, snapped to the next `h2` after the midpoint so it never splits a heading from its paragraph.
- Routes: `/blogs` (page 1, 24 per page) · `/blogs/page/[n]` (pages 2+, `noindex, follow`) · `/blogs/state/[state]` (archives, indexed, in the sitemap). The state filter is a **server** component — they are plain links, so it needs no JS and stays crawlable (MIGRATION-AUDIT proposed a client component; unnecessary). It is a native `<details>` disclosure, **collapsed by default**, opening into four region columns (`BLOG_REGIONS`, from `stateRegion` on the index). 45 states as a flat chip row was a wall of badges that pushed every card below the fold. `stateRegion` is derived in the ingest script's **index step**, not stored per post, so it applies to `reviewed` posts too (which the write step skips).
- Blog cards use the **stretched-link** pattern: `relative` on the Card, `after:absolute after:inset-0` on the title link, `group-hover/card:underline` for the hover affordance. One anchor per card, so the accessible name stays the post title — do not wrap the whole card in an `<a>`, that would read the image and excerpt out as the link name. Trade-off: card text is not selectable.

### Scripts
- `scripts/ingest-blogs.mjs` — two stages. Fetch caches raw HTML to `.cache/vanguard-blogs/` (gitignored); parse runs offline against that cache, so the parser can be iterated on for free. Resume-safe, logs failures, `--retry-failed`. Re-run the parse stage after any parser change: `--skip-fetch --skip-images`.
- `scripts/link-blogs.mjs` — derives `planningLinks` (fleet + service + city + quote). **Location links are only ever chosen from cities the post actually names**, validated against `locations.json`, so a post can never link to a city page that does not exist; it falls back to the state's largest city. Useful property: write a gateway city into the prose (e.g. Moab in the Arches guide) and re-running the linker picks it up automatically.
- `scripts/check-blogs.mjs` — the phase QA gate. Zero Vanguard tokens, every `planningLinks` and inline-link target resolves, every `relatedPostSlugs` entry exists, every image file present, `index.json` in sync. Exits non-zero on any failure.
- Matcher tuning that matters: city names need **contextual** evidence ("in/near/outside the {City}", "{City}, {State}") or two bare mentions — a bare single mention matched the season in "Spring and fall offer…" and linked `/locations/texas/spring`. Service profiles need `MIN_PROFILE_HITS` (2) because every post carries a stock sentence naming "a corporate retreat, a school expedition…" that otherwise fires on all 177.

### Status at end of the ingest step
**183 posts in `src/content/blogs/` (177 migrated + 6 original), 352 images in `public/blogs/`, build green at 422 static pages (was 203), `scripts/check-blogs.mjs` reports 0 failures.** Routes verified 200: `/blogs`, `/blogs/page/8`, `/blogs/state/alaska`, post pages. Sitemap core is now 302 URLs (was 80).
- **45 state archives**, not the 37 the old site's chip row showed — the title fallback recovered states the legacy site never tagged.
- Word counts 656 / 792 median / 986. Dates span 2024-01-15 → 2026-07-15.
- **Only the Anchorage post has had the prose/keyword pass** (`reviewed: true`). The other 176 are faithful ports with derived `planningLinks` and no in-body links yet. **`reviewed` is the guard that makes this safe** — `ingest-blogs.mjs` and `link-blogs.mjs` both refuse to overwrite a post with `reviewed: true` (use `--force` to override). A long-running ingest started before that guard existed silently destroyed a finished rewrite once; do not re-run the fetch stage while prose work is in flight.

### Further legacy-site findings (beyond MIGRATION-AUDIT)
- **29 posts render no state link at all.** State falls back to matching a state name off the end of the title, preferring the last-ending then longest match so "…Moundsville, West Virginia" resolves to West Virginia, not Virginia.
- **`field-of-dreams-dyersville-iowa` has no images on the legacy host** — both `-1.webp` and `-2.webp` return 404 while sibling images return 200. It uses a fleet photo as fallback; **the owner should supply a real image.** It is the only post affected.
- **Letterbox bars are dark grey (luminance ≈33), not black, and only ~85 of 352 images have them** — 267 are full-bleed photos. Detection keys on a row being FLAT (standard deviation < 4) as well as dark (mean < 60), capped at 30% off either edge so genuinely dark photographs survive. The Milky Way night-sky post is the test case: it must stay 1024×1024.
- **sharp cannot write to a file it is reading on Windows** — `renameSync` over the source throws EPERM. Read to a Buffer first, transform, then `writeFileSync`.
- Image dimensions are stored per image in the JSON and consumed by the components. The old hardcoded `1602×982` was wrong for blog images *and* for the fleet PNGs, which range 1536×1024 to 1774×887.

### Remaining work in this phase
1. **Prose/keyword pass on the other 182 posts** — the large remaining task. Per post: rework the opening to carry the primary phrase, impose `h2` structure (roughly half the corpus has none), add a vehicle-recommendation section and a logistics section, and place 5–6 in-body links. Anchorage is the worked pattern: 904 words, 6 `h2`, primary phrase in the first 100 words and in one `h2`, near-me phrase exactly once, 1.11% primary density.
2. Re-run `link-blogs.mjs` after each batch — writing a gateway city into the prose makes the linker pick it up (Arches currently falls back to Salt Lake City because the post never names Moab).
3. `relatedPostSlugs` is empty on `assateague-island-national-seashore-berlin-maryland` and `tulsa-oklahoma` (the legacy site showed them no related cards). Fill from the same state during the prose pass.
4. Lighthouse on `/blogs` and three sample posts (target ≥90).
