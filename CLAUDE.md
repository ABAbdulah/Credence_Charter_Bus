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
- All business details (name, phone, email, address, social, stats) come ONLY from `src/config/site.ts` — placeholder tokens until the owner fills them. Never hardcode them elsewhere.

## Design system (implemented Phase 1)
- Tokens live in `src/app/globals.css` (`:root` vars + `@theme inline` mapping, shadcn semantic names): background cream `#F7F5F0`, foreground ink `#22252B`, card/surface white, primary navy `#1B2A4A` (+ `--primary-hover #142138`), accent bronze `#C1A15A` (+ `--accent-hover #B08F49`), `--accent-deep #7A612A` (bronze for SMALL text — plain bronze fails 4.5:1 on light bg), muted-foreground slate `#5A6B82`, destructive muted brick `#9B3B34`, border `#DDD8CC`, input border `#857D6D` (3:1 non-text), radius 0.5rem.
- **Contrast rules:** never white text on bronze (2.6:1 — always ink); small bronze text uses `text-accent-deep` on light bg, plain `text-accent` is OK on navy (5.3:1); buttons on navy bg need `focus-visible:ring-primary-foreground/60` override (see CtaBand).
- Type: Bitter (--font-heading, headings/wordmark, slab = transit heritage) + Source Sans 3 (--font-sans, body). 18px base via `html { font-size: 112.5% }`. h1–h4 get font-heading + text-balance globally.
- Signature motif: bronze "route line" (dot—line—ring, origin→destination) via `<RouteLine />` in `section.tsx`; reuse for 3-step process connector. Keep everything else quiet.
- Primitives: `ui/` button (variants default/accent/outline/ghost; sizes default h-11, lg h-12, icon), card, container (max-w-6xl), section (Section/SectionHeading/RouteLine). Shell: `components/site/` logo (auto-swaps to `/brand/logo.svg` when present; `tone` prop for navy bg), header (sticky, nav via `src/config/nav.ts`), nav-links (client, aria-current + bronze underline), mobile-nav (client disclosure, Esc closes), footer (navy), call-bar (fixed bottom <md; body has pb-24 md:pb-0 to compensate), cta-band.
- No dark mode by design (light-only trust site). No neon, no saturated red/green.

## Accessibility acceptance criteria (verify at end of every UI phase)
- WCAG 2.1 AA min (AAA body-text contrast where feasible); 18px base font
- Targets ≥44×44px; keyboard navigable; visible focus rings; landmarks/aria
- `prefers-reduced-motion` respected; transitions ≤200ms fade/slide only
- Persistent mobile "Call Now" (tel:) button; phone in header + footer

## Data-file locations
- `src/config/site.ts` — siteConfig (business info placeholders, hero media swap point)
- `src/data/fleet.ts` — fleet categories + vehicles (Phase 2)
- `src/data/services.ts` — services (Phase 2)
- `src/data/locations/` — state→city dataset + ingestion script (Phase 3)
- `src/content/blogs/` — MDX/typed blog content (Phase 4)

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
- [ ] Phase 2 — Core marketing pages (home, fleet, services, about, contact, FAQ, quote form + stub API)
- [ ] Phase 3 — Programmatic location SEO engine (locations dataset, 3 route levels, ISR, variation system)
- [ ] Phase 4 — Blogs (index + detail, Article JSON-LD, rewritten + new SEO posts)
- [ ] Phase 5 — Technical SEO + performance (metadata everywhere, JSON-LD validation, sitemaps, Lighthouse ≥90/95/95)
- [ ] Phase 6 — Final QA (build, link check, no Vanguard tokens, swap-ability confirmed, README)
