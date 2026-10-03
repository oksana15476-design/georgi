import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // English is the default language; the site has no page at the bare root.
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
