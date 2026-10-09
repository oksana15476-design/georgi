---
name: praxen-blog
description: How to write, format and publish blog articles for praxenai.com and praxenai.ge — topics, structure, the UI the blocks turn into, anti-AI style rules, SEO checklist and the checks to run before pushing. Use whenever an article is added to or edited in lib/intl-blog.ts or lib/ge-blog.ts, or the user asks for new blog posts on either site.
---

# Articles for the Praxen AI blogs

Two blogs, one codebase. The data is plain (heading, paragraphs, list, table); `components/article-blocks.tsx` turns it into UI on both sites. Owner decisions: **nothing is written or published without the owner's approval** (9 October 2026): send the owner the topics and an outline first, write and publish only after their yes; edits to published articles go through the owner too. 16 articles per blog so far; topics never repeat between the sites; everything shown with UI, in the spirit of the Saldo blog (repo `oksana15476-design/saldio`, `src/components/blog/ArticleBody.tsx`).

## Where things live

| | praxenai.com | praxenai.ge |
|---|---|---|
| Articles | `lib/intl-blog.ts` (`posts`) | `lib/ge-blog.ts` (`geArticles`, each with `ru`, `en`, `ka`) |
| Language | British English | Russian, English, Georgian (Georgian is proofread by the owner's team) |
| Prices | variables at the top of the file: `pilot`, `pilotP`, `custom`, `customP`, `training`, `trainingP`, `care`, `careP`, `rcSetup`, `rcMonth`, `usage` | `im`, `dev`, `tr`, `sup`, `usd('implementation'…)` |
| Register | add the slug to `blogSlugs` in `lib/intl.ts`, then `NEXT_PUBLIC_MARKET=intl npx tsx scripts/seo/llms-intl.ts` | nothing else: sitemap, hreflang and the list pick it up |
| Topics | `docs/CONTENT-PLAN.md` (table "Цель: по 10 статей") | same table, right column |

## Topic rules

- One article = one search intent = one next step. Check `docs/CONTENT-PLAN.md` and both blogs first; a topic used on one site is not used on the other.
- A commercial query that a service, industry or department page already targets is not taken by an article (example: "AI customer service" belongs to the .com support page, so the article is about the knowledge base).
- .com: never mention Georgia; "for businesses", not "for small businesses". .ge: tasks of companies in Georgia, prices in lari.

## Structure of an article

- `title`: main query near the start. .com ≤ 53 characters (" | Praxen AI" is added). .ge ≤ 70 (" — Praxen AI" is added only up to 50).
- `description`: 140–160 characters, the query plus what the reader gets.
- `answer` (the "Short answer" card, the passage AI search quotes): 2–3 sentences — what it is, what it costs with Praxen, how long it takes. Prices exclude VAT on .com.
- `blocks`: 5–7 sections of `{h, p?, list?, table?}`, 700–1,300 words in total.
- `faq`: 3–4 practical questions (FAQPage JSON-LD is generated).
- `links`: 3 internal links to existing pages (services, industries, departments, solutions or other articles). Two more articles from the same blog are added automatically.

## How blocks turn into UI (write the data so the UI works)

| Write this | It shows as |
|---|---|
| A table with a price column (£ $ € ₾ in at least half of the rows), first header not empty: `[['Format','What you get','Timeline','Price'],…]` | price cards: name, large price, note, a chip for a "Timeline / Срок / ვადა" column. A tail after the first comma in the price ("…a month, optional") becomes a small note. |
| A two-column table whose first header is "When / Когда / როდის" | a vertical timeline |
| A list under a heading that starts with "How…", "Step…", "Как…", "С чего…", "План…", "როგორ…" or contains "start", "launch", "запуск" | numbered steps |
| Any other list | accent bullets; "Lead: rest" or "Lead. Rest" (lead under 60 characters) shows the lead in bold |
| Any other table with 3+ columns | a table on desktop, stacked cards on phones |

Give every article at least one price table and, where it fits, one step list or timeline.

## Style (from the Saldo anti-AI rules, docs/seo/ANTI_AI_STYLE.md in saldio)

1. "Not X but Y" / «не X, а Y» antitheses: at most 1 per article, aim for 0. Rewrite as a plain statement.
2. No sentence repeats word for word between articles. Standard facts (illustrative figures, tokens paid to providers, free audit, pilot price) are worded differently in each article.
3. No table-of-contents intro ("Below we look at…") and no identical closing heading. The first screen is the definition plus the first useful fact.
4. Numbers only with a source or as a marked example ("The figures are illustrative…", «Цифры условные…»). No statistics, client names, ratings or testimonials. Laws and dates only when certain.
5. Short sentences, verbs and nouns. No aphorisms, drama or empty intensifiers. Vary paragraph length; lists have as many items as there really are.
6. People decide; AI drafts and prepares. Data stays in the client's accounts; enterprise APIs do not train on it.

## Before pushing

1. `npx tsx scripts/qa/blog-check.ts` — lengths, links, languages, antitheses, repeated sentences. Fix every FIX line.
2. `npx tsc --noEmit -p .` and `npx eslint components lib app`.
3. Build and look at the article at 1440 and 390 (`scripts/qa/serve.mjs`, `scripts/qa/shot.mjs`, see docs/HANDOFF.md): price cards, steps, tables on the phone, no horizontal scroll.
4. After the deploy: sitemap in Search Console and Bing, IndexNow (`scripts/seo/indexnow.mjs`), Yandex Webmaster for .ge.
