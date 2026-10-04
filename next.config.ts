import type { NextConfig } from "next";

// Public settings baked into the client bundle. All optional; see .env.example.
const publicEnv = {
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID ?? "",
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  NEXT_PUBLIC_ADS_ID: process.env.NEXT_PUBLIC_ADS_ID ?? "",
  NEXT_PUBLIC_ADS_LEAD_LABEL: process.env.NEXT_PUBLIC_ADS_LEAD_LABEL ?? "",
  NEXT_PUBLIC_BOOKING_URL: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "",
};

// GITHUB_PAGES=1 builds a static copy of the site for GitHub Pages, served under /georgi.
// vinext's prerenderer does not apply Next's basePath, so links use NEXT_PUBLIC_BASE_PATH and
// scripts/pages-postbuild.mjs prefixes asset URLs. The lead form needs the server API and is
// unavailable on Pages (it shows the error state with the Telegram/phone alternatives).
const pages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = pages
  ? {
      output: "export",
      images: { unoptimized: true },
      env: {
        ...publicEnv,
        NEXT_PUBLIC_BASE_PATH: process.env.PAGES_BASE_PATH ?? "/georgi",
        NEXT_PUBLIC_SITE_URL: process.env.PAGES_SITE_URL ?? "https://oksana15476-design.github.io/georgi",
      },
    }
  : {
      env: publicEnv,
      // English is the default language; the site has no page at the bare root.
      async redirects() {
        return [{ source: "/", destination: "/en", permanent: false }];
      },
    };

export default nextConfig;
