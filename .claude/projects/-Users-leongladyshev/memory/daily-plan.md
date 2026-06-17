# Daily Plan — Frontier Agency
**Date**: Tuesday, June 17, 2026
**Created by**: 7:00 AM CEO

## Status Summary
- Main site (frontieragency.com): ✅ UP (200 via www redirect)
- Admin dashboard (admin.frontieragency.com): 🔴 DOWN (000 — not resolving)
- Sales pipeline: EMPTY — no leads yet
- Calendar: No meetings today
- Email: No business leads/inquiries overnight

## Priority Tasks

### 🔴 P0 — URGENT (Must fix today)
1. **Fix admin.frontieragency.com** — Worker is not responding (HTTP 000). Investigate wrangler deployment, check Cloudflare dashboard, re-deploy admin project.
2. **Commit uncommitted changes** in both repos — admin pages deleted from main site, db.ts refactored, analytics changes.
3. **Restore admin pages in FrontierAgencyAdmin** — The admin project is the proper home for admin functionality.

### 🟠 P1 — HIGH (Should do today)
4. **Research 10 Miami businesses** (Sales) — Target: restaurants or real estate agents. Find phone, website, rating.
5. **Update dev-tasks.md** — Mark fixes completed since last session, add new findings.
6. **Set up Google Drive folder structure** — Create organized folders for sales, marketing, dev docs.
7. **Audit frontieragency.com landing page** (Marketing) — Check meta tags, headlines, CTAs, mobile.
8. **Research 3 competitors** (Marketing) — Miami AI agencies or web dev shops.

### 🟡 P2 — MEDIUM (Do if time permits)
9. **Follow up on Meetup email** — Miami Startup Pitch event tonight. Could be networking opportunity.
10. **Create blog content** — Draft "Why Miami Businesses Need AI Receptionists in 2026"
11. **Clean up FrontierAgency main site db.ts** — Remove unused queries, align with actual D1 schema.
12. **Monitor auto-dialer status** — Check if it's running, review schedule.
13. **Send test email via gog** — Verify mail sending works for CS outreach.

### 🟢 P3 — LOW (Nice to have)
14. **Add error boundaries** to both projects (D009).
15. **Add custom 404 pages** to both projects (D008).
16. **Review and update business pricing** in business-intel.md.
17. **Log today's findings** into business-intel.md.

## Success Criteria for Today
- [ ] Admin dashboard back online
- [ ] All code changes committed and deployed
- [ ] Sales pipeline has ≥10 new leads
- [ ] ≥3 competitors documented
- [ ] ≥1 piece of marketing content created
- [ ] End-of-day report filed

## Notes for Tomorrow
- If admin stays down, prioritize full re-deploy
- Once pipeline has leads, schedule first outbound calls via Vapi auto-dialer
- Consider setting up a Google Sheet for pipeline tracking
