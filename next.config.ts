import type { NextConfig } from "next";

// Public settings baked into the client bundle. All optional; see .env.example.
const publicEnv = {
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID ?? "",
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  NEXT_PUBLIC_ADS_ID: process.env.NEXT_PUBLIC_ADS_ID ?? "",
  NEXT_PUBLIC_ADS_LEAD_LABEL: process.env.NEXT_PUBLIC_ADS_LEAD_LABEL ?? "",
  NEXT_PUBLIC_BOOKING_URL: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  NEXT_PUBLIC_MARKET: process.env.NEXT_PUBLIC_MARKET ?? "",
  NEXT_PUBLIC_INTL_LIVE: process.env.NEXT_PUBLIC_INTL_LIVE ?? "",
};

// Static export modes (vinext's prerenderer does not apply Next's basePath, so links use
// NEXT_PUBLIC_BASE_PATH and scripts/pages-postbuild.mjs prefixes asset URLs):
// - GITHUB_PAGES=1: copy for GitHub Pages under /georgi; no lead API there.
// - STATIC_EXPORT=1: site root build for the Docker image, where server/index.mjs serves the
//   pages and the lead API. Set NEXT_PUBLIC_SITE_URL to the public domain.
const githubPages = process.env.GITHUB_PAGES === "1";
const intl = process.env.NEXT_PUBLIC_MARKET === "intl";
// Top-level pages under app/[lang]; keep in sync with app/[lang]/[[...section]]/page.tsx.
const sections = ["industries", "departments", "training", "solutions", "cases", "partners", "privacy"];
const pages = githubPages || process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = pages
  ? {
      output: "export",
      images: { unoptimized: true },
      env: {
        ...publicEnv,
        NEXT_PUBLIC_BASE_PATH: process.env.PAGES_BASE_PATH ?? (githubPages ? "/georgi" : ""),
        NEXT_PUBLIC_SITE_URL: process.env.PAGES_SITE_URL ?? (githubPages ? "https://oksana15476-design.github.io/georgi" : publicEnv.NEXT_PUBLIC_SITE_URL),
      },
    }
  : {
      env: publicEnv,
      // praxenai.ge: English is the default language; the site has no page at the bare root.
      // praxenai.com (intl): English only, served without the /en prefix.
      async redirects() {
        if (!intl) return [{ source: "/", destination: "/en", permanent: false }];
        return [
          { source: "/en", destination: "/", permanent: true },
          { source: "/en/:path*", destination: "/:path*", permanent: true },
        ];
      },
      async rewrites() {
        if (!intl) return { beforeFiles: [] };
        return {
          beforeFiles: [
            { source: "/", destination: "/en" },
            ...sections.flatMap((s) => [
              { source: `/${s}`, destination: `/en/${s}` },
              { source: `/${s}/:slug`, destination: `/en/${s}/:slug` },
            ]),
          ],
        };
      },
    };

export default nextConfig;
