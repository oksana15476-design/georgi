# Project skills

Agent skills for Claude Code, picked for this stack: vinext (Next.js API on Vite) + Cloudflare Workers, React 19, a multilingual marketing site with a lead form.
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

To update a skill, copy its folder again from the source repository and bump the commit above.
