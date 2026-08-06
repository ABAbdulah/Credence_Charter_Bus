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

Verify with: `grep -rn "dummy" src/config/site.ts` (should return 0 lines once real values are in).
`url` MUST be the live domain before launch — canonicals, OpenGraph, and sitemap URLs all build from it.

### 2. Invented business claims — MUST VERIFY WITH OWNER (accuracy/legal risk)
Written as plausible marketing copy; none confirmed by the client. If any is untrue, edit the source file.
- **"24/7 dispatch" / "answers around the clock"** — `components/site/header.tsx` ("Call us anytime"), `app/contact/page.tsx`, `data/faq.ts`
- **Quote turnaround: "same day" / "within one business day"** — `app/quote/page.tsx`, `components/site/quote-form.tsx` (success panel), `data/blogs.ts`, city pages via `lib/variation.ts`
- **"Licensed & insured", driver vetting/rest claims** — `components/site/hero.tsx` trust list, `app/about/page.tsx`, `data/faq.ts`, `data/services.ts`
- **All-in pricing promise (driver, fuel, tolls, taxes included)** — repeated in `data/faq.ts` (strongest form: "the number you see is the number you pay"), `data/blogs.ts`, `components/site/cta-band.tsx` default lede, `lib/variation.ts` (all 16k city pages), about/home/quote/contact/blog CTAs. **Owner signalled 6 Aug 2026 that extras are not always included** — the claim was removed from `/fleet` (paragraph, CTA lede, meta description; "clear, itemized quote" instead), blogs keep it as advice ("ask for an itemized quote"). Every other surface still promises it; needs one explicit owner decision, then a sweep.
- **ADA/wheelchair-lift vehicles on request** — `data/faq.ts`
- **Wi-Fi, power outlets, restrooms, seat capacities per vehicle** — `data/fleet.ts` (`capacity`, `amenities`)
- **Cancellation policy + deposit terms** — `data/faq.ts`
- **Booking lead time "4–8 weeks"** — `data/faq.ts`, `data/blogs.ts`

### 3. Placeholder content — REVIEW
- **Blog post dates** (`data/blogs.ts`) — invented June–July 2026 dates; set real publish dates.
- **Blog author** — renders "By the {siteConfig.name} team"; swap if real bylines are wanted.
- **Locations dataset** (`data/locations/locations.json`) — now the full national set: 16,399 cities / 50 states + DC, built from GeoNames on 1 Aug 2026. **Attribution is a licence condition** (see SEO rules below) and is not yet on the site.
- **Fleet + service descriptions** — original copy written for this site (intentionally not copied from the model site); owner should approve wording.
- **Logo** — owner-supplied bus mark is live (see "Brand logo" below). The mark carries no company name, so `<Logo />` pairs it with the existing text wordmark; a real combined-lockup file from the owner would replace both.
- **Hero media** — falls back to `/fleet/charter-bus-exterior.png`; real image/video goes in `siteConfig.hero`.
- **Quote delivery** — `lib/quote-sender.ts` only logs to console. **Quote requests are NOT emailed anywhere until this is wired.** Highest-priority non-cosmetic gap before launch — now doubly so, since the home hero collects leads directly.

### 4. Confirmed real client data ✅ (do not change without owner)
- Address: 7901 4th St N, Ste 31686, St. Petersburg, FL 33702 (owner-supplied 6 Aug 2026, in `siteConfig.address`)
- `established: 2013`
- Stats: 12+ years, 500K+ passengers, 750+ cities, 15M+ miles
- 18 vehicle photos in `public/fleet/` (owner-supplied)

## Client directives (from owner's notes, 31 Jul 2026) — treat as binding
- **No USDOT/SAFER/DOT-number references anywhere (7 Aug 2026).** The owner does not want the site telling customers to verify operators via federal registries ("we don't provide this"). Removed from `how-to-rent-a-charter-bus` (verification paragraph rewritten around practical questions), `planning-a-school-trip-by-charter-bus` (USDOT dropped, insurance/CDL kept), and the affiliates page ("Valid DOT number"/"Valid MC number" requirement rows deleted). Do not re-add operator-verification copy.
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
- Primitives: `ui/` button (variants default/accent/outline/ghost; sizes default h-11, lg h-12, icon), card, container (max-w-6xl), section (Section/SectionHeading/RouteLine). Shell: `components/site/` logo (bus mark + wordmark lockup; `tone` prop for navy bg), header (sticky, nav via `src/config/nav.ts`), nav-links (client, aria-current + bronze underline), mobile-nav (client disclosure, Esc closes), footer (navy), call-bar (fixed bottom <md; body has pb-24 md:pb-0 to compensate), cta-band.
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
- `src/data/fleet.ts` — 9 FleetCategory entries (charter-buses removed 6 Aug 2026, see "Charter Buses category removed" below); images point to `public/fleet/*.png` (kebab-case, renamed from originals). Featured trio on home + city pages: motor-coaches, mini-buses, sprinter-vans.
- `src/data/services.ts` — 8 services (corporate, event, airport, sports, wedding, city tours, long-distance, school)
- `src/data/testimonials.ts`, `src/data/faq.ts` — home/FAQ content
- `src/data/blogs.ts` — blog preview stub (3 posts); Phase 4 replaces with full content layer
- `src/lib/quote.ts` — QuoteRequest type + validateQuote (shared client/server); `src/lib/quote-sender.ts` — QuoteSender interface, console stub is the swap point for email/CRM
- `src/data/locations/locations.json` — canonical state→city dataset: **16,399 cities across 50 states + DC** (2.7 MB). Regenerate with `node scripts/ingest-locations.mjs <cities.csv|json>` (columns: city,state,abbr,region,lat,lng,population; region must be Northeast/Midwest/South/West). `src/data/locations/index.ts` — typed accessors, haversine `nearbyCities()` (8 nearest, cross-state allowed), `locationsBuildConfig.prebuildCityLimit` (25 by population; the rest render on-demand via ISR) and `stateCityPageSize` (150 per page). State pages are **paginated**, not truncated: page 1 is `/locations/[state]`, pages 2+ are `/locations/[state]/cities/[n]`, so every city is reachable by clicking. Uncapped on one page, California was 575 KB of HTML with ~2,000 links; paginated it is 120 KB and max 7 pages. Pages 2+ are `noindex, follow` (`pageMetadata({ noindex: true })`) — they exist for humans and crawl paths, and every city is already in the sitemap, so they add no thin pages to the index. **The pagination segment is `cities`, not `page`** — "page" is a real city slug (Page, Arizona).
- **Source of the dataset:** GeoNames `cities1000` (`https://download.geonames.org/export/dump/cities1000.zip`), filtered to `country=US`, feature class `P`, and feature codes `PPL/PPLA/PPLA2/PPLA3/PPLC` only. **`PPLX` (neighbourhood sections like "Central 14th Street / WMATA Northern Bus Barn"), `PPLQ` (abandoned), `PPLS`, `PPLL` must stay excluded** — they produce absurd "Charter Bus Rental in …" pages. Also name-filter `(historical)`, mobile home parks, and courthouse annexes. Dedupe on the **slugified** name per state, not the raw name, or "St. Marys" and "St Marys" collide on one URL.
- `src/data/network/network-map.json` (22 KB) + `public/brand/network-map.svg` (animated) + `public/brand/network-map-still.svg` — the nationwide operations map on `/locations`. **All three are generated, never hand-edited:** `npm run network-map` (`scripts/generate-network-map.mjs`) renders the owner's fixed roster of **124 hubs (50 company / 74 partner)** and writes them. See "Operations network map" below.
- `src/lib/variation.ts` — deterministic copy variation for city pages: djb2 hash of `state/city` slug picks from template pools (12 openings × 10 details × 6 meta descriptions), plus a `scale` paragraph chosen by population tier (metro ≥250k / city ≥50k / town ≥10k / small) that quotes the real population and real distances to nearby cities. Facts differ per city, which is what keeps 16k pages from reading as one template. Add templates to increase spread; NEVER use Math.random (breaks stable rebuilds).
- ISR note: `export const revalidate` must be a LITERAL (Next static analysis) — it's `86400` at the top of both `/locations/[state]` pages; change it there, not via config import.

## Assets
- Vehicle images arrived during Phase 1: 18 PNGs in `public/` root, 9 types × ext/int (charter bus, motor coach, mini bus, sprinter van, party bus, school bus, stretch limo — filename typo "strecth", SUV, sedan). ~2MB+ each, ~1536×1024. Phase 2: move to `public/fleet/` with kebab-case names, map into fleet data model, serve via next/image (never raw — too heavy). Motor coach folds into the Charter/Coach category.
- Hero media: single swappable config value at `siteConfig.hero` (image or video).

## Home hero (rebuilt — full-bleed + inline quote form)

The old hero was a centred `max-w-6xl` column with a framed photo beside it. On a 1920px monitor that left ~310px of empty navy each side and the section read as under-filled; the only conversion path was a button to `/quote`.

Now: `Container size="wide"` (max-w-7xl), a **full-bleed backdrop** (`hero-media.tsx`), copy on the left, and `hero-quote-form.tsx` — a 6-field quote card — on the right. `Container` gained a `size` prop (`default` = max-w-6xl, `wide` = max-w-7xl); the hero is the only caller of `wide`.
- **`bg-primary` on the section + a `-z-10` backdrop = invisible photo.** A negative-z child paints *behind* its parent's background. The backdrop is plain `absolute inset-0` and the `Container` is `relative`; `bg-primary` stays on the section only as a pre-load fallback. Don't reintroduce `-z-10`.
- Two scrims, not one: a flat `bg-primary/88` below `lg` (text sits over the whole width when stacked) and `bg-linear-to-r from-primary/96 via-primary/92 via-65% to-primary/40` at `lg+`. The `via-65%` stop is load-bearing — see contrast below.
- Video still works unchanged via `siteConfig.hero.mediaType`; it just fills the backdrop instead of a framed box.

### Contrast over a photo — measure, don't eyeball
A photo backdrop **breaks the design system's "bronze on navy is 5.3:1" guarantee**, because the effective background is now the scrimmed photo, not the token. Measured worst-case over the bright coach/sky, the bronze eyebrow was **3.64:1 (fail)**. Raising the left scrim from `/95→/80` to `/96→/92 via-65%` brought it to 4.87:1; h1/subhead/trust are all 9:1+. Re-measure after any scrim, photo, or hero-copy change.
- Measure by hiding the text (`visibility:hidden`), screenshotting, and sampling the worst pixel under each text rect — then composite the text colour over it using its real alpha.
- **Tailwind v4 emits `oklab()` for `text-primary-foreground/85`.** A naive `/\d+/` regex reads `oklab(0.999994 …)` as RGB ≈ (1,0,0) and reports a bogus 1.36:1 failure. Read colours through a 1×1 canvas (`fillStyle` + `getImageData`), which returns sRGB + alpha.

### Headless screenshots lie about freshly-decoded images
`waitUntil: "networkidle"` fires **before the compositor paints a just-decoded image**, so `page.screenshot()` returns the hero as flat navy while `locator.screenshot()` of the same `<img>` shows the photo. This cost a wrong "the image isn't rendering" diagnosis. Always `await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))` before screenshotting. Confirmed by byte size: 7.4 KB (flat) vs 36 KB (photo present).

### Quick quote mode
`validateQuote(data, mode)` takes `QuoteMode = "full" | "quick"`. Quick drops the **email and tripType** requirements (email is still format-checked when present) so the hero card asks only date / passengers / pick-up / destination / name / phone. The API reads the mode via `toQuoteMode(payload)` from a `mode` key in the JSON body; anything other than `"quick"` is treated as `full`, so existing callers are unaffected. `Field` moved from `quote-form.tsx` to `ui/field.tsx` and is shared by both forms.

## Fleet photo grading

`npm run fleet-photos` (`scripts/grade-fleet-photos.mjs`). **`assets/fleet-source/` holds the pristine owner originals; `public/fleet/` is generated** — never edit `public/fleet/` by hand, and never grade in place (re-running would compound the correction). Paths and filenames are unchanged, so `data/fleet.ts`, `seo.ts`, `jsonld.tsx` and the 14 blog image refs needed no edits.
- Exteriors are graded; **interiors are byte-copied**. The party bus interior is deliberately purple and the cabins deliberately dim — neutralising them would erase the product. Byte-identical copies also mean git dedupes them, so only the 9 graded exteriors cost new blobs.

### No padding — the card box is 2:1 (settled 6 Aug 2026, owner rejected three pad attempts)
Sources run **1.5:1 to 2:1** (`motor-coach` 1774×887 is the widest; `coach-bus`/`party-bus`/`sprinter-van` are 1672×941). The old 3:2 card box could not hold a 2:1 photo, and every attempt to synthesise the missing height failed on sight:
1. mirrored sky on top → trees, lamp posts and buildings smeared across the top of every card;
2. mirrored pavement on the bottom → pavement markings and vignette reflected back as a dark band;
3. a 40px bottom sliver stretched and blurred → still an obvious blurred quarter.
**The fix is geometric, not cosmetic: `padToCardAspect` is deleted and the card box is `aspect-2/1`.** 2:1 is the widest source, so object-cover only ever trims sky and pavement — **no vehicle can lose its front or rear at any breakpoint**. Interiors (down to 1.33) lose up to 33% of their height; verified per-image that cabins, seats and dashboards all survive. Do not reintroduce padding, and do not narrow the box below 2:1 — 16:9 crops 11% off the motor coach's width, which clips the bus.
- The box lives in three places that must move together: `fleet-card.tsx`, `frameClass` + thumbs in `fleet-gallery.tsx`, and the About photo in `app/about/page.tsx`. Their `width`/`height` props are the box ratio (1600×800), not any one file's size.
- Output dimensions now equal the pristine source exactly, which is the cheap regression test: `public/fleet/*.png` dims must match `assets/fleet-source/*.png`. Any inequality means padding crept back.
- Blog JSONs store per-image `width`/`height`; removing the pad changed 7 of them (1774×1183→1774×887, 1672×1115→1672×941). Sync from disk and re-run `npm run blog-index`, or cards and OG tags go stale.

### The dev-server image cache will lie to you
**`next dev` serves stale optimized images from an in-memory cache that survives both deleting `.next/cache/images` and a normal server restart.** After regenerating fleet photos the server kept returning the old geometry with `X-Nextjs-Cache: HIT` and a byte count identical to the pre-change response — this is what made three rounds of "still blurry" look like a failed fix when the files on disk were already correct. **Verify by aspect ratio, not by eye:** fetch `/_next/image?url=…&w=…` and compare `width/height` against the source file. To actually clear it, stop the server, `rm -rf .next`, then start. A browser hard-refresh does not help, because the stale bytes come from the server.
- **Grey-world white balance was wrong here and was reverted.** It read the blue sky reflected in the *white* coach as a cast and turned the paint cream, and forcing every photo to a common mean washed out the black vans — a photo of a black vehicle *should* be darker. The shipped grade is per-channel black/white points (0.5/99.5 percentile → 6/249, at 0.6 strength) plus a **midtone-weighted** cast correction (`4t(1-t)`, zero at both ends) and 0.9 saturation. Worst cast 28 → 18, brightness spread 69–128 → 92–120.
- Ceiling worth knowing: a LUT cannot make a sunny blue-sky shot match a grey overcast one. The residual mismatch is a *content* difference. If it still reads inconsistent, the fix is tighter crops or a reshoot, not more grading.
- **PNG re-encode is larger than the source** (2.01 MB → 2.44 MB), so output stays PNG at native size. WebP would be ~179 KB (11×) but would change ~35 image paths including blog JSON that `check-blogs.mjs` validates — deferred, not done.

## Charter Buses category removed (6 Aug 2026) — owner request

The Charter Buses card (40–56) duplicated Motor Coaches (50–56) + Coach Buses (40–45) and was cut; the fleet is 9 categories. Motor Coaches inherited `featured: true`. Coach Buses got its own owner-supplied exterior (`assets/fleet-source/coach-bus-exterior.png`, renamed from "40-45 coach bus.png"; graded + padded to 3:2 by `npm run fleet-photos`) instead of borrowing the motor-coach photo; the interior is still the shared motor-coach shot.
- `/fleet/charter-buses` 308s to `/fleet/motor-coaches` — the slug is now an alias under `fleetAliases` in next.config.ts. Never re-introduce a category with that slug without removing the alias first.
- All 225 blog references (planningLinks + in-body markdown links across 183 JSONs) were repointed to `/fleet/motor-coaches`; `link-blogs.mjs` (FLEET_LABELS key + default fleet pick) updated to match, so re-runs stay consistent. `check-blogs.mjs` validates fleet hrefs against fleet.ts slugs, so any stragglers fail the gate.
- **`/fleet/charter-bus-exterior.png` and `-interior.png` must stay in `assets/fleet-source/`** — the category is gone but the home-hero fallback (`hero-media.tsx`) still uses the exterior.
- The `/fleet` intro paragraph was verbatim Vanguard copy; rewritten keeping the keyword targets ("charter bus rental near me", "luxury charter bus", the 50-states `/locations` link). Deliberately NOT hidden-text/cloaked — that risks a penalty. Lede now reads "Nine vehicle types". The SEO box now sits **below** the card grid (user choice, 6 Aug 2026 — cards first for users, copy still indexed) and carries no all-in-pricing claim. JSX gotcha hit here: a same-line space after `</strong>` was dropped by the compiler (only place site-wide) — use `{" "}` separators after inline elements and verify emitted HTML with `grep -rhoE "</(strong|a|em)>[a-z]{2,}" .next/server/app --include="*.html"`.
- Smoke-test gotcha (cost a wrong diagnosis): a leftover `next start` from an old session was still listening on the test port. With output discarded, a new `next start` dies silently on EADDRINUSE, and the stale server both serves old code and **writes stale on-demand renders into the fresh `.next`**. Check the port before curling, and delete any `.next/server/app` files a stale server minted.

## Brand logo

Owner supplied `public/logo.png` — a 900×900 bus mark on a flat cream canvas, **no company name in it**. `npm run logo` (`scripts/prepare-logo.mjs`) is the only thing that may write the derived files; all three are generated, never hand-edited:
- `public/brand/logo-mark.png` (497×304, transparent) — used by `<Logo />`
- `src/app/icon.png` (512) + `src/app/apple-icon.png` (180) — Next file-convention favicons, which replaced the stock create-next-app `favicon.ico`

### Why the background removal is a flood fill, not a colour key
**The bus body is filled with the same cream as the canvas** (rgb 250,236,203 vs 251,238,202). A global colour key erases the vehicle and leaves a floating outline. The script instead floods inward from the border, so only background *connected to the edge* is cut. Do not "simplify" this to a colour key.
- Edge pixels get graded alpha plus un-premultiplication (`ALPHA_LOW`/`ALPHA_HIGH`), which is what keeps a cream halo off the navy footer. Verified by compositing on magenta, not assumed.
- The retained body cream is remapped to the site cream `#F7F5F0` (`BODY_MATCH`). Without it the warm original reads as a yellow patch on the cream header. This is why the mark works on both cream and navy unchanged — there is no light/dark variant.

### Favicon is navy, the mark is not
`squareIcon` puts the mark on navy, not on the logo's own cream: at 32 px the cream-on-cream line art greys out into an unreadable smear (checked at 16/32/48). Navy holds the silhouette. The mark is a 1.63:1 horizontal badge, so it can never fill a square icon — if the tab icon needs to be stronger, the fix is a separate monogram, not more cropping.

### Lockup + the 320px constraint
`<Logo />` is mark + wordmark because the supplied art has no company name. The mark adds ~74 px, which **overflowed the 320 px header** (348 > 320) — hence `max-[360px]:hidden`, dropping the mark below 360 px while every other width keeps it. Re-run the responsive overflow audit if the lockup, header gaps, or the Menu button change.

## American English — audited clean 7 Aug 2026

US audience, US spelling everywhere. The 177 migrated posts arrived with British forms; a full sweep of `src` (blogs, data, components, pages) plus all 438 rendered HTML pages fixed **85 instances**: `amidst`→amid (35), `queue/queues/queuing`→line (15), `towards`→toward, `car park(ing)`→parking lot/parking, `backwards/forwards/upwards`→backward/forward/upward, plus `ploughing`, `rubbish`, `kerbside`, `fortnight`, `anticlockwise`, `compartmentalisation`, and `north-east`/`south-west`-style hyphens→closed up (regions capitalized: "the Northeast").
- **`torch` was the sleeper.** Four cave/night-sky posts used the British sense for flashlight ("phone torches", "red-filtered torches"). Spell-checkers never flag it because `torch` is a real English word. Re-check this one by hand on any new caving/stargazing copy.
- **Do NOT "fix" these — they are correct:** proper names keep their given spelling (`Mount Washington Cog Railway`, `Alabama Theatre`, `Miller Outdoor Theatre`), and **real US place names** in `locations.json` legitimately contain British-looking strings — Centre AL, Rockville Centre NY, Sauk Centre MN, Centre Hall PA, Bal Harbour FL, Indian Harbour Beach FL, Aquia Harbour VA. A blind find-and-replace over locations data would corrupt live city URLs.
- Also verified as correct American usage, not errors: `pavement` (road surface), `flat` (level/salt flats), `lift` (wheelchair/ski lift), `holiday`, `film`, `autumn`/`autumnal`, `timetable`.
- Re-verify by scanning **rendered HTML**, not just source — `index.json` is generated, so a source-only pass leaves stale copy in cards and meta descriptions until `npm run blog-index` runs.

## SEO rules
- Every route: Metadata API title/description/canonical/OpenGraph. Canonicals self-referencing.
- JSON-LD: Organization/LocalBusiness site-wide; Service, BreadcrumbList, FAQPage, Article per page type.
- Location pages must be substantive (unique tokenized intros, nearby-city links, fleet/services blocks) — no thin doorway pages.
- Sitemap index shards location URLs ≤50k per child sitemap; robots.txt. Currently 16,399 location URLs (one shard) + 80 core URLs.
- **GeoNames attribution is outstanding.** The city dataset is CC BY 4.0, which requires visible credit. Add a line such as "City data © GeoNames, CC BY 4.0" to the footer or `/locations` before launch — this is a licence obligation, not a nicety.
- **Scaled-content risk is live now.** 16k programmatic city pages is the exact pattern Google's scaled-content-abuse policy targets. Mitigations in place: per-city population and real inter-city distances in the copy, a 4-tier scale paragraph, and 720 body-template combinations. If rankings stall or pages get deindexed, the fix is fewer/better pages (raise the population floor in the prep step), not more templates.

## Operations network map (`/locations`)

Marketing visualisation of the existing 16,399-city directory, shown as the owner's fixed roster of 124 hubs. It does **not** replace the location pages — every hub links to its real city page, and the full state/city browser still sits below it.

### Why the map is an `<img>`, not inline SVG
Rendering the SVG from a server component put ~180 KB of path data in the HTML **and again** in the RSC flight payload: `locations.html` was **869 KB**. Serving the same SVG as a static asset dropped it to **274 KB (23 KB gzipped)** with the map cached separately at ~55 KB gzipped. LCP 1.9 s / CLS 0 at 4× CPU + 1.6 Mbps. **Do not move the map back inline.**
- Consequence: the SVG cannot read CSS variables, so `COLOR` in the generator mirrors the `globals.css` tokens. The site is light-only by design, so this is safe — but a token change needs a re-run.
- Responsive behaviour lives *inside* the SVG: media queries in an `<img>`-embedded SVG resolve against the **image's rendered width**, not the viewport. `@media (max-width:820px)` hides hub/state labels and enlarges the dots. That is why there are no Tailwind breakpoints on the map itself.
- Labels use `system-ui`, not Source Sans 3 — an `<img>` SVG is an isolated document and cannot load the page's webfont.

### Hub roster — owner-supplied verbatim (revised 6 Aug 2026), no longer algorithmic
- `COMPANY_HUB_IDS` (50) and `PARTNER_HUB_IDS` (74) in `scripts/generate-network-map.mjs` are the owner's list, entered verbatim as `state/city` slugs. The earlier two-phase clustering (45k market floor, separation thresholds, gap-fill, one-hub-per-state guarantee, `snapToLocalAnchor`, military filter, metro-ranked company split) is **retired code — do not re-derive the roster or the split**. Edits to either list go through the owner.
- Resolution is fail-fast: an id missing from `locations.json` throws at generate time. Slug gotcha: the owner's "New York" is `new-york/new-york-city` in the dataset; "St. Louis" is `missouri/st-louis`; "Washington, DC" is `district-of-columbia/washington`.
- Metro weights (25-mile population rollup) are still computed — `weight` drives label priority and JSON ordering, nothing else now. The `kentucky/meads` bad-population record (288,649 for a ~7k CDP) no longer needs excluding — no hub is within 25 mi — but the dataset bug itself remains and still affects `/locations/kentucky/meads`.
- Consequences of the fixed roster, accepted as owner intent: **Mississippi is the one state with no dot** (the 6 Aug revision added hubs in ME, NH, VT, WV, MT, WY, ND, SD; a 16-hub gap-fill pass was applied same day and then removed at the owner's request — the roster is only ever what the owner supplies), and city coverage within 100 mi of a hub is 86.5% (was ~100% of 45k+ markets under the algorithmic roster). The map description does not claim all-states coverage.
- Rings: radius = mean distance to the 2nd/3rd nearest hub, clamped 78–230 mi, so they always overlap. The mainland ring layer is **clipped to the national outline** — unclipped, the ocean bleed made the coastline mushy.
- **Coverage is a base wash + weak rings, not rings alone.** `BASE_COVERAGE_OPACITY` (0.34) fills the national outline under the ring layer, and the ring gradients are correspondingly weak (0.085 → 0.07 → 0.02 company, 0.09 → 0.075 → 0.022 partner). Rings-only shipped once and the owner rejected it: northern Montana, Aroostook County, the Oregon coast and south Texas read as unserved. **They were never outside a ring** — Havre sits at 67% of Great Falls' radius, Presque Isle at 70% of Bangor's. One ring at 0.14 opacity just cannot compete with the eight that stack over Ohio, so the fix is contrast, not reach: measured mean land luminance went 205/200 (N Montana / N Maine) against 168 (Ohio), and is now 177/174 against 158 — spread 37 → 19, with unserved cream at 244. Verify any change to these numbers by sampling land pixels per region, not by eye.
- Do not "fix" this by raising the base alone — it lifts sparse and dense together and leaves the same contrast. The rings have to come down as the base goes up.
- A steep ring falloff turned the overlapping discs into one solid blue field with no readable service areas; that is why the gradients stay near-flat.
- Label placement tries 8 positions per hub and rejects collisions against other labels, every hub dot, and the AK/HI inset panels. `labelOrder` already puts company hubs first (then by weight), so an unlabelled company hub means its dot is physically boxed in, not out-prioritised. **112 of 124 currently place.** Unlabelled: **Raleigh (company)** plus Jersey City, Anaheim, Santa Ana, Riverside, Santa Barbara, Ann Arbor, Chapel Hill, Knoxville, Pigeon Forge, Asheville, State College (partner) — all boxed in by dense clusters the roster creates (six hubs in the LA basin; Gatlinburg/Pigeon Forge are 5 mi apart; Jersey City is 2 mi from the NYC dot). Raleigh lost its label when Greenville NC was added on 7 Aug 2026 — Durham and Chapel Hill already flanked it and Greenville took the last free position. Fixing these needs leader lines or abbreviated labels, not more placement candidates.

### Animation — and the reduced-motion trap
Company hubs blink (2.6 s) with an expanding "ping" halo; partner service areas pulse in opacity (8 s) while the shared `#ring-partner` gradient slowly shifts `stop-color` (11 s). All delays are **staggered by longitude** (`wave()`), so it reads as one slow wave crossing the country instead of 99 independent flickers. Costs ~6.5% of one core on desktop; well under the WCAG three-flashes-per-second threshold.

**Chrome does NOT propagate `prefers-reduced-motion` into an `<img>`-embedded SVG** — the media query inside the file is simply never satisfied, so motion-sensitive users kept getting the animation. Verified, not assumed. The fix is `<picture>` with `<source media="(prefers-reduced-motion: reduce)" srcset="…-still.svg">`: the **page** evaluates that query, and only one file is ever downloaded. This is why the generator emits two SVGs. **Do not collapse them back into one** — the in-SVG `@media` block alone does nothing here, and it only stays in the animated file for browsers that open the SVG directly.

### Company/partner split — owner-fixed, fourth revision
The written brief asked for 20–30 company hubs; the owner revised the split twice (landing at 70/76 algorithmic), replaced selection with an explicit 40/59 roster on 5 Aug 2026, then revised it again on 6 Aug 2026 to the current 40-company / 74-partner list. The 6 Aug revision moved Riverside, Anaheim, Newark and Virginia Beach to partner, promoted Raleigh, Pittsburgh, Cleveland, Cincinnati and Milwaukee to company, dropped San Jose, New Haven, Trenton, Wilmington, Huntsville, Montgomery, Shreveport, Lubbock, Corpus Christi, McAllen, Brownsville, Stockton and Toledo, and added 28 partner cities — college towns (State College, Ann Arbor, South Bend, College Station, Chapel Hill, Durham, Tempe, Boulder), tourism markets (Branson, Gatlinburg, Pigeon Forge, Myrtle Beach, Savannah, Asheville, Key West, Park City, Palm Springs, Santa Barbara), and the formerly-empty states (Portland ME, Manchester NH, Burlington VT, Charleston WV, Fargo, Sioux Falls, Billings, Missoula, Cheyenne, Casper). A same-day 16-hub gap-fill pass (Bismarck, Bangor, Jackson MS, Biloxi, Great Falls, Rapid City, Amarillo, Lubbock, Corpus Christi, McAllen, Idaho Falls, Bend, Eugene, Saint George, Duluth, Green Bay) was added and then **removed at the owner's request — never re-derive or gap-fill the roster; it is only ever what the owner supplies**. (Slug gotcha kept for reference: it is `utah/saint-george`, not `st-george`.) The split is part of the supplied list, not derived. Do not "correct" any of it without the owner.

**7 Aug 2026 — owner added 10 company hubs** (company 40 → 50, total 114 → 124): Bozeman, Rapid City, Santa Fe, Huntsville, Corpus Christi, **Greenville NC**, Fayetteville AR, Duluth, Amarillo, Lubbock. Six of these were in the rejected gap-fill pass and are now owner-sanctioned as *company*, not partner — coverage rose 84.9% → 86.5%. **`north-carolina/greenville` is a distinct hub from the existing partner `south-carolina/greenville`**; both render, so "Greenville" appears twice on the map by design. Slug gotchas: `arkansas/fayetteville` (not the NC one), `montana/bozeman`.

### Palette: red company hubs, and the green the references wanted
- **Company hubs are `--map-company: #a82c31`** (deep crimson), dot radius 5 vs the partner 3.4, so they read first. Chosen over a pure red because the design system bans saturated red; over `--destructive` because that token stays semantic for error states. Their coverage **rings stay navy** — translucent red over the blue partner field turns purple where they overlap, and the coverage wash has to stay one coherent colour. Hub *labels* also stay navy: 40 red labels at 9.6px would read as alarm, not emphasis.
- The references use **green** for partner hubs. Green is banned by the owner's palette note, so partner hubs are bronze dots (`--accent`) with mid-blue coverage rings (`--map-coverage: #3d6193`). Still worth confirming with the owner — it is the one place the design departs from the supplied references.

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
- **Next 16 `images.qualities` is mandatory.** Any `quality` prop not listed in `next.config.ts` makes `/_next/image` return **400 "q parameter (quality) of N is not allowed"** — the hero uses `quality={50}`, so the home page's LCP image was silently broken in production, and in dev the repeated optimizer failures killed the worker (`write EPIPE` → `Jest worker encountered 2 child process exceptions`, which surfaced as a Runtime Error overlay on unrelated pages such as `/services/[slug]`). Config now declares `qualities: [50, 75]`. **Adding a new `quality` value anywhere means adding it there too**, and the dev server must be restarted for the change to load.
- **Perf measurement gotcha:** the FIRST Lighthouse run after `npm run start` scores ~3 points low because `next start` optimizes the 2MB source PNGs on demand (cold cache). Always discard run 1 or take a median. On Vercel these are pre-optimized + CDN-cached, so the warm number is representative.
- Home LCP is the hero `<h1>` (~3.4s local, render-delay bound), not the image. If real-world perf needs more headroom, the highest-leverage fix is shrinking the source PNGs in `public/fleet/` (currently ~2MB each) — not more code changes.
- QA verified: 97-page link crawl all 200, zero Vanguard tokens, PLACEHOLDER only in site.ts, logo auto-swap tested both directions.

## Phase 9 — blog migration (in progress)

Ports the 177 destination guides from the legacy site. Target end state was **183 posts** (177 migrated + the 6 original how-to posts); the corpus is now **192**: 188 after the 6 Aug 2026 keyword expansion added 5 original posts (see "SEO keyword expansion" below), plus 4 destination posts added 7 Aug 2026 to fill tourist-coverage gaps (see "Destination gaps + blog imagery" below). Briefs: `MIGRATION-AUDIT.md` §2, `BLOG-MIGRATION-BRIEF.md`.

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

### SEO layer (added after the ingest — applies to all 183 posts)

- **`seoTitle` is a separate field from `title`.** `title` stays the destination name (it is the `h1` and the card label); `seoTitle` is what `generateMetadata` puts in the `<title>` tag, so it can carry "Charter Bus to …" without turning every `h1` into a keyword string. It falls back to `title` when absent. Written by the prose pass, surfaced through `index.json`.
- **`scripts/build-blog-index.mjs` is the only writer of `index.json`.** `ingest-blogs.mjs` imports `buildBlogIndex()` from it rather than keeping its own copy, so the index can be rebuilt (`npm run blog-index`) after hand-edits without re-running the fetch stage. Editing a post JSON without rebuilding the index means the card/meta text goes stale — `check-blogs.mjs` catches the count drift but not per-field drift.
- **`check-blogs.mjs` is now an SEO gate as well as a structural one** (`npm run check-blogs`). `seoIssues()` encodes the per-post standard: `seoTitle` ≤60 chars with a primary phrase, excerpt 70–160 chars with a primary phrase and no ellipsis, primary phrase inside the first 100 words, ≥4 `h2` with one carrying the phrase, ≥800 words, ≥2 in-body fleet links + ≥1 service + ≥1 location + `/quote`, "near me" at most once, alt text that is not just the title and not shared between the two images, ≥2 related posts. It **hard-fails only on `reviewed: true` posts** and reports the rest as a ranked backlog, so the corpus can be finished in batches without the gate going red. `reviewed: true` therefore now means "meets the SEO standard", not just "prose was reworked".
- **OG image dimensions were wrong for every blog post.** `pageMetadata()` hardcoded `1602×982` for any caller-supplied `ogImage`, while blog heroes are 1024×602 and fleet photos range up to 1774×887. `ogImage` now takes optional `width`/`height`; the blog route passes the real ones. Fleet still falls back to the default, which is unchanged behaviour.
- JSON-LD: post pages emit **`BlogPosting`** (was bare `Article`) with an `ImageObject[]` carrying real dimensions, `wordCount`, `articleSection`, `dateModified`, `inLanguage`, and `author`/`publisher`/`isPartOf` as `@id` references. `/blogs` emits `Blog` + `ItemList` + `BreadcrumbList`; state archives add `ItemList`. Helpers `blogJsonLd`/`itemListJsonLd`/`blogId` live in `lib/jsonld.tsx`.
- `wordCount()` was extracted in `lib/blog-format.ts`; `readingMinutes()` now calls it.

### Four posts were filed under the wrong state (fixed, now gated)

The legacy site's own state tag was wrong on four posts and the ingest trusted it over the title:
`mount-washington-new-hampshire` → Washington · `kansas-city-missouri` → Kansas · `west-virginia-penitentiary-moundsville-west-virginia` → Virginia · `washington-dc` → Washington.
So **`/blogs/state/west-virginia` and `/blogs/state/district-of-columbia` did not exist at all**, and three archives carried posts about other states. `check-blogs.mjs` now hard-fails when a title's trailing state name (longest match, so "West Virginia" beats "Virginia") or trailing `, XX` abbreviation disagrees with the assigned state. Archive count went 45 → 47, build 424 → 426 pages. `stateFromTitle()` in `ingest-blogs.mjs` was never the bug — it is correct; the primary path that reads the legacy tag is what needs the cross-check on any future re-ingest.

### SEO keyword expansion (6 Aug 2026) — owner-supplied keyword list

The owner supplied a keyword document (SEO.pdf: primary / services / vehicle / vehicle+service / modifier / near-me clusters). Coverage was mapped against the site and the gaps were filled — **spread naturally, never stuffed** (the 16k-city scaled-content risk above makes stuffing actively dangerous).

- **5 new original posts, all `reviewed: true` and passing the full SEO gate** (SEO complete is now 51/188): `how-much-does-it-cost-to-rent-a-charter-bus` (pricing/cost cluster — dollar figures are deliberately illustrative, no invented rate card, "itemized" not "all-in" per the open owner question), `how-to-rent-a-charter-bus` (rent/book/hire cluster), `charter-bus-sizes-seating-capacity-guide` (56-passenger/capacity + Wi-Fi/restroom/reclining amenity clusters — capacities match `fleet.ts` verbatim; restroom claimed only for motor coaches because the coach-bus amenity list has none), `wheelchair-accessible-charter-bus-rental` (ADA cluster — mirrors the FAQ's "available on request" wording, no stronger promise), `church-group-transportation-guide` (church cluster, previously zero coverage site-wide). Dates 22 Jul–5 Aug 2026, so they are the 3 home-page blog previews. The 6 older originals' `relatedPostSlugs` were reshuffled to link the new posts reciprocally.
- **Metadata keyword pass on core pages** (visible copy untouched): fleet index title "Our Fleet" → "Charter Bus Rental Fleet — Coaches, Mini Buses & Vans"; fleet category titles are now `{Vehicle Name} Rental — {capacity}` with a templated "Rent a/an {vehicle}…" description (derived in `generateMetadata`, no data change); `services.ts` gained a required `seoTitle` per service (e.g. "Airport Shuttle Service & Group Airport Transfers", "School Bus Rental for Field Trips & Student Travel") used only in the `<title>` — `name` still drives the h1/JSON-LD; quote page → "Get a Free Charter Bus Quote" (description now says "itemized", dropping "all-in" in line with the fleet-page precedent); FAQ → "Charter Bus Rental FAQs".
- `check-blogs.mjs` `staticPaths` gained `/how-to-book` (page existed but predated the checker; the how-to-rent post links it).
- Remaining unplaced clusters (deliberate): "entertainer/sleeper coach" (fleet doesn't offer them — do not add copy for vehicles we can't supply), government/military/nonprofit/senior service niches (candidates for future posts or services), "cheap/affordable" beyond the cost post (kept minimal — discount language conflicts with the trust brief).

### Destination gaps + blog imagery (7 Aug 2026)

**4 new destination posts, all `reviewed: true` and passing the gate (SEO complete 55/192):** `chicago-illinois`, `mount-rushmore-south-dakota`, `gettysburg-pennsylvania`, `philadelphia-pennsylvania` — the four most prominent group destinations the 177-post legacy corpus never covered. Dated 9–18 Jul 2026 **deliberately before 22 Jul** so the 3 home-page previews (the keyword posts) are not displaced. Each carries real operational fact (Needles Eye tunnel 8'4" — coaches can't take Needles Hwy; Licensed Battlefield Guides board the bus at Gettysburg; Independence Hall is timed-ticket; Columbus Drive drop for Millennium Park). **Still-unfilled gaps, in priority order:** Minnesota, Wisconsin, Arkansas have ZERO posts (Mall of America, Wisconsin Dells, Hot Springs are the natural firsts); Bryce Canyon (Utah "Mighty 5" incomplete), Everglades, Grand Teton, Baltimore Inner Harbor, Hershey PA.

**Blog imagery: zero duplicate images corpus-wide now.** The 11 original posts + field-of-dreams all shared the 9 fleet photos (3 posts had the identical motor-coach hero — the user flagged it). 12 posts now have distinct topical CC0 heroes; `sizes-guide` and `vs-mini-bus` keep fleet photos (topical, and unique after the reshuffle). Sourcing pipeline (no API keys exist in this env — Pexels and Gemini AI generation both need keys the user would have to supply):
- **Openverse API** (`api.openverse.org`, keyless) filtered to `license=cc0,pdm`; best sources are **stocksnap** and **rawpixel** (incl. Carol M. Highsmith / LOC and NPS public-domain photos). Flickr `url`s are clean.
- **rawpixel `image_1300` URLs are WATERMARKED; `editor_1024` (what Openverse indexes) is clean.** Never ship an `image_1300` without eyeballing it.
- Highsmith photos are also fetchable clean + full-res from LOC (`loc.gov/item/{id}/?fo=json` → tile.loc.gov files).
- Field-of-dreams now uses Highsmith's ghost-players photo — the "owner should supply a real image" gap above is closed.
- **Provenance table: `assets/blog-image-sources.md`** — every non-fleet blog image with source URL + license. Add rows when adding images.

### Remaining work in this phase
1. **Prose/keyword pass — 55 of 192 done.** Complete: the 6 how-to originals, Anchorage, and all of California (13), Pennsylvania (7), Massachusetts (7), Virginia (6), Washington (6, incl. the DC post). Per post: `seoTitle`, a written meta description, descriptive alt text on both images, an opening carrying the primary phrase, imposed `h2` structure (roughly half the corpus has none), a vehicle-recommendation section, a logistics section, and 5–6 in-body links. `npm run check-blogs` prints the exact remaining issue counts — work to zero.
   - **Word count is the trap.** Drafts that feel like 900 words land at 550–780, consistently ~25% short of estimate. Every batch so far has needed a top-up round to clear 800. Measure, never estimate; write 9–10 sections up front rather than 7.
   - Batch workflow that works: read the posts compactly (first paragraph + h2 list + extracted proper nouns), verify every city slug against `locations.json` *before* writing, emit one JSON patch keyed by slug, apply with a transactional merge script, run `check-blogs`, top up what fails.
   - The patch applier must validate all markers **before** writing any file — a mid-batch throw otherwise leaves half the posts rewritten and the index stale.
   - What makes these rewrites defensible against the scaled-content risk is per-destination operational fact, not more templates: Death Valley's 25-foot limit on Artist's Drive and Dante's View, Mary's Rock Tunnel's 12'8" clearance on Skyline Drive, commercial-vehicle permits on the Blue Ridge Parkway, buses banned on Lombard Street and on Storrow Drive, Devils Postpile's mandatory shuttle, the ferry-vs-coach decision for Nantucket/Martha's Vineyard/San Juans, Salem's October road closures. Several of these **correct outright errors in the legacy copy** (the old Death Valley post claimed coach parking was "well-accommodated at all major attractions").
2. Re-run `link-blogs.mjs` after each batch — writing a gateway city into the prose makes the linker pick it up (Arches currently falls back to Salt Lake City because the post never names Moab).
3. 14 posts have fewer than 2 `relatedPostSlugs`; `assateague-island-national-seashore-berlin-maryland` and `tulsa-oklahoma` have none (the legacy site showed them no related cards). Fill from the same state during the prose pass.
4. Lighthouse on `/blogs` and three sample posts (target ≥90).
