# Blog migration + keyword brief

**Paste this alongside `MIGRATION-AUDIT.md` to start the blog phase.** This file is the *what and why*; `MIGRATION-AUDIT.md` §2 is the *where* (file paths, data shape, ingestion script, pagination, state archives).

---

## The brief, in one paragraph

Port the 177 destination blog posts from the old Vanguard site onto the Credence site — that set is the floor, not the ceiling. While porting, work SEO keywords into each post. Blogs are the right place for this: they are long-form, readers skim them rather than study them, and there is enough room in 1,000+ words to place target phrases where they read naturally. The model to copy is a sentence already on the old site's `/fleet` page — *"Planning group travel and searching for CHARTER BUS RENTAL NEAR ME? Our team pairs every itinerary with a LUXURY CHARTER BUS experience…"* — where a high-intent search phrase sits inside a sentence that still reads like a person wrote it. That kind of placement is easy to do in blog copy and hard to do on short marketing pages, so blogs should carry the bulk of the keyword work. Every post must also link out to the fleet (vehicle) pages and the services pages — that connection is the point of the whole exercise, because a destination guide that doesn't route the reader to a bookable vehicle or service is just an article.

---

## 1. Scope

- **Minimum:** all 177 old posts, slugs preserved exactly (full list: `MIGRATION-AUDIT.md` Appendix A).
- Keep the 6 existing how-to posts. They are a different content type and complement the destination guides — 183 total.
- New posts beyond the 177 are welcome later but are not part of this phase.
- **Every Vanguard brand mention inside post bodies must be replaced** (e.g. the Anchorage post literally says *"Here at Vanguard CHARTER BUS…"*). No Vanguard token may ship.

---

## 2. Keyword strategy

### 2a. The pattern to imitate

From the old `/fleet` page — the only place on the old site doing this deliberately:

> Planning group travel and searching for **CHARTER BUS RENTAL NEAR ME**? Our team pairs every itinerary with a **LUXURY CHARTER BUS** experience, backed by professional drivers, polished interiors, and flexible configurations.

What makes it work: the phrase is the *object of a real sentence*, not a bolted-on tag. What to change: drop the ALL-CAPS. Caps signal keyword stuffing to both readers and crawlers; sentence case reads as intentional writing.

### 2b. Keyword tiers per post

Each post gets phrases from all three tiers. One primary, a handful of secondary, the rest woven in where they fit.

| Tier | Pattern | Example (for `arches-national-park-utah`) | Where it goes |
|---|---|---|---|
| **Primary — destination + intent** | `{destination} group trip`, `{destination} charter bus`, `bus rental to {destination}` | "charter bus to Arches National Park" | Title-adjacent, first paragraph, one `h2`, meta description |
| **Secondary — vehicle** | `{vehicle} rental`, `luxury charter bus`, `{N}-passenger {vehicle}` | "56-passenger motorcoach", "mini bus rental" | The vehicle-recommendation section |
| **Secondary — service** | `{service} transportation`, `group transportation for {occasion}` | "school trip transportation", "sports team travel" | The who-this-trip-suits section |
| **Local — near-me + geo** | `charter bus rental near me`, `charter bus rental in {city}, {state}`, `{city} to {destination} bus` | "charter bus rental in Moab, Utah" | Getting-there / logistics section, once each |

### 2c. Placement rules

- **Primary phrase in the first 100 words**, once. Not twice.
- **One `h2` carries the primary phrase or a close variant.** The rest of the headings stay descriptive and useful ("When to go", "Where the bus can actually park").
- **Near-me phrase: at most once per post**, inside a logistics sentence. It is a high-value phrase and a high-risk one — repeated, it reads like spam.
- **City/state phrases go where the trip logistics are discussed**, so they carry real information (drive time, pickup points, parking).
- **Never stack phrases in a row.** No "charter bus rental, bus rental near me, luxury bus rental" lists.
- **Alt text is content, not a keyword field.** Describe the image; if the phrase fits, fine.
- **Meta description** (`MIGRATION-AUDIT.md` uses `pageMetadata()`) carries the primary phrase once, under 155 characters.

### 2d. Density target

Roughly **0.5–1.5% for the primary phrase** — in a 1,200-word post that is 6 to 18 mentions across *all* variants combined, not 18 of the same string. If a sentence would sound worse to a human with the phrase in it, leave the phrase out. The client's point was that blogs make natural placement *easier*, not that readability stops mattering.

---

## 3. Internal linking — mandatory, not optional

This is the part the client called out as most important. Every post links into the bookable side of the site.

Each post carries, at minimum:

| Link type | Count | Target |
|---|---|---|
| Fleet / vehicle | **2–3** | `/fleet/{category}` — the vehicles that actually suit that trip (a national park guide points at motorcoaches and mini buses, a city nightlife guide at party buses and limousines) |
| Service | **1–2** | `/services/{slug}` — the service that matches the trip type |
| Location | **1–2** | `/locations/{state}/{city}` — the nearest real city page(s) to the destination |
| Related posts | **2–3** | Other destination guides in the same state or region |
| Quote CTA | **1** | `/quote` — end of post |

The existing `BlogPost` type already has `planningLinks` and `relatedPostSlugs` (see `src/data/blogs.ts`). Fleet/service/location links go in `planningLinks`; posts link to each other via `relatedPostSlugs`. Extend the type if the ingestion needs a separate `locationLinks` field rather than overloading one array.

**Links must be inside or adjacent to relevant copy**, not dumped in a footer block. A "Related links" list at the bottom is fine *in addition to* in-body links, not instead of them.

**Every link target must exist.** The location links in particular must resolve against `src/data/locations/locations.json` — a link to a city slug that isn't in the dataset is a 404. Validate during ingestion, not after.

---

## 4. Writing rules

`CLAUDE.md`'s no-AI-slop rule applies to prose, not just code:

- Keep the old posts' voice where it is good. They open with a concrete hook ("Imagine standing beneath a colossal arch carved by millennia of wind and water…") — that is better than most generated travel copy. Don't flatten it into "Are you looking for an unforgettable experience?"
- No emoji, no fake urgency, no wall of bold text.
- Facts stay accurate: park entrance rules, drive times, seasons, parking availability. If the old post states a fact that can't be verified, keep it only if it is uncontroversial; drop invented specifics.
- Charter-bus claims must match the rest of the site. Don't promise on-board Wi-Fi in a blog if `src/data/fleet.ts` says "on request" — `MIGRATION-AUDIT.md` §3 already flags that old and new disagree on amenities and capacities. **Settle that first, then write.**
- Audience skews older: plain sentences, no jargon, no clever headings that hide what the section is about.

---

## 5. Per-post output contract

Each post ends up as `src/content/blogs/{slug}.json` matching `BlogPost` (see `MIGRATION-AUDIT.md` §2 for the full architecture, including why it moves out of `src/data/blogs.ts`):

```
slug              unchanged from the old site
title             unchanged, minus brand references
excerpt           rewritten to carry the primary phrase, ~160 chars
date              the old site's real publish date — do not invent
state, stateAbbr  drives the /blogs/state/{state} archives
heroImage         public/blogs/{slug}.webp, alt text describing the photo
body              BlogBlock[] — p / h2 / ul
planningLinks     fleet + service + location links (§3)
relatedPostSlugs  2–3, validated to exist
source            "migrated"
```

Add a `keywords` field only if something consumes it. Next.js `<meta name="keywords">` is ignored by Google — the old site had one and it did nothing. Don't port that.

---

## 6. Guardrails worth knowing before starting

Not objections — just the two things that could undo the work:

1. **Scaled-content risk is already live on this project.** `CLAUDE.md` flags it for the 16k programmatic city pages. Adding 177 keyword-optimised posts on top raises the same flag. The defence is the same: real, specific, non-templated information per page. Destination guides with genuine detail are exactly the right kind of content; the risk is only if the keyword pass hollows them out.
2. **Duplicate content.** If vanguardcharterbus.com stays live with the same 177 posts, Google picks one — probably the older domain. The rewrite pass for keywords helps here (the pages stop being byte-identical), but the real fix is a 301 from the old domain. See `MIGRATION-AUDIT.md` §8 and open question 4.

---

## 7. Unclear in the original brief — confirm before starting

1. Part of the client's note mentioned something like *"year minus seven CDA"* — this did not transcribe cleanly and I could not map it to anything on either site. **Ask what this referred to.**
2. *"Vehicle sales services se bhi connect kiya hua hai"* — I have read this as **"blogs must also be linked to the vehicle (fleet) and services pages"**, which is how §3 is written. If it meant something else (a vehicle *sales* line of business, which neither site currently has), that changes the brief.
3. Whether the keyword pass should also cover the **6 existing how-to posts**, or only the 177 migrated ones.
4. Whether there is a **client-supplied keyword list** (Search Console, Ahrefs, an agency doc). If yes, use it — the tiers in §2b are inferred from the old site's own copy, not from search data.

---

## 8. Suggested order of work

1. Settle §7 questions + the fleet capacity/amenity conflict (`MIGRATION-AUDIT.md` open question 6) — blog copy references both.
2. Build `scripts/ingest-blogs.mjs` and the `src/content/blogs/` refactor (`MIGRATION-AUDIT.md` §2). Run it on **5 posts first** and review the output shape before the full 177.
3. Full ingest: 177 posts + 177 hero images, brand scrub, link rewrite.
4. Keyword + internal-link pass, in batches of ~20 posts, reviewed per batch.
5. Pagination, state archives, sitemap wiring.
6. QA: zero Vanguard tokens, every `planningLinks` target resolves, every `relatedPostSlugs` entry exists, no post links to a city outside `locations.json`, Lighthouse on `/blogs` and on three sample posts still ≥90.
