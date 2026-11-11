---
name: praxen-blog
description: How to write, format and publish blog articles for praxenai.com and praxenai.ge — topics, structure, the UI the blocks turn into, anti-AI style rules, SEO checklist and the checks to run before pushing. Use whenever an article is added to or edited in lib/intl-blog.ts or lib/ge-blog.ts, or the user asks for new blog posts on either site.
---

# Articles for the Praxen AI blogs

Two blogs, one codebase. The data is plain (heading, paragraphs, list, table); `components/article-blocks.tsx` turns it into UI on both sites. Owner decisions: **we write and publish ourselves** (CLAUDE.md, rule 7, decision of 9 November 2026, replaces the decision of 9 October): an article goes live once the editor-in-chief gives «принято» and the checks pass, with no yes from the owner; the same applies to edits of published articles; the owner gets a short summary in the report. One new article a day on each blog (CLAUDE.md, rule 9); topics never repeat between the sites; everything shown with UI, in the spirit of the Saldo blog (repo `oksana15476-design/saldio`, `src/components/blog/ArticleBody.tsx`).

## Where things live

| | praxenai.com | praxenai.ge |
|---|---|---|
| Articles | `lib/intl-blog.ts` (`posts`) | `lib/ge-blog.ts` (`geArticles`, each with `ru`, `en`, `ka`) |
| Language | British English | Russian, English, Georgian (Georgian is proofread by the owner's team) |
| Prices | variables at the top of the file: `pilot`, `pilotP`, `custom`, `customP`, `training`, `trainingP`, `care`, `careP`, `rcSetup`, `rcMonth`, `usage` | `im`, `dev`, `tr`, `sup`, `usd('implementation'…)` |
| Register | add the slug to `blogSlugs` in `lib/intl.ts`, then `NEXT_PUBLIC_MARKET=intl npx tsx scripts/seo/llms-intl.ts` | nothing else: sitemap, hreflang and the list pick it up |
| Topics | the month's calendar `docs/blog-com/CALENDAR-ГГГГ-ММ.md` | the month's calendar `docs/blog-ge/CALENDAR-ГГГГ-ММ.md` (demand from Yandex Wordstat, `docs/seo-data/ge-cis-semantics-2026-11.md`) |

## Topic rules

- **Topics and articles are unique on both sites** (owner decision, 9 October 2026). An article may support a commercial page (service, industry, department): it answers the question in more depth and links to the page, without copying its text. Inside one blog there are no repeats: one query = one article, one thesis = one owner article and the others link to it; each article has its own examples and calculations; standard caveats (tokens, client accounts, free audit) are not repeated in every article. Topics never repeat between the sites. Articles go through the editorial team (SEO editor → copywriter → editor-in-chief; Georgian versions also go to the owner's team for proofreading), see `docs/BLOG-EDITORIAL.md` and the agents in `.claude/agents/`. Current overlaps: `docs/BLOG-AUDIT-2026-10.md`.
- One article = one search intent = one next step. Check the month's calendars (`docs/blog-com/CALENDAR-ГГГГ-ММ.md`, `docs/blog-ge/CALENDAR-ГГГГ-ММ.md`) and both blogs first; a topic used on one site is not used on the other.
- A commercial query that a service, industry or department page already targets is not taken by an article (example: "AI customer service" belongs to the .com support page, so the article is about the knowledge base).
- .com: never mention Georgia; "for businesses", not "for small businesses". .ge: tasks of companies in Georgia, prices in lari.

## Structure of an article

- `title`: main query near the start. .com ≤ 53 characters (" | Praxen AI" is added). .ge ≤ 70 (" — Praxen AI" is added only up to 50).
- `description`: 140–160 characters, the query plus what the reader gets.
- `answer` (the "Short answer" / «Коротко» card, the passage AI search quotes): 2–3 sentences that answer the article's query on their own: what it is plus one fact on the topic. **No stock sentence about the pilot or training price** (owner decision, 11 November 2026). In an article about cost the answer says what the cost is made of; the Praxen price still goes in the last section.
- `blocks`: 5–7 sections of `{h, p?, list?, table?}`, 700–1,300 words in total (the "Sources" block below is not counted).
- **Price once, in the last section, and only where it is on topic** (owner decision, 11 November 2026). The reader came for the price (cost articles, training, "how to order") → a price table or one sentence with the site variable in the last content section. Otherwise there is no price in the article; the CTA leads to the service page or `/solutions`. Prices always come from the variables at the top of the file, never typed in; .com prices exclude VAT.
- **2–3 primary sources in every new article, each with the date it was checked** (owner decision, 11 November 2026): official pages, the text of a law (legislation.gov.uk, matsne.gov.ge), the documentation or price page of the service (OpenAI, Microsoft, Meta, Telegram, Bitrix24, amoCRM…). Blogs, aggregators and competitors' articles do not count. Each source backs a specific fact in the text. A source does not replace rule 4 of Style: laws and dates are still written only when certain, legal points go to the owner. How to give sources now: see "Sources block" below.
- **A call to action on the article's topic** (owner decision, 11 November 2026): one concrete next step that follows from the article (training → book the session, WhatsApp bot → chatbot pilot, cost → calculator on `/solutions`, choosing a contractor → audit), with the matching page in `links`. Not "contact us" or "book a call" without a subject. The CTA card under every article is shared code for now (`components/intl/blocks.tsx`, `components/praxen/blog.tsx`) and is changed by a code session; until it accepts a per-article CTA, the topical next step is the last sentence of the last content section.
- `faq`: 3–4 practical questions (FAQPage JSON-LD is generated).
- `links`: 3 internal links to existing pages (services, industries, departments, solutions or other articles). Two more articles from the same blog are added automatically.

### Sources block (until the article format supports links)

`components/article-blocks.tsx` renders text as plain text: no clickable links in paragraphs, lists or tables, and there is no `sources` field. So for now sources go in **the last block of the article**:

- .com and the .ge `en` version: `{h:'Sources',list:[…]}`; .ge `ru`: `{h:'Источники',list:[…]}`; .ge `ka`: `{h:'წყაროები',list:[…]}` (proofread by the owner's team).
- One item per source: "Name of the page or document: full address (checked 11 November 2026)" / «Название страницы или документа: полный адрес (проверено 11.11.2026)». The date is the day the page was actually opened. The part before the colon shows in bold, so keep it under 60 characters, with no dots and not ending in a digit (otherwise the item shows without bold; dots in the address after the colon are fine).
- The list shows as accent bullets; the heading does not start with "How/Step/Как", so it is not turned into numbered steps.
- `blog-check.ts` fails on identical list items longer than 40 characters in two articles. The same source line in two articles is a repeated thesis anyway: link to the owner article instead; if a second article really needs the same document, cite the section it relies on.
- List items have no forced line break: check the block at 390 px. If a long address scrolls sideways, give the shortest official address of the same page.
- When the code session adds links in text, sources move into the paragraphs as links and this block is dropped; this file will be updated then.

## How blocks turn into UI (write the data so the UI works)

| Write this | It shows as |
|---|---|
| A table with a price column (£ $ € ₾ in at least half of the rows), first header not empty: `[['Format','What you get','Timeline','Price'],…]` | price cards: name, large price, note, a chip for a "Timeline / Срок / ვადა" column. A tail after the first comma in the price ("…a month, optional") becomes a small note. |
| A two-column table whose first header is "When / Когда / როდის" | a vertical timeline |
| A list under a heading that starts with "How…", "Step…", "Как…", "С чего…", "План…", "როგორ…" or contains "start", "launch", "запуск" | numbered steps |
| Any other list | accent bullets; "Lead: rest" or "Lead. Rest" (lead under 60 characters) shows the lead in bold |
| Any other table with 3+ columns | a table on desktop, stacked cards on phones |

A price table only where the price is on topic (see "Structure of an article"); where it fits, one step list or timeline.

## Style

Owner's choice (9 Oct 2026): every text goes through `brand-voice` (the site's VOICE PROFILE and hard bans), `seo` (on-page) and, last, `humanizer` (26 patterns of AI writing). How these apply to Russian dashes, quotes and bold list labels: `docs/BLOG-EDITORIAL.md`. The project rules below stay on top of them:


1. "Not X but Y" / «не X, а Y» antitheses: at most 1 per article, aim for 0. Rewrite as a plain statement.
2. No sentence repeats word for word or in paraphrase between articles, and articles are not built on one template (example calculation → price cards → tokens → audit). Standard facts (illustrative figures, tokens paid to providers, free audit, pilot price) are worded differently in each article.
3. No table-of-contents intro ("Below we look at…") and no identical closing heading. The first screen is the definition plus the first useful fact.
4. Numbers only with a source or as a marked example ("The figures are illustrative…", «Цифры условные…»). No statistics, client names, ratings or testimonials. Laws and dates only when certain.
5. Short sentences, verbs and nouns. No aphorisms, drama or empty intensifiers. Vary paragraph length; lists have as many items as there really are.
6. People decide; AI drafts and prepares. Data stays in the client's accounts; enterprise APIs do not train on it.

## Before pushing

1. `npx tsx scripts/qa/blog-check.ts` — lengths, links, languages, antitheses, repeated sentences. Fix every FIX line.
2. `npx tsc --noEmit -p .` and `npx eslint components lib app`.
3. Build and look at the article at 1440 and 390 (`scripts/qa/serve.mjs`, `scripts/qa/shot.mjs`, see docs/HANDOFF.md): price cards, steps, tables on the phone, no horizontal scroll.
4. After the deploy: sitemap in Search Console and Bing, IndexNow (`scripts/seo/indexnow.mjs`), Yandex Webmaster for .ge.
