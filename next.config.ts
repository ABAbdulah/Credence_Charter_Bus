import type { NextConfig } from "next";

/**
 * Old-site URL shapes → current routes, so legacy inbound links and any
 * future 301 of the old domain land on real pages. Aliases cover both the
 * old `/fleet/category/{slug}` category level and the old `/fleet/{slug}`
 * vehicle-detail level, which the current site flattens into one page.
 * `charter-buses` is this site's own retired category (owner folded it into
 * Motor Coaches / Coach Buses), so it redirects too.
 */
const fleetAliases: Record<string, string[]> = {
  "motor-coaches": [
    "motor-coach",
    "charter-bus-56",
    "charter-bus",
    "charter-buses",
  ],
  "coach-buses": ["coach-bus"],
  "mini-buses": ["mini-bus", "mini-bus-35"],
  "sprinter-vans": ["sprinter-van", "sprinter-van-14"],
  "school-buses": ["school-bus"],
  "party-buses": ["party-bus"],
  limousines: ["limousine", "stretch-limousine"],
  suvs: ["suv"],
  sedans: ["sedan"],
};

const stateSlugsByAbbr: Record<string, string> = {
  al: "alabama",
  ak: "alaska",
  az: "arizona",
  ar: "arkansas",
  ca: "california",
  co: "colorado",
  ct: "connecticut",
  de: "delaware",
  dc: "district-of-columbia",
  fl: "florida",
  ga: "georgia",
  hi: "hawaii",
  id: "idaho",
  il: "illinois",
  in: "indiana",
  ia: "iowa",
  ks: "kansas",
  ky: "kentucky",
  la: "louisiana",
  me: "maine",
  md: "maryland",
  ma: "massachusetts",
  mi: "michigan",
  mn: "minnesota",
  ms: "mississippi",
  mo: "missouri",
  mt: "montana",
  ne: "nebraska",
  nv: "nevada",
  nh: "new-hampshire",
  nj: "new-jersey",
  nm: "new-mexico",
  ny: "new-york",
  nc: "north-carolina",
  nd: "north-dakota",
  oh: "ohio",
  ok: "oklahoma",
  or: "oregon",
  pa: "pennsylvania",
  ri: "rhode-island",
  sc: "south-carolina",
  sd: "south-dakota",
  tn: "tennessee",
  tx: "texas",
  ut: "utah",
  vt: "vermont",
  va: "virginia",
  wa: "washington",
  wv: "west-virginia",
  wi: "wisconsin",
  wy: "wyoming",
};

const nextConfig: NextConfig = {
  images: {
    // Next 16 rejects any quality not listed here. The hero renders at 50;
    // without it the LCP image 400s and the optimizer worker dies mid-request.
    qualities: [50, 75],
  },
  async redirects() {
    return [
      ...Object.entries(fleetAliases).flatMap(([slug, aliases]) =>
        aliases.flatMap((alias) => [
          {
            source: `/fleet/category/${alias}`,
            destination: `/fleet/${slug}`,
            permanent: true,
          },
          {
            source: `/fleet/${alias}`,
            destination: `/fleet/${slug}`,
            permanent: true,
          },
        ])
      ),
      {
        source: "/services/wedding-party",
        destination: "/services/wedding-transportation",
        permanent: true,
      },
      ...Object.entries(stateSlugsByAbbr).flatMap(([abbr, slug]) => [
        {
          source: `/locations/state/${abbr}`,
          destination: `/locations/${slug}`,
          permanent: true,
        },
        {
          source: `/locations/state/${abbr}/:city`,
          destination: `/locations/${slug}/:city`,
          permanent: true,
        },
      ]),
      { source: "/driver", destination: "/drivers", permanent: true },
      { source: "/about/driver", destination: "/drivers", permanent: true },
      {
        source: "/about/affiliate",
        destination: "/affiliates",
        permanent: true,
      },
      {
        source: "/about/tutorial",
        destination: "/how-to-book",
        permanent: true,
      },
      { source: "/about/booking", destination: "/quote", permanent: true },
      { source: "/tour-booking", destination: "/quote", permanent: true },
      { source: "/reviews", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
