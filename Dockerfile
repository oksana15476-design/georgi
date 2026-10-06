# Praxen AI site: static pages + lead API in one small Node container.
# Build:  docker build -t praxen-site --build-arg NEXT_PUBLIC_SITE_URL=https://example.ge .
# Run:    docker run -p 3000:3000 --env-file .env praxen-site

# --- build: render all pages to static HTML (Debian: the Cloudflare/Vite toolchain needs glibc) ---
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
# Retries ride out a flaky network on the build machine.
RUN npm ci --no-audit --no-fund --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
COPY . .
# Public settings are baked into the pages at build time. Build arguments win; empty ones fall
# back to deploy/public.env.sh, so the build does not depend on how the hosting passes variables.
ARG NEXT_PUBLIC_SITE_URL=""
ARG NEXT_PUBLIC_GA_ID=""
ARG NEXT_PUBLIC_META_PIXEL_ID=""
ARG NEXT_PUBLIC_ADS_ID=""
ARG NEXT_PUBLIC_ADS_LEAD_LABEL=""
ARG NEXT_PUBLIC_BOOKING_URL=""
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID \
    NEXT_PUBLIC_ADS_ID=$NEXT_PUBLIC_ADS_ID \
    NEXT_PUBLIC_ADS_LEAD_LABEL=$NEXT_PUBLIC_ADS_LEAD_LABEL \
    NEXT_PUBLIC_BOOKING_URL=$NEXT_PUBLIC_BOOKING_URL \
    WRANGLER_SEND_METRICS=false
RUN . ./deploy/public.env.sh && npm run build:static

# --- runtime: Node only, no node_modules ---
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/out ./out
COPY server ./server
COPY lib/lead-delivery.mjs ./lib/lead-delivery.mjs
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["node", "server/index.mjs"]
