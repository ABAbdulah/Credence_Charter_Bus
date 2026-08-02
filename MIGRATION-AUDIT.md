# Migration audit — vanguardcharterbus.com → Credence Charter Bus

**Audited:** 2 Aug 2026 · **Old site:** https://vanguardcharterbus.com (Next.js, no JSON-LD, no OG tags) · **New site:** this repo

## How this audit was done

Read the old site's `sitemap.xml` (4,888 URLs) and crawled its pages directly. The host is slow and rate-limits aggressively — `/`, `/fleet`, `/services`, `/locations`, `/blogs`, `/about`, `/about/driver` returned in under a second (pre-rendered); every other route either 503'd or hung past a 110-second timeout. Everything below marked **[not captured]** is confirmed to exist (it is in the sitemap or linked from a captured page) but its body copy still has to be pulled before it can be ported.

---

## 1. Scorecard

| Area | Old site | New site | Gap |
|---|---|---|---|
| Blog posts | **177** | 6 | **171 missing** + 177 hero images |
| Blog state filter / archives | Yes (37 states) | No | Missing |
| Location city pages | ~30,261 (dirty data) | 16,399 (clean) | URL shape differs; dataset differs |
| Location state pages | 50 | 51 (+DC) | URL shape differs |
| Fleet category pages | 10 | 8 | 2 missing (`motor-coach`, `coach-bus`) |
| Fleet vehicle detail pages | 9 | 0 | **Whole route level missing** |
| Service pages | 8 | 6 | 2 missing (`city-tours`, `long-distance-charter`) |
| Legal pages | 3 (privacy, terms, refund) | 0 | **All 3 missing** |
| Driver careers + application | Yes | No | Missing |
| Affiliate program | Yes | No | Missing |
| Booking tutorial | Yes | No | Missing |
| Tour bus booking form | Yes (own route + nav item) | Folded into `/quote` | Decision needed |
| Newsletter signup | Yes (footer) | No | Missing |
| Contact form | [not captured] | No form, cards only | Likely missing |
| Reviews page | Yes | No | **Intentional** — owner said cut |
| Social links | 4 icons (all `href="#"`) | No | **Intentional** — owner said none |
| JSON-LD / OpenGraph / canonicals | None | Full | New site ahead |
| Sitemap index / robots | Flat sitemap | Sharded index + robots | New site ahead |

**Total route gap: roughly 200 pages** (171 blogs + 9 fleet detail + 2 fleet category + 2 service + 3 legal + 4 about/forms + blog archives), before the locations question is settled.

---

## 2. Blogs — the single biggest gap

### What exists on the old site

177 destination guides at `/blogs/{slug}`, each with a hero image at `/blogs/{Title-Case-Slug}-1.webp`, tagged by state, filterable on `/blogs` by a 37-state chip row. Titles are place names ("Acadia National Park, Maine", "Cadillac Ranch, Texas", "Rock and Roll Hall of Fame – Cleveland, Ohio"). Copy is long-form and opens with a hook ("Imagine standing beneath a colossal arch carved by millennia of wind and water…").

The new site has 6 posts, all how-to/planning content (`how-to-rent-a-charter-bus-for-a-wedding`, `charter-bus-vs-mini-bus`, …). **Zero overlap** — these are two different content sets. The 6 existing posts should stay; the 177 are additive.

Full slug/title/image list: [Appendix A](#appendix-a--all-177-blog-posts).

### Two problems to resolve before porting

1. **Brand scrubbing is mandatory.** Post bodies name the old brand inline — e.g. the Anchorage post reads *"Here at Vanguard CHARTER BUS, we believe Anchorage isn't just a sto…"*. `CLAUDE.md` rule: no Vanguard references may ship. The ingestion script must rewrite these, and the final QA token scan has to pass on 177 new files.
2. **This contradicts an earlier owner directive.** `CLAUDE.md` records: *"Fleet/services/blogs/about copy: must be reworded away from the model site."* The instruction now is to copy the blogs across. Ported verbatim, the two sites hold identical content — if vanguardcharterbus.com stays live, that is duplicate content and Google will pick a winner, probably the older domain. **Either the old domain 301s to the new one at launch, or the old posts get de-indexed, or the copy gets rewritten.** Flagging this rather than deciding it.

### Architecture

`src/data/blogs.ts` currently holds 6 posts inline as a TypeScript array — roughly 350 lines. 177 long-form posts in that shape would be a multi-megabyte module parsed on every build and shipped into the RSC payload for the index page. It has to become a content directory.

```
src/content/blogs/
  index.json                     generated — [{slug,title,excerpt,date,state,stateAbbr,heroImage}]
  acadia-national-park-maine.json
  … 176 more (one file per post, matching BlogPost)
public/blogs/
  acadia-national-park-maine.webp   downloaded + renamed to kebab slug
  … 176 more
```

| File | Change |
|---|---|
| `src/data/blogs.ts` | Keep the exported API (`blogPosts`, `allBlogPostsSorted`, `getPost`, `blogPreviews`) so nothing downstream changes. Internals switch to `import index from "@/content/blogs/index.json"` for lists and `await import(\`@/content/blogs/${slug}.json\`)` for a single body. The 6 hand-written posts move into the same directory — one storage format, no special cases. |
| `src/data/blogs.ts` (type) | Add `state: string`, `stateAbbr: string`, `source: "original" \| "migrated"` to `BlogPost`. `state` drives the archive routes; `source` lets QA scope the brand scan. |
| `src/app/blogs/page.tsx` | Paginate. 177 cards on one route is a large HTML document and a slow LCP — 24 per page, page 1 at `/blogs`. |
| `src/app/blogs/page/[n]/page.tsx` | **New.** Pages 2+, `noindex, follow` via `pageMetadata({ noindex: true })` — same pattern already used by `/locations/[state]/cities/[n]`. |
| `src/app/blogs/state/[state]/page.tsx` | **New.** State archive, replaces the old site's client-side chip filter with a crawlable route. `generateStaticParams` from the states that actually have posts (37, not 51). |
| `src/components/site/blog-state-filter.tsx` | **New.** Client chip row on `/blogs` that links to the archive routes. |
| `src/lib/sitemap.ts` | `corePaths()` picks up all 177 automatically via `allBlogPostsSorted()`. Add the state archives; leave `/blogs/page/[n]` out (noindex). |
| `scripts/ingest-blogs.mjs` | **New.** See below. |

**`scripts/ingest-blogs.mjs`** — one-shot migration, run once and committed as data:

1. Read the slug list (Appendix A) or re-read the old sitemap.
2. Fetch each `/blogs/{slug}` with a browser UA, **one request at a time with a ≥20s gap and a ≥100s timeout** — the old host times out under any concurrency, which is what stalled this audit.
3. Parse the article body into the existing `BlogBlock` union (`p` / `h2` / `ul`). Anything that doesn't map (tables, blockquotes) either extends the union or gets flattened to `p` — do not invent block types speculatively.
4. Scrub: `Vanguard Charter Bus` / `Vanguard CHARTER BUS` / `Vanguard` → `siteConfig.name`, and re-check case variants. Rewrite old internal links (`/fleet/category/x`, `/locations/state/xx/y`) to new paths via the redirect map in §8.
5. Derive `state`/`stateAbbr` from the post's state tag; fall back to parsing the title's trailing place name.
6. Download `/blogs/{Title-Slug}-1.webp` → `public/blogs/{slug}.webp`. Convert to a sized set if the originals are large — the existing fleet PNGs are already a known perf drag at ~2MB each, don't repeat it.
7. Write `src/content/blogs/{slug}.json` + regenerate `index.json`.
8. Report: posts written, images downloaded, brand tokens replaced, links rewritten, failures.

**Set `date` from the old site's published dates, not invented ones.** `CLAUDE.md` already flags the current 6 posts' June–July 2026 dates as placeholders; don't add 177 more.

**Build cost check:** 177 statically-generated blog pages is fine. The city pages are the ones on ISR. Leave blogs fully static.

---

## 3. Fleet

### Old catalogue (9 vehicles, 10 category pages)

| Vehicle | Category page | Detail page | Capacity | Amenities shown |
|---|---|---|---|---|
| Motor Coach | `/fleet/category/charter-bus`, `/fleet/category/motor-coach` | `/fleet/charter-bus-56` | 50–56 | WiFi, Reclining Seats, Restroom, AC |
| Coach Bus | `/fleet/category/coach-bus` | `/fleet/coach-bus` | 40–45 | WiFi, Reclining Seats, Power Outlets, Climate Control |
| Mini Bus | `/fleet/category/mini-bus` | `/fleet/mini-bus-35` | 20, 24, 27, 29, 32 | WiFi, Reclining Seats, AC, Overhead Storage |
| Sprinter Van | `/fleet/category/sprinter-van` | `/fleet/sprinter-van-14` | 10, 12, 14 | WiFi, AC, Luggage Space |
| Party Bus | `/fleet/category/party-bus` | `/fleet/party-bus` | 14, 20, 24, 30, 35, 40 | Premium Sound, LED Lighting, Dance Floor, Bar Area |
| School Bus | `/fleet/category/school-bus` | `/fleet/school-bus` | 28–60 | Safety Certified, AC, Overhead Storage |
| Stretch Limousine | `/fleet/category/limousine` | `/fleet/stretch-limousine` | 10 | Premium Interior, LED Lighting, Bar, Entertainment |
| SUV | `/fleet/category/suv` | `/fleet/suv` | 7 | Premium Seating, AC, Entertainment, Cargo Space |
| Sedan | `/fleet/category/sedan` | `/fleet/sedan` | 4 | Premium Interior, AC, Entertainment, Comfortable Seating |

### Gaps

- **The `/fleet/{vehicle}` detail level does not exist on the new site at all.** We have `/fleet` and `/fleet/[category]` only. That is 9 URLs and 9 pages of copy gone.
- **`coach-bus` (40–45 pax) has no equivalent.** Our `charter-buses` category spans 36–56 and absorbs it. A distinct 40–45 tier is a real product distinction and a real search term.
- **`motor-coach` has no page.** Its two images live as `extra` inside `charter-buses`.
- **Capacity figures disagree** — old SUV 7 vs our 1–6; old Sedan 4 vs our 1–3; old School Bus 28–60 vs our 40–48; old Mini Bus tops out at 32 vs our 35. These are the numbers customers filter on. One set is wrong. Owner has to confirm.
- **Amenity claims disagree** — old site promises WiFi on motor coach / coach bus / mini bus / sprinter van outright; ours says "Power outlets and Wi-Fi on request". Old site claims a dance floor on party buses. `CLAUDE.md` already lists per-vehicle amenities as unverified.

### Architecture

Prefer **flattening vehicles into categories** over adding a nested route. The old site's split is redundant — `/fleet/category/suv` and `/fleet/suv` are the same vehicle twice, which is exactly the thin-page pattern to avoid. Add the two missing categories, keep one page per vehicle type, and redirect both old shapes into it.

| File | Change |
|---|---|
| `src/data/fleet.ts` | Add `motor-coach` and `coach-bus` entries (10 categories total). Reconcile `capacity` on `suvs`, `sedans`, `school-buses`, `mini-buses` against owner-confirmed numbers. Add `seatingOptions: number[]` so the discrete counts (10/12/14, 14/20/24/30/35/40) render as chips instead of being flattened into a range — that detail is what a group organiser actually searches for. |
| `src/data/fleet.ts` | Add `aliases: string[]` per category holding old slugs (`charter-bus`, `charter-bus-56`, `motor-coach`, `stretch-limousine`, `mini-bus-35`, `sprinter-van-14`, …) so redirects generate from data instead of a hand-kept list. |
| `next.config.ts` | Generate `redirects()` from `fleetCategories.flatMap(c => c.aliases)`. |
| `public/fleet/` | `coach-bus-exterior.png` / `-interior.png` do not exist. Either the owner supplies photos or `coach-bus` reuses the motor-coach pair — reuse is acceptable, invented stock is not (owner directive: imagery must be non-copyright/owner-supplied). |
| `src/app/fleet/[category]/page.tsx` | Render `seatingOptions`; no structural change. |

---

## 4. Services

Old site has 8, we have 6.

| Old | New | Status |
|---|---|---|
| `corporate-travel` | `corporate-travel` | ✅ |
| `event-transportation` | `event-transportation` | ✅ |
| `airport-transfers` | `airport-transfers` | ✅ |
| `sports-team-travel` | `sports-team-travel` | ✅ |
| `school-trips` | `school-trips` | ✅ |
| `wedding-party` | `wedding-transportation` | ⚠️ slug renamed — needs a redirect |
| `city-tours` | — | ❌ **missing** |
| `long-distance-charter` | — | ❌ **missing** |

`city-tours` matters more than the count suggests: the old nav's "Tour Bus Booking Form" and the 177 destination blogs both funnel into tour work. Dropping the service page breaks that funnel.

**Architecture:** append two `Service` entries to `src/data/services.ts` — the existing type (`slug`, `name`, `short`, `intro[]`, `whatWeHandle[]`, `relatedFleetSlugs[]`) already fits. `/services`, `/services/[slug]`, the sitemap, the quote form's trip-type `<select>`, and the city pages' service list all read from that array, so nothing else changes. Add `wedding-party → wedding-transportation` to `next.config.ts` redirects.

---

## 5. Locations

### The two datasets are not the same shape

| | Old | New |
|---|---|---|
| State URL | `/locations/state/{abbr}` (`/locations/state/ca`) | `/locations/{state-slug}` (`/locations/california`) |
| City URL | `/locations/state/{abbr}/{city}` | `/locations/{state-slug}/{city}` |
| States | 50 (no DC) | 51 (with DC) |
| Cities | ~30,261 claimed on `/locations` | 16,399 |
| Cities in sitemap | 4,620 | 16,399 |
| State page | Single page, all cities | Paginated, 150/page |

### The old dataset is broken, and copying it verbatim would import the bugs

Evidence from the old `/locations` page:

- Alabama's city list contains **Amboy, Ancram, Andes, Angelica, Almond** — those are New York towns. City→state assignment is scrambled.
- Per-state counts are impossible: **Delaware 1,885**, **Washington 5,163**, **Wyoming 2,395**, **Oregon 1,986**, **Nevada 1,544** — against **Missouri 58**, **Utah 29**, **New Jersey 39**, **Maryland 69**, **Indiana 88**. Delaware has roughly 60 municipalities.
- Only 4,620 of the ~30,261 city pages are in the sitemap, so ~25,000 are unlinked from search.

Our dataset is GeoNames `cities1000`, filtered to real populated places, deduped on slug, with lat/lng and population — which is what makes the per-city copy (real distances, real population tiers) non-generic.

**Recommendation:** keep our dataset and our URL shape; do not import theirs. The owner's "exactly same as vanguard" note predates knowing the source data is scrambled. If the owner still wants literal parity, the path is to scrape all 50 old state pages (~50 requests) into a CSV and feed `scripts/ingest-locations.mjs` — the script already exists and takes `city,state,abbr,region,lat,lng,population`. But that ships pages titled "Charter Bus Rental in Ancram, Alabama".

**Decision needed from the owner** — this is the one item in this audit where "copy everything" and "ship something correct" genuinely conflict.

**Architecture if parity is chosen anyway:** no code changes beyond re-running the ingest script and re-checking `stateCityPageCount()` paging math against the larger set. Note that ~30k cities at the current 25-city prebuild limit is fine (the rest are ISR), but the sitemap crosses into a second 50k shard and the `/locations` index page will need its own pagination.

**Regardless of the decision:** add old→new location redirects (§8), and add the outstanding **GeoNames CC BY 4.0 attribution** to the footer — `CLAUDE.md` already flags it as a licence obligation, and it is still not on the site.

---

## 6. Missing pages and forms

### 6a. Legal — all three missing

`/privacy`, `/terms`, `/refund` exist on the old site, are linked in its footer, and are in its sitemap. **[not captured]** — bodies still need pulling.

| File | Purpose |
|---|---|
| `src/data/legal.ts` | **New.** `LegalDocument = { slug, title, updated, blocks: BlogBlock[] }` — reuse the blog block union rather than inventing a second one. |
| `src/app/legal/[slug]/page.tsx` | **New.** One route for all three; `generateStaticParams` from the data file. |
| `next.config.ts` | `/privacy` → `/legal/privacy` etc., so old links keep working. Or keep the flat `/privacy` routes for parity — either is fine, pick one and be consistent. |
| `src/components/site/footer.tsx` | Add a legal row. Currently the footer has no legal links at all. |
| `src/lib/sitemap.ts` | Add to `corePaths()`. |

**Do not write this copy.** Refund/cancellation terms are contractual. Port the owner's existing text verbatim, or get new text from them. `CLAUDE.md` already lists "cancellation policy + deposit terms" in `data/faq.ts` as invented and unverified — a `/refund` page that contradicts the FAQ is worse than no page.

### 6b. Driver careers + application

`/about/driver` (captured) is a content page: "Why Drive for Vanguard?" (6 bullets), "Requirements" (6 bullets: CDL with passenger endorsement, clean record, commercial experience, DOT physical, professionalism, reliability), "Training & Development" (5 bullets), then a CTA to `/driver` — a separate application form route — plus `drivers@vanguardcharterbus.com`.

| File | Purpose |
|---|---|
| `src/app/drivers/page.tsx` | **New.** Content + form on one page. Splitting content and form across two routes the way the old site does adds a click for no benefit. |
| `src/data/careers.ts` | **New.** The benefit/requirement/training bullets, so copy edits don't mean touching JSX. |
| `src/lib/forms/driver.ts` | **New.** `DriverApplication` type + `validateDriverApplication()`, mirroring `src/lib/quote.ts` exactly. Fields: name, phone, email, city/state, CDL class, passenger endorsement (bool), years experience, availability, notes. |
| `src/app/api/driver/route.ts` | **New.** Mirrors `src/app/api/quote/route.ts`. |
| `src/components/site/driver-form.tsx` | **New.** |
| `src/config/site.ts` | Add `emails: { general, drivers, affiliates }` — the old site routes driver mail to a separate address and that should survive the rebrand. |

**Resumé upload:** the old page says "submit your resume to drivers@…", i.e. it does not accept file uploads. Don't build one — a `mailto:` plus the form is parity.

### 6c. Affiliate program

`/about/affiliate` **[not captured]** — 503'd on every attempt. Linked from the old header nav (`/about#affiliate`) and from the About page (`/about/affiliate`), so it is real. Same architecture as drivers: `src/app/affiliates/page.tsx`, `src/lib/forms/affiliate.ts`, `src/app/api/affiliate/route.ts`, `src/components/site/affiliate-form.tsx`. Copy must be pulled before building.

### 6d. Booking tutorial

`/about/tutorial` **[not captured]**, linked from old nav as "Tutorials". Likely a walkthrough of the quote→estimate→agreement flow. The new site already has `src/components/site/booking-steps.tsx` rendering the same 3 steps (Request a Quotation → Receive Estimate → Sign Agreement — the wording matches the old homepage). A `/how-to-book` page that expands those three steps covers this; pull the old copy first to see whether it adds anything beyond what `BookingSteps` already says.

### 6e. Tour bus booking form

`/tour-booking` **[not captured]** — a top-level nav item on the old site, its own route in the sitemap. `CLAUDE.md` records it as "intentionally folded into `/quote`".

That fold is defensible (one form, one inbox, fewer dead ends) but it drops a nav item the owner put in their primary navigation and a URL that has whatever search equity it earned. **Recommendation:** add `/tour-booking` back as a real route that renders `<QuoteForm>` with `tripType` pre-set to `city-tours` and tour-specific framing (multi-day itineraries, driver lodging, per-stop timing). Costs one page, preserves the URL and the nav item, and still funnels into one pipeline.

### 6f. Newsletter signup

Old footer has an email input + Subscribe button. Missing entirely from ours.

`src/components/site/newsletter-form.tsx` (client) + `src/app/api/newsletter/route.ts` + a `newsletter` case in the sender. Worth asking whether the owner actually has a list to send to — a Subscribe button wired to a console log is worse than no Subscribe button.

### 6g. Contact form

Old `/contact` **[not captured]**. Our `/contact` renders three cards (phone, email, address) and a CTA band — no form. Almost certainly a gap. Add `src/components/site/contact-form.tsx` + `src/lib/forms/contact.ts` + `src/app/api/contact/route.ts`.

### 6h. The blocker under all of it

`src/lib/quote-sender.ts` **only logs to console.** Nothing submitted through `/quote` reaches anyone today. Adding five more forms multiplies a pipeline that doesn't deliver.

**This is the highest-priority non-cosmetic item on the project and it is not new — `CLAUDE.md` already flags it.** Fix it before or alongside the new forms, not after:

```
src/lib/submissions.ts     Submission = QuoteSubmission | DriverSubmission | AffiliateSubmission
                           | ContactSubmission | NewsletterSubmission | TourSubmission
                           (discriminated on `kind`)
src/lib/mailer.ts          Sender interface + real transport (Resend / SendGrid / SMTP),
                           replacing quote-sender.ts. Per-kind routing:
                           quote+tour → general, driver → drivers, affiliate → affiliates.
src/app/api/*/route.ts     each validates with its own lib/forms module, then calls the mailer
```

Also missing from every form: spam protection. Six public POST endpoints with no honeypot, no rate limit, and no captcha will fill the owner's inbox with junk. A honeypot field plus a per-IP rate limit is the cheap version and should ship with the first real sender.

---

## 7. Navigation, footer, and business data

### 7a. Navigation

Old header: Home · **Fleet** (dropdown: 8 category links) · Services · Locations · Blogs · **About Us** (dropdown: Affiliate, Drivers, Tutorials, Tour Bus Booking Form) · Contact Us · Get Quote.

Ours (`src/config/nav.ts`): a flat six — Fleet, Services, Locations, Blog, About, Contact.

**`/faq` is orphaned.** It is in the sitemap and has a page, but nothing in the header or footer links to it — the only internal link is one line in `src/data/blogs.ts`. That is a live bug, independent of the migration.

`src/config/nav.ts` needs a `children?: NavItem[]` field, and `nav-links.tsx` / `mobile-nav.tsx` need to render one level of submenu. Both are already keyboard-accessible and focus-trapped; a disclosure submenu has to keep that (Escape closes, arrow keys optional, `aria-expanded` on the trigger, ≥44px targets). Do not introduce hover-only menus — the audience skews older and the site is majority mobile.

Proposed:

```
Fleet ▾      → /fleet + 10 category links
Services ▾   → /services + 8 service links
Locations    → /locations
Blog         → /blogs
About ▾      → /about, /drivers, /affiliates, /how-to-book
FAQ          → /faq
Contact      → /contact
```

### 7b. Footer

Missing vs old: newsletter form, legal links (Privacy · Terms · Refund), FAQ link. Plus the outstanding GeoNames attribution line. Deliberately absent and staying absent: social icons (the old site's four were all `href="#"` anyway).

### 7c. Real business data found on the old site

`src/config/site.ts` is entirely dummy values. The old site carries what are presumably the real ones:

| Field | Old site value | Current dummy |
|---|---|---|
| Address | 3921 Innovator Drive, Sacramento, CA 95834 | 1200 Transit Way, Suite 400, Dallas TX 75201 |
| Phone | +1 (916) 234-3232 | (800) 555-0142 |
| Email | info@vanguardcharterbus.com | info@credencecharterbus.com |
| Drivers email | drivers@vanguardcharterbus.com | — |
| Established | **2014** | **2013** |

Two things to settle with the owner:

1. **Do the Sacramento address and 916 number carry over to Credence?** If yes, `src/config/site.ts` is a five-line change that propagates to every page, `tel:` link, JSON-LD node, and sitemap.
2. **2013 or 2014?** `CLAUDE.md` lists `established: 2013` as owner-confirmed; the old site says 2014 in three places (about copy, footer, copyright range "2014 - 2026"). One is wrong, and it is in the hero trust list, the About page, the footer, and `foundingDate` in JSON-LD.

The old homepage's animated counters (5,000 miles · 3,000 buses · 400 cities · 7,000 happy users) are superseded by the owner's confirmed stats (15M+ miles · 500K+ passengers · 750+ cities · 12+ years). Keep ours. The owner's open request for "a different stats animation" is still unbuilt — `StatsBand` renders static, and a count-up would need to respect `prefers-reduced-motion`.

---

## 8. Redirect map

Only load-bearing if vanguardcharterbus.com 301s to the new domain (which it should, given 177 posts and thousands of indexed city pages). Generate from data, not by hand.

| Old | New |
|---|---|
| `/fleet/category/charter-bus` | `/fleet/charter-buses` |
| `/fleet/category/motor-coach`, `/fleet/charter-bus-56` | `/fleet/motor-coach` |
| `/fleet/category/coach-bus`, `/fleet/coach-bus` | `/fleet/coach-bus` |
| `/fleet/category/mini-bus`, `/fleet/mini-bus-35` | `/fleet/mini-buses` |
| `/fleet/category/sprinter-van`, `/fleet/sprinter-van-14` | `/fleet/sprinter-vans` |
| `/fleet/category/party-bus`, `/fleet/party-bus` | `/fleet/party-buses` |
| `/fleet/category/school-bus`, `/fleet/school-bus` | `/fleet/school-buses` |
| `/fleet/category/limousine`, `/fleet/stretch-limousine` | `/fleet/limousines` |
| `/fleet/category/suv`, `/fleet/suv` | `/fleet/suvs` |
| `/fleet/category/sedan`, `/fleet/sedan` | `/fleet/sedans` |
| `/services/wedding-party` | `/services/wedding-transportation` |
| `/locations/state/:abbr` | `/locations/:stateSlug` (lookup, not a pattern) |
| `/locations/state/:abbr/:city` | `/locations/:stateSlug/:city` |
| `/about#affiliate`, `/about/affiliate` | `/affiliates` |
| `/about#drivers`, `/about/driver`, `/driver` | `/drivers` |
| `/about#tutorials`, `/about/tutorial` | `/how-to-book` |
| `/about/booking` | `/quote` |
| `/reviews` | `/` (page cut by owner) |
| `/blogs/:slug` | unchanged — **preserve every slug exactly** |

The abbreviation→slug map has to be generated from `states` in `src/data/locations/index.ts`; `next.config.ts` can't pattern-match `ca` → `california`. ~51 static entries plus one catch-all for cities.

---

## 9. Suggested phases

Each phase stops for approval, per the working convention.

**Phase 7 — real submissions + business data.** Wire `mailer.ts`, add honeypot + rate limiting, replace the dummy values in `src/config/site.ts`, settle 2013 vs 2014. Nothing else matters if leads don't arrive. *Done when: a real quote lands in a real inbox.*

**Phase 8 — missing routes.** Two services, two fleet categories, three legal pages, `/tour-booking`, `/drivers`, `/affiliates`, `/how-to-book`, contact + newsletter forms. Nav dropdowns, footer legal row, FAQ link, GeoNames attribution. *Done when: every old-site route resolves on the new site or redirects to a deliberate destination.*

**Phase 9 — blog migration.** `scripts/ingest-blogs.mjs`, content directory refactor, 177 posts + images, pagination, state archives. *Done when: 183 posts build, zero Vanguard tokens, every hero image local, Lighthouse on `/blogs` still ≥90.*

**Phase 10 — locations decision.** Owner picks: keep the clean 16,399 or import the old ~30,261. Execute either way. *Done when: the dataset is settled and the redirect map covers it.*

**Phase 11 — launch QA.** Full-crawl link check, redirect verification against the old sitemap's 4,888 URLs, brand token scan, `grep -rn "dummy" src/config/site.ts` returns nothing, Lighthouse re-run, sitemap shard count re-checked.

---

## 10. Open questions for the owner

1. **Locations** — keep our clean 16,399-city dataset, or reproduce the old site's ~30,261 including the misfiled cities? (§5)
2. **Established year** — 2013 or 2014? (§7c)
3. **Contact details** — do the Sacramento address and 916 number carry to Credence, or is there a new NAP? (§7c)
4. **Old domain** — will vanguardcharterbus.com 301 to the new site? Determines whether §8 matters and whether the 177 ported posts are duplicate content. (§2)
5. **Blog copy** — verbatim port, or rewrite? The earlier "reword the blogs" directive and "copy all the blogs" now point different ways. (§2)
6. **Capacities and amenities** — old and new disagree on SUV, sedan, school bus, mini bus seat counts and on whether WiFi is standard. Which is right? (§3)
7. **Coach Bus photos** — supply a pair, or reuse the motor-coach images? (§3)
8. **Newsletter** — is there a real list, or should the signup be dropped? (§6f)
9. **Legal copy** — send the existing privacy/terms/refund text, or have new text drafted by counsel? (§6a)
10. **Tour booking** — restore `/tour-booking` as its own route, or keep it folded into `/quote`? (§6e)

---

## Appendix A — all 177 blog posts

Source images live at `https://vanguardcharterbus.com/blogs/{image}`. Target slugs are unchanged; target images become `public/blogs/{slug}.webp`.

| # | Slug | Title | Source image |
|---|---|---|---|
| 1 | `abandoned-pa-turnpike-tunnel-breezewood-pennsylvania` | Abandoned PA Turnpike Tunnel – Breezewood, Pennsylvania | `Abandoned-PA-Turnpike-Tunnel-Breezewood-Pennsylvania-1.webp` |
| 2 | `acadia-national-park-maine` | Acadia National Park, Maine | `Acadia-National-Park-Maine-1.webp` |
| 3 | `aleutian-islands-alaska` | Aleutian Islands, Alaska | `Aleutian-Islands-Alaska-1.webp` |
| 4 | `anchorage-alaska` | Anchorage, Alaska | `Anchorage-Alaska-1.webp` |
| 5 | `arches-national-park-utah` | Arches National Park, Utah | `Arches-National-Park-Utah-1.webp` |
| 6 | `arlington-virginia` | Arlington, Virginia | `Arlington-Virginia-1.webp` |
| 7 | `aspen-colorado` | Aspen, Colorado | `Aspen-Colorado-1.webp` |
| 8 | `assateague-island-national-seashore-berlin-maryland` | Assateague Island National Seashore – Berlin, Maryland | `Assateague-Island-National-Seashore-Berlin-Maryland-1.webp` |
| 9 | `atlanta-georgia` | Atlanta, Georgia | `Atlanta-Georgia-1.webp` |
| 10 | `atlantic-city-new-jersey` | Atlantic City, New Jersey | `Atlantic-City-New-Jersey-1.webp` |
| 11 | `avery-island-louisiana` | Avery Island, Louisiana | `Avery-Island-Louisiana-1.webp` |
| 12 | `badlands-national-park-south-dakota` | Badlands National Park, South Dakota | `Badlands-National-Park-South-Dakota-1.webp` |
| 13 | `bancroft-tower-worcester-massachusetts` | Bancroft Tower – Worcester, Massachusetts | `Bancroft-Tower-Worcester-Massachusetts-1.webp` |
| 14 | `bangor-maine` | Bangor, Maine | `Bangor-Maine-1.webp` |
| 15 | `bar-harbor-maine` | Bar Harbor, Maine | `Bar-Harbor-Maine-1.webp` |
| 16 | `baton-rouge-louisiana` | Baton Rouge, Louisiana | `Baton-Rouge-Louisiana-1.webp` |
| 17 | `ben-jerrys-flavor-graveyard-waterbury-vermont` | Ben & Jerry’s Flavor Graveyard – Waterbury, Vermont | `Ben-Jerrys-Flavor-Graveyard-Waterbury-Vermont-1.webp` |
| 18 | `big-bend-national-park-texas` | Big Bend National Park, Texas | `Big-Bend-National-Park-Texas-1.webp` |
| 19 | `big-sur-california` | Big Sur, California | `Big-Sur-California-1.webp` |
| 20 | `biloxi-mississippi` | Biloxi, Mississippi | `Biloxi-Mississippi-1.webp` |
| 21 | `biltmore-estates-asheville-north-carolina` | Biltmore Estates- Asheville, North Carolina | `Biltmore-Estates-Asheville-North-Carolina-1.webp` |
| 22 | `birmingham-alabama` | Birmingham, Alabama | `Birmingham-Alabama-1.webp` |
| 23 | `bismarck-north-dakota` | Bismarck, North Dakota | `Bismarck-North-Dakota-1.webp` |
| 24 | `black-hills-national-forest-south-dakota` | Black Hills National Forest, South Dakota | `Black-Hills-National-Forest-South-Dakota-1.webp` |
| 25 | `blue-ridge-parkway-north-carolina-and-virginia` | Blue Ridge Parkway- North Carolina and Virginia | `Blue-Ridge-Parkway-North-Carolina-and-Virginia-1.webp` |
| 26 | `boston-massachusetts` | Boston, Massachusetts | `Boston-Massachusetts-1.webp` |
| 27 | `bridges-of-madison-county-iowa` | Bridges of Madison County, Iowa | `Bridges-of-Madison-County-Iowa-1.webp` |
| 28 | `bushkill-falls-pennsylvania` | Bushkill Falls – Pennsylvania | `Bushkill-Falls-Pennsylvania-1.webp` |
| 29 | `cadillac-ranch-texas` | Cadillac Ranch, Texas | `Cadillac-Ranch-Texas-1.webp` |
| 30 | `cantwell-cliffs-rockbridge-ohio` | Cantwell Cliffs – Rockbridge, Ohio | `Cantwell-Cliffs-Rockbridge-Ohio-1.webp` |
| 31 | `canyonlands-national-park-utah` | Canyonlands National Park, Utah | `Canyonlands-National-Park-Utah-1.webp` |
| 32 | `cape-henlopen-state-park-lewes-delaware` | Cape Henlopen State Park – Lewes, Delaware | `Cape-Henlopen-State-Park-Lewes-Delaware-1.webp` |
| 33 | `cape-may-new-jersey` | Cape May, New Jersey | `Cape-May-New-Jersey-1.webp` |
| 34 | `carhenge-alliance-nebraska` | Carhenge – Alliance, Nebraska | `Carhenge-Alliance-Nebraska-1.webp` |
| 35 | `cedar-point-sandusky-ohio` | Cedar Point – Sandusky, Ohio | `Cedar-Point-Sandusky-Ohio-1.webp` |
| 36 | `chaco-culture-national-historical-park-new-mexico` | Chaco Culture National Historical Park, New Mexico | `Chaco-Culture-National-Historical-Park-New-Mexico-1.webp` |
| 37 | `charleston-south-carolina` | Charleston, South Carolina | `Charleston-South-Carolina-1.webp` |
| 38 | `cheaha-state-park-alabama` | Cheaha State Park, Alabama | `Cheaha-State-Park-Alabama-1.webp` |
| 39 | `cherry-springs-state-park-coudersport-pennsylvania` | Cherry Springs State Park- Coudersport, Pennsylvania | `Cherry-Springs-State-Park-Coudersport-Pennsylvania-1.webp` |
| 40 | `chimney-rock-museum-bayard-nebraska` | Chimney Rock Museum – Bayard, Nebraska | `Chimney-Rock-Museum-Bayard-Nebraska-1.webp` |
| 41 | `chincoteague-virginia` | Chincoteague, Virginia | `Chincoteague-Virginia-1.webp` |
| 42 | `clifty-falls-state-park-madison-indiana` | Clifty Falls State Park – Madison, Indiana | `Clifty-Falls-State-Park-Madison-Indiana-1.webp` |
| 43 | `cody-wyoming` | Cody, Wyoming | `Cody-Wyoming-1.webp` |
| 44 | `columbia-river-gorge-hood-river-oregon` | Columbia River Gorge – Hood River, Oregon | `Columbia-River-Gorge-Hood-River-Oregon-1.webp` |
| 45 | `concord-massachusetts` | Concord, Massachusetts | `Concord-Massachusetts-1.webp` |
| 46 | `crater-lake-national-park-oregon` | Crater Lake National Park, Oregon | `Crater-Lake-National-Park-Oregon-1.webp` |
| 47 | `craters-of-the-moon-national-monument-idaho` | Craters of the Moon National Monument, Idaho | `Craters-of-the-Moon-National-Monument-Idaho-1.webp` |
| 48 | `cypress-swamp-canton-mississippi` | Cypress Swamp – Canton, Mississippi | `Cypress-Swamp-Canton-Mississippi-1.webp` |
| 49 | `deadwood-south-dakota` | Deadwood, South Dakota | `Deadwood-South-Dakota-1.webp` |
| 50 | `death-valley-national-park-california` | Death Valley National Park, California | `Death-Valley-National-Park-California-1.webp` |
| 51 | `denali-national-park-alaska` | Denali National Park, Alaska | `Denali-National-Park-Alaska-1.webp` |
| 52 | `denver-colorado` | Denver, Colorado | `Denver-Colorado-1.webp` |
| 53 | `devils-tower-wyoming` | Devil’s Tower, Wyoming | `Devils-Tower-Wyoming-1.webp` |
| 54 | `devils-waterhole-burnet-texas` | Devil’s Waterhole – Burnet, Texas | `Devils-Waterhole-Burnet-Texas-1.webp` |
| 55 | `disney-world-orlando-florida` | Disney World – Orlando, Florida | `Disney-World-Orlando-Florida-1.webp` |
| 56 | `disneyland-and-california-adventure-anaheim-california` | Disneyland and California Adventure- Anaheim, California | `Disneyland-and-California-Adventure-Anaheim-California-1.webp` |
| 57 | `dodge-city-kansas` | Dodge City, Kansas | `Dodge-City-Kansas-1.webp` |
| 58 | `field-of-dreams-dyersville-iowa` | Field of Dreams – Dyersville, Iowa | `Field-of-Dreams-Dyersville-Iowa-1.webp` |
| 59 | `finger-lakes-new-york` | Finger Lakes, New York | `Finger-Lakes-New-York-1.webp` |
| 60 | `flight-93-memorial-stoystown-pennsylvania` | Flight 93 Memorial – Stoystown, Pennsylvania | `Flight-93-Memorial-Stoystown-Pennsylvania-1.webp` |
| 61 | `floating-bridge-of-brookfield-brookfield-vermont` | Floating Bridge of Brookfield – Brookfield, Vermont | `Floating-Bridge-of-Brookfield-Brookfield-Vermont-1.webp` |
| 62 | `forestiere-underground-gardens-fresno-california` | Forestiere Underground Gardens – Fresno, California | `Forestiere-Underground-Gardens-Fresno-California-1.webp` |
| 63 | `fort-delaware-state-park-delaware-city-delaware` | Fort Delaware State Park – Delaware City, Delaware | `Fort-Delaware-State-Park-Delaware-City-Delaware-1.webp` |
| 64 | `frankenmuth-michigan` | Frankenmuth, Michigan | `Frankenmuth-Michigan-1.webp` |
| 65 | `garden-of-the-gods-herod-illinois` | Garden of the Gods – Herod, Illinois | `Garden-of-the-Gods-Herod-Illinois-1.webp` |
| 66 | `gatlinburg-and-pigeon-forge-tennessee` | Gatlinburg and Pigeon Forge, Tennessee | `Gatlinburg-and-Pigeon-Forge-Tennessee-1.webp` |
| 67 | `gatlinburg-tennessee-smoky-mountains` | Gatlinburg, Tennessee, Smoky Mountains, | `Gatlinburg-Tennessee-Smoky-Mountains-1.webp` |
| 68 | `gillette-castle-state-park-east-haddam-connecticut` | Gillette Castle State Park – East Haddam, Connecticut | `Gillette-Castle-State-Park-East-Haddam-Connecticut-1.webp` |
| 69 | `glacier-national-park-montana` | Glacier National Park, Montana | `Glacier-National-Park-Montana-1.webp` |
| 70 | `glass-beach-fort-bragg-california` | Glass Beach – Fort Bragg, California | `Glass-Beach-Fort-Bragg-California-1.webp` |
| 71 | `grand-canyon-arizona` | Grand Canyon, Arizona | `Grand-Canyon-Arizona-1.webp` |
| 72 | `grand-rapids-michigan` | Grand Rapids, Michigan | `Grand-Rapids-Michigan-1.webp` |
| 73 | `great-sand-dunes-national-park-colorado` | Great Sand Dunes National Park, Colorado | `Great-Sand-Dunes-National-Park-Colorado-1.webp` |
| 74 | `great-smoky-mountains-tennessee` | Great Smoky Mountains, Tennessee | `Great-Smoky-Mountains-Tennessee-1.webp` |
| 75 | `henry-doorly-zoo-omaha-nebraska` | Henry Doorly Zoo – Omaha, Nebraska | `Henry-Doorly-Zoo-Omaha-Nebraska-1.webp` |
| 76 | `hill-city-south-dakota` | Hill City, South Dakota | `Hill-City-South-Dakota-1.webp` |
| 77 | `hoover-dam-nevada` | Hoover Dam, Nevada | `Hoover-Dam-Nevada-1.webp` |
| 78 | `houston-texas` | Houston, Texas | `Houston-Texas-1.webp` |
| 79 | `hunting-island-state-park-st-helena-island-south-carolina` | Hunting Island State Park– St. Helena Island, South Carolina | `Hunting-Island-State-Park-St-Helena-Island-South-Carolina-1.webp` |
| 80 | `ice-caves-pine-bush-new-york` | Ice Caves – Pine Bush, New York | `Ice-Caves-Pine-Bush-New-York-1.webp` |
| 81 | `indianapolis-indiana` | Indianapolis, Indiana | `Indianapolis-Indiana-1.webp` |
| 82 | `islesboro-maine` | Islesboro, Maine | `Islesboro-Maine-1.webp` |
| 83 | `jackson-mississippi` | Jackson, Mississippi | `Jackson-Mississippi-1.webp` |
| 84 | `jackson-wyoming` | Jackson, Wyoming | `Jackson-Wyoming-1.webp` |
| 85 | `jaws-bridge-edgartown-massachusetts` | Jaw’s Bridge – Edgartown, Massachusetts | `Jaws-Bridge-Edgartown-Massachusetts-1.webp` |
| 86 | `joshua-tree-national-park-california` | Joshua Tree National Park, California | `Joshua-Tree-National-Park-California-1.webp` |
| 87 | `kansas-city-missouri` | Kansas City, Missouri | `Kansas-City-Missouri-1.webp` |
| 88 | `kauai-hawaii` | Kauai, Hawaii | `Kauai-Hawaii-1.webp` |
| 89 | `kentucky-down-under-horse-cave-kentucky` | Kentucky Down Under– Horse Cave, Kentucky | `Kentucky-Down-Under-Horse-Cave-Kentucky-1.webp` |
| 90 | `key-west-florida` | Key West, Florida | `Key-West-Florida-1.webp` |
| 91 | `kinzua-bridge-state-park-mt-jewett-pennsylvania` | Kinzua Bridge State Park – Mt. Jewett, Pennsylvania | `Kinzua-Bridge-State-Park-Mt-Jewett-Pennsylvania-1.webp` |
| 92 | `lake-tahoe-nevada` | Lake Tahoe, Nevada | `Lake-Tahoe-Nevada-1.webp` |
| 93 | `las-vegas-nevada` | Las Vegas, Nevada | `Las-Vegas-Nevada-1.webp` |
| 94 | `liberty-state-park-jersey-city-new-jersey` | Liberty State Park – Jersey City, New Jersey | `Liberty-State-Park-Jersey-City-New-Jersey-1.webp` |
| 95 | `livingston-montana` | Livingston, Montana | `Livingston-Montana-1.webp` |
| 96 | `long-beach-island-new-jersey` | Long Beach Island, New Jersey | `Long-Beach-Island-New-Jersey-1.webp` |
| 97 | `louisville-kentucky` | Louisville, Kentucky | `Louisville-Kentucky-1.webp` |
| 98 | `mammoth-cave-kentucky` | Mammoth Cave, Kentucky | `Mammoth-Cave-Kentucky-1.webp` |
| 99 | `mammoth-lakes-california` | Mammoth Lakes, California | `Mammoth-Lakes-California-1.webp` |
| 100 | `manchester-vermont` | Manchester, Vermont | `Manchester-Vermont-1.webp` |
| 101 | `maquoketa-caves-state-park-maquoketa-iowa` | Maquoketa Caves State Park – Maquoketa, Iowa | `Maquoketa-Caves-State-Park-Maquoketa-Iowa-1.webp` |
| 102 | `marthas-vineyard-massachusetts` | Martha’s Vineyard, Massachusetts | `Marthas-Vineyard-Massachusetts-1.webp` |
| 103 | `memphis-tennessee` | Memphis, Tennessee | `Memphis-Tennessee-1.webp` |
| 104 | `miami-florida` | Miami, Florida | `Miami-Florida-1.webp` |
| 105 | `mississippi-river` | Mississippi River | `Mississippi-River-1.webp` |
| 106 | `moosehead-lake-greenville-maine` | Moosehead Lake – Greenville, Maine | `Moosehead-Lake-Greenville-Maine-1.webp` |
| 107 | `mount-rainier-washington` | Mount Rainier, Washington | `Mount-Rainier-Washington-1.webp` |
| 108 | `mount-st-helens-washington` | Mount St. Helens, Washington | `Mount-St-Helens-Washington-1.webp` |
| 109 | `mount-washington-new-hampshire` | Mount Washington, New Hampshire | `Mount-Washington-New-Hampshire-1.webp` |
| 110 | `museum-of-world-treasures-wichita-kansas` | Museum of World Treasures – Wichita, Kansas | `Museum-of-World-Treasures-Wichita-Kansas-1.webp` |
| 111 | `myrtle-beach-south-carolina` | Myrtle Beach, South Carolina | `Myrtle-Beach-South-Carolina-1.webp` |
| 112 | `mystic-aquarium-mystic-connecticut` | Mystic Aquarium – Mystic, Connecticut | `Mystic-Aquarium-Mystic-Connecticut-1.webp` |
| 113 | `nantucket-massachusetts` | Nantucket, Massachusetts | `Nantucket-Massachusetts-1.webp` |
| 114 | `napa-valley-california` | Napa Valley, California | `Napa-Valley-California-1.webp` |
| 115 | `nashville-tennessee` | Nashville, Tennessee | `Nashville-Tennessee-1.webp` |
| 116 | `national-museum-of-the-united-states-marine-corps-quantico-virginia` | National Museum of the United States Marine Corps – Quantico, Virginia | `National-Museum-of-the-United-States-Marine-Corps-Quantico-Virginia-1.webp` |
| 117 | `new-england-air-museum-windsor-locks-connecticut` | New England Air Museum – Windsor Locks, Connecticut | `New-England-Air-Museum-Windsor-Locks-Connecticut-1.webp` |
| 118 | `new-orleans-louisiana` | New Orleans, Louisiana | `New-Orleans-Louisiana-1.webp` |
| 119 | `niagara-falls-new-york` | Niagara Falls, New York | `Niagara-Falls-New-York-1.webp` |
| 120 | `nyc-new-york-city-statue-of-liberty-radio-city-music-hall-brooklyn-bridge-empire-state-building-central-park` | NYC, New York City, Statue of Liberty, Radio City Music Hall, Brooklyn Bridge, Empire State Building, Central Park, | `NYC-New-York-City-Statue-of-Liberty-Radio-City-Music-Hall-Brooklyn-Bridge-Empire-State-Building-Central-Park-1.webp` |
| 121 | `oak-alley-plantation-vacherie-louisiana` | Oak Alley Plantation – Vacherie, Louisiana | `Oak-Alley-Plantation-Vacherie-Louisiana-1.webp` |
| 122 | `old-salem-winston-salem-north-carolina` | Old Salem – Winston-Salem, North Carolina | `Old-Salem-Winston-Salem-North-Carolina-1.webp` |
| 123 | `olympic-national-park-washington` | Olympic National Park, Washington | `Olympic-National-Park-Washington-1.webp` |
| 124 | `outer-banks-north-carolina` | Outer Banks, North Carolina | `Outer-Banks-North-Carolina-1.webp` |
| 125 | `pacific-coast-highway-california` | Pacific Coast Highway- California | `Pacific-Coast-Highway-California-1.webp` |
| 126 | `pearl-harbor-hawaii` | Pearl Harbor, Hawaii | `Pearl-Harbor-Hawaii-1.webp` |
| 127 | `pensacola-florida` | Pensacola, Florida | `Pensacola-Florida-1.webp` |
| 128 | `phoenix-arizona` | Phoenix, Arizona | `Phoenix-Arizona-1.webp` |
| 129 | `pictured-rocks-national-lakeshore-munising-michigan` | Pictured Rocks National Lakeshore – Munising, Michigan | `Pictured-Rocks-National-Lakeshore-Munising-Michigan-1.webp` |
| 130 | `poconos-pennsylvania` | Poconos, Pennsylvania | `Poconos-Pennsylvania-1.webp` |
| 131 | `portland-maine` | Portland, Maine | `Portland-Maine-1.webp` |
| 132 | `red-river-gorge-kentucky` | Red River Gorge, Kentucky | `Red-River-Gorge-Kentucky-1.webp` |
| 133 | `red-rock-canyon-nevada` | Red Rock Canyon, Nevada | `Red-Rock-Canyon-Nevada-1.webp` |
| 134 | `red-rocks-of-sedona-arizona` | Red Rocks of Sedona Arizona | `Red-Rocks-of-Sedona-Arizona-1.webp` |
| 135 | `redwoods-state-park-california` | Redwoods State Park, California | `Redwoods-State-Park-California-1.webp` |
| 136 | `rehoboth-beach-delaware` | Rehoboth Beach, Delaware | `Rehoboth-Beach-Delaware-1.webp` |
| 137 | `ringing-rocks-county-park-bucks-county-pennsylvania` | Ringing Rocks County Park– Bucks County, Pennsylvania | `Ringing-Rocks-County-Park-Bucks-County-Pennsylvania-1.webp` |
| 138 | `rock-and-roll-hall-of-fame-cleveland-ohio` | Rock and Roll Hall of Fame – Cleveland, Ohio | `Rock-and-Roll-Hall-of-Fame-Cleveland-Ohio-1.webp` |
| 139 | `rocky-mountain-national-park-colorado` | Rocky Mountain National Park, Colorado | `Rocky-Mountain-National-Park-Colorado-1.webp` |
| 140 | `roswell-new-mexico` | Roswell, New Mexico | `Roswell-New-Mexico-1.webp` |
| 141 | `route-66-association-of-illinois-pontiac-illinois` | Route 66 Association of Illinois – Pontiac, Illinois | `Route-66-Association-of-Illinois-Pontiac-Illinois-1.webp` |
| 142 | `salem-massachusetts` | Salem, Massachusetts | `Salem-Massachusetts-1.webp` |
| 143 | `salt-flats-utah` | Salt Flats, Utah | `Salt-Flats-Utah-1.webp` |
| 144 | `salt-lake-city-utah` | Salt Lake City, Utah | `Salt-Lake-City-Utah-1.webp` |
| 145 | `san-antonio-texas` | San Antonio, Texas | `San-Antonio-Texas-1.webp` |
| 146 | `san-francisco-california` | San Francisco, California | `San-Francisco-California-1.webp` |
| 147 | `san-juan-islands-washington` | San Juan Islands, Washington | `San-Juan-Islands-Washington-1.webp` |
| 148 | `santa-fe-new-mexico` | Santa Fe, New Mexico | `Santa-Fe-New-Mexico-1.webp` |
| 149 | `santas-village-jefferson-new-hampshire` | Santa’s Village – Jefferson, New Hampshire | `Santas-Village-Jefferson-New-Hampshire-1.webp` |
| 150 | `savannah-georgia` | Savannah, Georgia | `Savannah-Georgia-1.webp` |
| 151 | `seattle-washington` | Seattle, Washington | `Seattle-Washington-1.webp` |
| 152 | `shoshone-falls-twin-falls-idaho` | Shoshone Falls – Twin Falls, Idaho | `Shoshone-Falls-Twin-Falls-Idaho-1.webp` |
| 153 | `skyline-drive-virginia` | Skyline Drive- Virginia | `Skyline-Drive-Virginia-1.webp` |
| 154 | `solvang-california` | Solvang, California | `Solvang-California-1.webp` |
| 155 | `south-dakota-black-hills-sylvan-lake-milky-way-night-photography-stars-dark` | South Dakota, Black Hills, Sylvan Lake, Milky Way, Night Photography, stars, dark, | `South-Dakota-Black-Hills-Sylvan-Lake-Milky-Way-Night-Photography-stars-dark-1.webp` |
| 156 | `spirit-of-peoria-peoria-illinois` | Spirit of Peoria – Peoria, Illinois | `Spirit-of-Peoria-Peoria-Illinois-1.webp` |
| 157 | `st-augustine-florida` | St. Augustine, Florida | `St-Augustine-Florida-1.webp` |
| 158 | `st-louis-missouri` | St. Louis, Missouri | `St-Louis-Missouri-1.webp` |
| 159 | `talladega-national-forest-alabama` | Talladega National Forest, Alabama | `Talladega-National-Forest-Alabama-1.webp` |
| 160 | `theodore-roosevelt-national-park-medora-north-dakota` | Theodore Roosevelt National Park- Medora, North Dakota | `Theodore-Roosevelt-National-Park-Medora-North-Dakota-1.webp` |
| 161 | `tulsa-oklahoma` | Tulsa, Oklahoma | `Tulsa-Oklahoma-1.webp` |
| 162 | `universal-studios-florida-orlando-florida` | Universal Studios Florida – Orlando, Florida | `Universal-Studios-Florida-Orlando-Florida-1.webp` |
| 163 | `uss-lexington-corpus-christi-texas` | USS Lexington – Corpus Christi, Texas | `USS-Lexington-Corpus-Christi-Texas-1.webp` |
| 164 | `vermilion-cliffs-national-monument-and-antelope-canyon-arizona` | Vermilion Cliffs National Monument and Antelope Canyon, Arizona | `Vermilion-Cliffs-National-Monument-and-Antelope-Canyon-Arizona-1.webp` |
| 165 | `volcanoes-national-park-hawaii` | Volcanoes National Park, Hawaii | `Volcanoes-National-Park-Hawaii-1.webp` |
| 166 | `waikiki-beach-hawaii` | Waikiki Beach, Hawaii | `Waikiki-Beach-Hawaii-1.webp` |
| 167 | `walk-over-the-hudson-poughkeepsie-new-york` | Walk over the Hudson – Poughkeepsie, New York | `Walk-over-the-Hudson-Poughkeepsie-New-York-1.webp` |
| 168 | `washington-dc` | Washington, DC | `Washington-DC-1.webp` |
| 169 | `watkins-glen-state-park-watkins-glen-new-york` | Watkins Glen State Park – Watkins Glen, New York | `Watkins-Glen-State-Park-Watkins-Glen-New-York-1.webp` |
| 170 | `west-virginia-penitentiary-moundsville-west-virginia` | West Virginia Penitentiary – Moundsville, West Virginia | `West-Virginia-Penitentiary-Moundsville-West-Virginia-1.webp` |
| 171 | `white-mountain-national-forest-new-hampshire` | White Mountain National Forest, New Hampshire | `White-Mountain-National-Forest-New-Hampshire-1.webp` |
| 172 | `wildwood-new-jersey` | Wildwood, New Jersey | `Wildwood-New-Jersey-1.webp` |
| 173 | `williamsburg-virginia` | Williamsburg, Virginia | `Williamsburg-Virginia-1.webp` |
| 174 | `worlds-largest-toy-museum-branson-missouri` | World’s Largest Toy Museum – Branson, Missouri | `Worlds-Largest-Toy-Museum-Branson-Missouri-1.webp` |
| 175 | `yellowstone-national-park-wyoming` | Yellowstone National Park, Wyoming | `Yellowstone-National-Park-Wyoming-1.webp` |
| 176 | `yosemite-national-park-california` | Yosemite National Park, California | `Yosemite-National-Park-California-1.webp` |
| 177 | `zion-national-park-utah` | Zion National Park, Utah | `Zion-National-Park-Utah-1.webp` |
