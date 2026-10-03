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
| `seo` | Meta tags, sitemap, robots, structured data basics | addyosmani/web-quality-skills @ `afa8da9` | MIT |
| `seo-hreflang` | hreflang for the RU / EN / KA versions | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) @ `ff87fce` | MIT |
| `seo-schema` | Schema.org JSON-LD (Organization, Service, FAQ…) | AgriciDaniel/claude-seo @ `ff87fce` | MIT |

Local changes to vendored files: `seo-schema` points to its own copy of `references/schema-types.md` (taken from claude-seo's `seo` skill) instead of `../seo/references/`.
The claude-seo skills mention the plugin's helper scripts (`${CLAUDE_PLUGIN_ROOT}/scripts/claude-seo`); they are not vendored, so use the manual fallback each step describes.

To update a skill, copy its folder again from the source repository and bump the commit above.
