import type { NextConfig } from "next";

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
        NEXT_PUBLIC_BASE_PATH: process.env.PAGES_BASE_PATH ?? "/georgi",
        NEXT_PUBLIC_SITE_URL: process.env.PAGES_SITE_URL ?? "https://oksana15476-design.github.io/georgi",
        NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID ?? "",
      },
    }
  : {
      // English is the default language; the site has no page at the bare root.
      async redirects() {
        return [{ source: "/", destination: "/en", permanent: false }];
      },
    };

export default nextConfig;
