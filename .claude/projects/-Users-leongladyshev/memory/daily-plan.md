# Daily Plan — Frontier Agency
**Date**: Wednesday, June 18, 2026
**Created by**: 7:00 AM CEO

---

## P0 — CRITICAL (Must Complete Today)

1. **Commit uncommitted code changes** — Both repos have modified files (Hero, CTA, Capabilities, HowItWorks, WhyFrontier, services page, contact page). Stage specific paths and commit. Deploy main site.
2. **Follow up on Yelp lead (Webcraft Studio)** — They replied yesterday at 1:20 PM to the Software Development project. Human needs to log into Yelp business portal and respond. Flag as urgent.
3. **Check for email responses from 10 outreach emails** — All 10 leads were emailed yesterday. First responses may come in today. Any INTERESTED leads should be moved to MEETING_SCHEDULED immediately.

## P1 — HIGH (Core Business Growth)

4. **Build new pipeline — 10 new leads** — Yesterday's pipeline is fully contacted. Need fresh prospects. Focus on industries not yet covered: real estate, healthcare/dental, home services, retail. Use WebSearch + WebFetch.
5. **Create 3 outreach email drafts for new leads** — Custom drafts based on industry and likely pain points. Save to `memory/sales-drafts/`.
6. **Set up LinkedIn company page** — Content drafts exist (`content/linkedin-post-1.txt`, `content/linkedin-post-2.txt`). Create the page and schedule first post.
7. **Set up Instagram business account** — Content draft exists (`content/instagram-post-1.txt`). Create account and prepare first post.
8. **Research and shortlist domain names** — frontieragency.com is taken. Research alternatives: frontieragency.ai, frontieragency.io, frontier-agency.com, gstudios.ai, etc. Check availability and pricing.

## P2 — MEDIUM (Operations & Improvement)

9. **SEO: Add meta descriptions and OG tags to main site** — Currently missing. Add to `src/app/layout.tsx` and key pages. This is a quick win for discoverability.
10. **Fix contact page CTA** — Contact form links to `#` (not functional). Wire up the form or replace with a mailto/link to a working contact method.
11. **Add favicon** — Site has no favicon. Create or source one and add to the app layout.
12. **Draft blog post: "Why Miami Businesses Need AI Receptionists in 2026"** — Use market research data from business-intel.md. Save to `content/` directory.
13. **Create follow-up email templates** — For leads who don't respond in 48-72 hours. Prepare 3 templates: polite follow-up, value-add follow-up, break-up email.
14. **Update sales-pipeline.md metrics** — Refresh the metrics table with current data (all 10 CONTACTED, 0 responses).

## P3 — LOW (Nice to Have)

15. **Add custom 404 page** — Both sites use default Next.js 404. Create `not-found.tsx` for main site.
16. **Add error boundaries** — Create `error.tsx` for main site (D009).
17. **Admin: Add form validation feedback** — Admin forms have no validation UX (T002).
18. **Admin: Add loading states/skeleton UI** — Data fetches show nothing while loading (T003).
19. **Google Drive folder structure** — Create organized folder system: /Frontier Agency/Sales/, /Frontier Agency/Marketing/, /Frontier Agency/Dev/, /Frontier Agency/Reports/
20. **Review and update business-intel.md** — Add Day 2 notes, any new market findings, update conversion metrics if responses came in.

---

## Agent Assignments

| Agent | Primary Tasks |
|-------|--------------|
| **7am CEO** | This plan. Check email, calendar, sites, git. Set direction. |
| **8am Sales Agent** | Tasks 4, 5 — Research 10 new leads, create 3 outreach drafts |
| **9am Developer** | Tasks 1, 9, 10, 11 — Commit changes, deploy, SEO meta tags, fix CTA, favicon |
| **10am Marketing Agent** | Tasks 6, 7, 12 — LinkedIn setup, Instagram setup, blog post draft |
| **11am Customer Success** | Tasks 2, 3, 13 — Follow up on Yelp lead, check email responses, create follow-up templates |
| **12pm Analyst** | Tasks 8, 14, 20 — Domain research, pipeline metrics update, business intel update |
| **1pm CEO** | Synthesize day, write report, commit files |

## Key Context for All Agents

- **Positioning**: Custom AI automation. No subscriptions, no packages. No public pricing — all quotes are custom after consultation.
- **Target industries today**: Real estate, healthcare/dental, home services, retail (expand beyond yesterday's restaurants/law/salons/auto)
- **Working site URL**: https://frontier-agency-proxy.leongladyshev1107.workers.dev
- **Admin URL**: https://admin.frontieragency.gstudios.dev
- **Git rule**: Repo root is `/Users/leongladyshev`. Use `git add <specific paths>` NEVER `git add -A`.
- **No m-dashes** in any communications — use hyphens or commas.
- **Content drafts location**: `memory/content/` for social posts, `memory/sales-drafts/` for outreach emails.
