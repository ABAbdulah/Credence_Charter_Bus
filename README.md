# Credence Charter Bus

Marketing and lead-generation site for Credence Charter Bus — charter bus & coach rentals nationwide. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui.

## Quick start

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Fill in the business details (one file)

Every business fact on the site — name, phone, email, address, stats, founding year — reads from **`src/config/site.ts`**. Replace each `PLACEHOLDER_*` value and the entire site updates: header, footer, call bar, quote form, JSON-LD structured data, and sitemaps. Set `url` to the real production domain before launch (canonicals, OpenGraph, and sitemaps derive from it).

## Swap the hero media

`siteConfig.hero` in `src/config/site.ts` controls the home hero:

- **Image**: set `mediaType: "image"` and `mediaSrc: "/path/to/image.jpg"` (drop the file in `public/`). Leave `mediaSrc` empty to use the charter bus photo fallback.
- **Video**: set `mediaType: "video"` and `mediaSrc: "/path/to/video.mp4"`. It plays muted and looped, and respects `prefers-reduced-motion` (no autoplay for those users).

No layout changes needed either way.

## Swap the logo

Drop your file at **`public/brand/logo.svg`** — the `<Logo />` component detects it and replaces the wordmark automatically in the header and footer. Delete the file to return to the wordmark. Recommended: an SVG around 200×48 with a transparent background.

## Ingest the full city list (location pages)

Location pages are generated from `src/data/locations/locations.json` (seeded with 8 states / 60 cities). To load your full list:

```bash
node scripts/ingest-locations.mjs path/to/cities.csv
```

CSV needs a header row with columns (any order): `city,state,abbr,region,lat,lng,population`. `region` must be one of `Northeast`, `Midwest`, `South`, `West`. JSON input is also accepted (an array of the same fields, or a previously generated `{states, cities}` file).

Build behavior at scale:

- The **top 25 cities by population** are prerendered at build time (`locationsBuildConfig.prebuildCityLimit` in `src/data/locations/index.ts`).
- Every other city renders on first request and is cached for 24 hours (ISR). Change the window by editing the literal `export const revalidate = 86400` at the top of both files under `src/app/locations/[state]/` (Next.js requires a literal there).
- Sitemap shards update automatically: location URLs are split into ≤50,000-URL child sitemaps under `/sitemaps/locations-N.xml`, listed in the `/sitemap.xml` index.

City-page intro copy varies deterministically per city via `src/lib/variation.ts` — add more templates there to widen the spread.

## Wire the quote form to email/CRM

The form at `/quote` POSTs to `/api/quote`, which validates and then calls the `QuoteSender` interface in **`src/lib/quote-sender.ts`**. It ships with a console stub. To go live, replace the stub with your integration:

```ts
const resendQuoteSender: QuoteSender = {
  async send(request) {
    // e.g. Resend, SendGrid, SES, HubSpot, a webhook...
  },
}

export const quoteSender: QuoteSender = resendQuoteSender
```

Validation rules live in `src/lib/quote.ts` and run identically on the client and the server.

## Deploy (Vercel)

1. Push the repo to GitHub/GitLab.
2. In Vercel: **New Project → Import** the repo. Framework auto-detects as Next.js; no special settings needed.
3. Set the production domain, then update `siteConfig.url` to match and redeploy.
4. Post-deploy checks: `/robots.txt` and `/sitemap.xml` resolve; submit the sitemap in Google Search Console.

ISR works on Vercel out of the box — non-prebuilt city pages render on demand and cache at the edge.

## Content layers

| Content | File |
|---|---|
| Fleet categories (8) | `src/data/fleet.ts` (images in `public/fleet/`) |
| Services (6) | `src/data/services.ts` |
| Blog posts | `src/data/blogs.ts` |
| FAQ | `src/data/faq.ts` |
| Testimonials | `src/data/testimonials.ts` |
| States & cities | `src/data/locations/locations.json` |
| Nav items | `src/config/nav.ts` |
