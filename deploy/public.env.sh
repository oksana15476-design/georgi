# Public build settings for the Docker image. They are baked into the pages, so they must be
# known at build time. Fill them in here so the build does not depend on how the hosting passes
# variables: a non-empty build argument (or environment variable) still wins over these values.
# Only public values belong here. Secrets (TELEGRAM_BOT_TOKEN, RESEND_API_KEY, AMO_TOKEN) are set
# in the hosting panel and are read by the server at run time.

: "${NEXT_PUBLIC_SITE_URL:=https://praxenai.ge}"  # bought 2026-10-06 at INWX (no trailing slash)
: "${NEXT_PUBLIC_GA_ID:=}"             # G-XXXXXXXXXX
: "${NEXT_PUBLIC_META_PIXEL_ID:=}"     # 15–16 digits from Meta Events Manager
: "${NEXT_PUBLIC_YM_ID:=}"             # Yandex Metrica counter number
: "${NEXT_PUBLIC_ADS_ID:=}"            # AW-XXXXXXXXX
: "${NEXT_PUBLIC_ADS_LEAD_LABEL:=}"    # label of the Google Ads "lead" conversion
: "${NEXT_PUBLIC_BOOKING_URL:=}"       # Cal.com or Calendly link for the free audit

export NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_GA_ID NEXT_PUBLIC_META_PIXEL_ID NEXT_PUBLIC_YM_ID NEXT_PUBLIC_ADS_ID NEXT_PUBLIC_ADS_LEAD_LABEL NEXT_PUBLIC_BOOKING_URL
