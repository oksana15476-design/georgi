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
// praxenai.com top-level sections; keep in sync with intlSections in lib/intl.ts.
const sections = ["ai-for-small-business", "services", "industries", "departments", "solutions", "training", "cases", "about", "security", "partners", "privacy", "terms", "blog"];
const withSlugs = ["services", "industries", "departments", "blog"];
// praxenai.ge top-level sections; keep in sync with geSections in app/[lang]/[[...section]]/page.tsx.
const geSections = ["industries", "departments", "training", "solutions", "cases", "partners", "privacy", "about", "security", "blog"];
const geWithSlugs = ["industries", "departments", "blog"];
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
      // English pages are served without the /en prefix on both sites (praxenai.ge since 12 October 2026);
      // old /en addresses redirect permanently. praxenai.ge keeps /ka and /ru.
      async redirects() {
        // A link pasted at the end of a sentence («…praxenai.com/privacy.») arrives with the dot.
        const privacyDot = { source: "/privacy.", destination: "/privacy", permanent: true };
        if (!intl) return [
          { source: "/en", destination: "/", permanent: true },
          { source: "/en/:path*", destination: "/:path*", permanent: true },
          privacyDot,
        ];
        return [
          { source: "/en", destination: "/", permanent: true },
          { source: "/en/:path*", destination: "/:path*", permanent: true },
          // Stage-1 addresses of praxenai.com.
          { source: "/pricing", destination: "/solutions", permanent: true },
          { source: "/ai-receptionist", destination: "/services/ai-receptionist", permanent: true },
          { source: "/services/ai-training", destination: "/training", permanent: true },
          privacyDot,
        ];
      },
      async rewrites() {
        if (!intl) return {
          beforeFiles: [
            { source: "/", destination: "/en" },
            ...geSections.map((s) => ({ source: `/${s}`, destination: `/en/${s}` })),
            ...geWithSlugs.map((s) => ({ source: `/${s}/:slug`, destination: `/en/${s}/:slug` })),
            // Webinar landing (app/[lang]/webinar): English without the /en prefix.
            { source: "/webinar", destination: "/en/webinar" },
            { source: "/webinar/offer", destination: "/en/webinar/offer" },
            { source: "/webinar/terms", destination: "/en/webinar/terms" },
          ],
        };
        return {
          beforeFiles: [
            { source: "/", destination: "/en" },
            ...sections.map((s) => ({ source: `/${s}`, destination: `/en/${s}` })),
            ...withSlugs.map((s) => ({ source: `/${s}/:slug`, destination: `/en/${s}/:slug` })),
            // public/llms.txt describes praxenai.ge; praxenai.com serves its own file.
            { source: "/llms.txt", destination: "/llms-intl.txt" },
          ],
        };
      },
    };

export default nextConfig;
