---
name: deploy-rule
description: Always deploy changes after editing code for Frontier Agency projects
metadata: 
  node_type: memory
  type: project
  originSessionId: 04179a17-d53d-41cc-81a2-98152cbd7406
---

## ALWAYS Deploy After Code Changes

For both FrontierAgency and FrontierAgencyAdmin projects, always run a clean build and deploy after making code changes:

```bash
# Clean build (nuke cache to avoid stale content)
rm -rf .next .open-next
npx opennextjs-cloudflare build
npx wrangler deploy
```

**Why:** Next.js ISR cache and OpenNext incremental builds can serve stale content even after code changes. The old phone number stayed live for multiple deploys because the cache wasn't cleared. Always do a clean build.

**Projects:**
- Main site: `/Users/leongladyshev/Desktop/FrontierAgency` → `frontier-agency-proxy` worker
- Admin: `/Users/leongladyshev/Desktop/FrontierAgencyAdmin` → `frontier-agency-admin` worker
