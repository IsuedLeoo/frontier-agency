# Dev Tasks — Frontier Agency

## Projects
- **Main Site**: `/Users/leongladyshev/Desktop/FrontierAgency` → `frontier-agency-proxy` worker
- **Admin**: `/Users/leongladyshev/Desktop/FrontierAgencyAdmin` → `frontier-agency-admin` worker

## Deploy Rule
Always clean build before deploy:
```bash
rm -rf .next .open-next
npx opennextjs-cloudflare build
npx wrangler deploy
```

## Open Issues

| ID | Project | Issue | Priority | Status | Discovered |
|----|---------|-------|----------|--------|------------|
| D001 | Main Site | Dashboard page uses hardcoded placeholder data (TODO comments) | HIGH | OPEN | 2026-06-16 |
| D002 | Main Site | Admin pages (/admin, /admin/clients) use hardcoded fake data | HIGH | OPEN | 2026-06-16 |
| D003 | Main Site | Broken /dashboard/activity link (no page exists) — fixed to /webhooks | LOW | FIXED | 2026-06-16 |
| D004 | Main Site | middleware.ts.bak leftover file — deleted | LOW | FIXED | 2026-06-16 |
| D005 | Admin | .dev.vars with API keys was committed to git — removed, needs key rotation | CRITICAL | FIXED | 2026-06-16 |
| D006 | Admin | worker-entry.ts @ts-ignore removed then restored for .open-next import | LOW | FIXED | 2026-06-16 |
| D007 | Main Site | Admin area uses <a href> instead of Next.js <Link> — no client-side nav | MEDIUM | OPEN | 2026-06-16 |
| D008 | Both | No custom 404 page (not-found.tsx) | LOW | OPEN | 2026-06-16 |
| D009 | Both | No error boundaries (error.tsx) | MEDIUM | OPEN | 2026-06-16 |
| D010 | Admin | Voice system has hardcoded +19862010858 in system-prompt.ts | MEDIUM | OPEN | 2026-06-16 |
| D011 | Admin | Auto-dialer uses fake business data (MIAMI_BUSINESS_TARGETS) | HIGH | OPEN | 2026-06-16 |
| D012 | Main Site | Dashboard sidebar missing nav items (Services, Projects, Webhooks) — fixed | LOW | FIXED | 2026-06-16 |

## Technical Debt

| ID | Project | Description | Effort | Status |
|----|---------|-------------|--------|--------|
| T001 | Main Site | Admin area is redundant with FrontierAgencyAdmin — consolidate or connect to real DB | Large | OPEN |
| T002 | Admin | No form validation feedback on admin forms | Medium | OPEN |
| T003 | Admin | No loading states / skeleton UI during data fetches | Medium | OPEN |
| T004 | Both | No CSRF protection on admin forms | Medium | OPEN |

## Recent Fixes

| Date | Project | Fix | Deployed |
|------|---------|-----|----------|
| 2026-06-16 | Admin | Type safety: removed 'as any[]' casts across all pages | ✅ |
| 2026-06-16 | Admin | Dialer: use configured phone_number instead of hardcoded | ✅ |
| 2026-06-16 | Admin | Dialer: endHour 18→17 to match cron schedule | ✅ |
| 2026-06-16 | Admin | Removed console.error/log from voice API routes | ✅ |
| 2026-06-16 | Admin | Added type annotations to tool-locally.ts | ✅ |
| 2026-06-16 | Admin | transfer_call requires explicit phone_number | ✅ |
| 2026-06-16 | Admin | AI Assistant sidebar made toggleable | ✅ |
| 2026-06-16 | Admin | WORKER_BASE_URL guard in worker-scheduled.ts | ✅ |
| 2026-06-16 | Both | Deployed both projects to Cloudflare | ✅ |
