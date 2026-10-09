# Project skills

Agent skills for Claude Code, picked for this stack: vinext (Next.js API on Vite) + Cloudflare Workers, React 19, Tailwind 4 + shadcn/ui, a multilingual (RU / EN / KA) marketing site with a lead form.
Claude Code loads them automatically from `.claude/skills/`.

| Skill | Use it for | Source | License |
|---|---|---|---|
| `nextjs-on-cloudflare` | vinext on Workers: build, deploy | [cloudflare/skills](https://github.com/cloudflare/skills) @ `41e0d19` | Apache-2.0 |
| `workers-best-practices` | Writing/reviewing Worker code (`app/api/leads/route.ts`) | cloudflare/skills @ `41e0d19` | Apache-2.0 |
| `wrangler` | `npm start`, secrets (`TELEGRAM_*`), deploy | cloudflare/skills @ `41e0d19` | Apache-2.0 |
| `web-perf` | Core Web Vitals / Lighthouse audits | cloudflare/skills @ `41e0d19` | Apache-2.0 |
| `react-best-practices` | React/Next.js performance rules | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) @ `063bee9` | MIT |
| `web-design-guidelines` | UI / accessibility / UX review | vercel-labs/agent-skills @ `063bee9` | MIT |
| `frontend-design` | Visual design of new or reworked UI | [anthropics/skills](https://github.com/anthropics/skills) @ `8a1541c` | see `LICENSE.txt` |
| `webapp-testing` | Playwright checks and screenshots of the running site | anthropics/skills @ `8a1541c` | see `LICENSE.txt` |
| `shadcn` | Adding, fixing and styling shadcn/ui components (`components/ui/`) | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) @ `295a1f1` | MIT |
| `tailwind-design-system` | Tailwind v4 tokens, theming, component styling | [wshobson/agents](https://github.com/wshobson/agents) @ `156b7a5` | MIT |
| `responsive-design` | Mobile-first layout, Grid/Flexbox, container queries, fluid type | wshobson/agents @ `156b7a5` | MIT |
| `visual-design-foundations` | Typography, color, spacing, iconography | wshobson/agents @ `156b7a5` | MIT |
| `accessibility` | WCAG 2.2 audit and fixes | [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) @ `afa8da9` | MIT |
| `seo` | **Main SEO rules (owner's choice, 9 Oct 2026):** technical and on-page SEO, one URL = one intent, keyword mapping and cannibalisation, internal links. `SKILL.md` replaced by the ECC version; `references/` stay from claude-seo (other `seo-*` skills link to them), the old addyosmani licence is in `references/LICENSE-addyosmani-seo` | [affaan-m/ECC](https://github.com/affaan-m/ECC) `skills/seo`, main, 9 Oct 2026 | MIT |
| `seo-hreflang`, `seo-schema` | hreflang for RU / EN / KA; Schema.org JSON-LD | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) @ `4b99de2` | MIT |
| `seo-audit`, `seo-technical`, `seo-page`, `seo-content`, `seo-sitemap` | Site-wide, technical, single-page and content audits; sitemaps | AgriciDaniel/claude-seo @ `4b99de2` | MIT |
| `seo-plan`, `seo-cluster`, `seo-content-brief`, `seo-programmatic`, `seo-competitor-pages` | SEO strategy, keyword clustering, content briefs, pages at scale, comparison pages | AgriciDaniel/claude-seo @ `4b99de2` | MIT |
| `seo-dataforseo`, `seo-google` | Live keyword volumes, SERPs (DataForSEO MCP); Search Console, PageSpeed, CrUX, GA4 | AgriciDaniel/claude-seo @ `4b99de2` | MIT |
| `seo-geo`, `seo-agentic`, `seo-local`, `seo-sxo`, `seo-backlinks` | AI Overviews / answer engines, agent readiness, local SEO, search intent, links | AgriciDaniel/claude-seo @ `4b99de2` | MIT |
| `geo` (+ `scripts/`, `templates/`, `schema/`), `geo-audit`, `geo-citability`, `geo-crawlers`, `geo-llmstxt`, `geo-platform-optimizer`, `geo-brand-mentions`, `geo-content`, `geo-schema`, `geo-technical` | GEO: visibility in ChatGPT, Claude, Perplexity, Gemini, AI Overviews | [zubair-trabzada/geo-seo-claude](https://github.com/zubair-trabzada/geo-seo-claude) @ `ea29bd2` | MIT |
| `product-marketing`, `ai-seo`, `content-strategy`, `site-architecture`, `programmatic-seo`, `copywriting`, `cro`, `lead-magnets`, `cold-email`, `ads`, `ad-creative`, `competitor-profiling`, `customer-research` | Positioning, AI SEO, content plan, site structure, copy, conversion, outreach, paid ads, competitor and customer research | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) @ `dda3841` | MIT |
| `yandex-metrika`, `yandex-wordstat`, `yandex-webmaster` | Yandex Metrica reports (counter 113476399), Wordstat demand / keyword research, Yandex Webmaster indexing, queries, sitemaps, recrawl | [artwist-polyakov/polyakov-claude-skills](https://github.com/artwist-polyakov/polyakov-claude-skills), copied from the Saldo repo | see upstream |
| `praxen-blog` | **Project rules for blog articles on both sites**: topics, structure, block-to-UI mapping, anti-AI style, SEO checklist, `scripts/qa/blog-check.ts` | this repo | — |
| `on-page-seo`, `technical-seo`, `schema-markup`, `internal-linking`, `keyword-clustering`, `marketing-seo-audit`, `broken-links`, `ai-visibility` | Page-level and technical SEO, JSON-LD, internal links, keyword groups, full SEO audit, dead links, visibility in AI answers | copied (instructions only) from the Saldo repo `oksana15476-design/saldio`, 8 Oct 2026 | see upstream |
| `humanizer` | **Final pass on every text (owner's choice):** 26 patterns of AI writing from Wikipedia's "Signs of AI writing" | [blader/humanizer](https://github.com/blader/humanizer), main, 9 Oct 2026 | MIT |
| `brand-voice`, `content-engine`, `marketing-campaign` | **Owner's choice:** voice profile built from real copy (`brand-voice`, ECC; the copy that came from Saldo was already this version), platform-native posts from one source (`content-engine`), multi-channel campaign from positioning to calendar (`marketing-campaign`) | [affaan-m/ECC](https://github.com/affaan-m/ECC) `skills/*`, main, 9 Oct 2026 | MIT |
| `content-brief`, `content-creation`, `draft-content`, `brand-review`, `ux-copy` | Article briefs and drafts, house voice, editor's review before publishing (copywriter → editor), interface copy | copied (instructions only) from the Saldo repo, 8 Oct 2026 | see upstream |
| Agents `praxen-seo-editor`, `praxen-copywriter`, `praxen-editor-in-chief` (`.claude/agents/`) | Blog editorial team: topic and brief → draft → editor's «принято»; process and checklist in `docs/BLOG-EDITORIAL.md` | written for this repo after the Saldo agents `saldo-copywriter` / `saldo-editor-in-chief` | — |
| `social-content` | Posts for Facebook, Instagram, LinkedIn and Google Business Profile: KA / RU / EN copy and branded 1080×1350 cards (`scripts/social/render.mjs`) | written for this repo | — |

Local changes to vendored files:
- `seo-schema` points to its own copy of `references/schema-types.md` instead of `../seo/references/`.
- The claude-seo orchestrator skill is not vendored (its name clashes with `seo`); its `references/` files were copied into `seo/references/` so the `../seo/references/...` links in the claude-seo skills resolve.
- claude-seo helper scripts, sub-agents and its PostToolUse hook are not vendored; skills that mention `${CLAUDE_PLUGIN_ROOT}/scripts/...` fall back to the manual steps they describe.
- `geo` paths were changed from `~/.claude/skills/` to `.claude/skills/`. Its Python helpers need `pip install -r .claude/skills/geo/requirements.txt`. The agency tools (CRM dashboard, proposal, prospecting, PDF reports) were left out.
- Marketing skills read shared product context. It lives at `.claude/product-marketing.md` because `/.agents/` is git-ignored here; keep it there if a skill offers to move it. It is a draft filled from the site; items marked ⚠ need confirmation.
- Yandex skills need credentials in each skill's `config/` (see its `config/README.md`): `YANDEX_METRIKA_TOKEN`, `YANDEX_WORDSTAT_TOKEN` or a Yandex Cloud service account, `YANDEX_WEBMASTER_TOKEN`. These files are git-ignored; never commit tokens. `yandex-wordstat` got its own `.gitignore` for `config/.env`, `config/config.json` and `config/service_account_key.json`.

To update a skill, copy its folder again from the source repository and bump the commit above.

## Plugins

`.claude/settings.json` enables [Superpowers](https://github.com/obra/superpowers) (`superpowers@anthropic-plugin-directory`, MIT): brainstorming → plan → TDD → code review → verification workflow, systematic debugging, git worktrees.
It is a plugin, not vendored skills, because its skills reference each other as `superpowers:<skill>` and it ships a SessionStart hook. Claude Code offers to install it when the project is opened.

Not copied from Saldo: `crawl4ai-seo` and `yandex-search-api` (they ship Python and shell scripts; add them only with the owner's approval).
