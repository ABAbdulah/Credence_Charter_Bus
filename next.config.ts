import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 rejects any quality not listed here. The hero renders at 50;
    // without it the LCP image 400s and the optimizer worker dies mid-request.
    qualities: [50, 75],
  },
};

export default nextConfig;
