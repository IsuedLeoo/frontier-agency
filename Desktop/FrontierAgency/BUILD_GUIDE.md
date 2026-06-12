# 🏗️ The Complete Frontier Agency Build Guide

## Table of Contents

1. [What You Have Right Now](#1-what-you-have-right-now)
2. [The Big Picture — How This All Works](#2-the-big-picture--how-this-all-works)
3. [Phase 1: Fix the Foundation](#3-phase-1-fix-the-foundation)
4. [Phase 2: Build the Client Dashboard](#4-phase-2-build-the-client-dashboard)
5. [Phase 3: Build the Service Delivery System](#5-phase-3-build-the-service-delivery-system)
6. [Phase 4: Integrations & Webhooks](#6-phase-4-integrations--webhooks)
7. [Phase 5: Deploy & Scale](#7-phase-5-deploy--scale)
8. [Answering Every Question You Asked](#8-answering-every-question-you-asked)

---

## 1. What You Have Right Now

### Tech Stack
- **Framework:** Next.js 16.2.7 (App Router) — the latest
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **UI Icons:** Lucide React
- **Database:** SQLite via better-sqlite3 (local file at `data/frontier.db`)
- **Auth:** Custom session-based auth (scrypt password hashing, HTTP-only cookies)
- **Deployment Target:** Cloudflare Workers via OpenNext
- **Fonts:** Space Grotesk (headings) + Inter (body)

### What's Built
**Public marketing site:**
- Full landing page with 10+ sections
- Animated AI agent dashboard (canvas particles, live task pipeline, terminal feed)
- Services index page with search/filter
- 30+ individual service detail pages with rich documentation
- Responsive design, mobile menu, smooth scroll, scroll-reveal animations

**Auth system:**
- Registration + login + logout
- Session management with 30-day cookies
- Middleware protecting `/dashboard/*` routes
- Client-side auth context provider

**Dashboard shell:**
- Sidebar layout with nav (Dashboard, Settings)
- User info + logout button
- Placeholder "No services yet" page

### What's NOT Built Yet
- Client project management inside the dashboard
- Service delivery/tracking system
- Integration/webhook system
- Payment processing
- Settings page
- Any actual AI agent functionality
- Admin panel for you to manage clients

---

## 2. The Big Picture — How This All Works

Here's the architecture of the full system:

```
┌─────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE                       │
│                  (Your Next.js App)                       │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Public Site  │  │   Client     │  │    Admin      │  │
│  │  (Marketing)  │  │  Dashboard   │  │   Panel       │  │
│  │              │  │              │  │               │  │
│  │  /           │  │  /dashboard  │  │  /admin       │  │
│  │  /services   │  │  /dashboard/ │  │  /admin/      │  │
│  │  /login      │  │    projects  │  │    clients    │  │
│  │  /register   │  │  /dashboard/ │  │  /admin/      │  │
│  │              │  │    settings  │  │    projects   │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │              API Routes                           │    │
│  │  /api/auth/*    — login, register, logout         │    │
│  │  /api/projects/* — client project CRUD            │    │
│  │  /api/webhooks/* — incoming webhooks from clients │    │
│  │  /api/admin/*   — admin operations                │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │              Database (SQLite → D1 later)         │    │
│  │  users, sessions, projects, services, integrations│    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│  Client's CRM   │  │  Client's       │
│  (via webhooks) │  │  Calendar       │
│                  │  │  (via API)      │
└─────────────────┘  └─────────────────┘
```

**The flow:**
1. A prospect lands on your marketing site → books a call
2. You scope their project → create their account in your admin panel
3. They log in → see their dashboard with their project(s)
4. You build their AI service → it runs on YOUR infrastructure
5. Their service connects to THEIR tools via webhooks/API keys
6. They monitor everything from their dashboard

---

## 3. Phase 1: Fix the Foundation

### Problem: SQLite doesn't work on Cloudflare Workers

Your current database is SQLite (a local file). Cloudflare Workers is a serverless environment — it can't read/write local files. This is the **first thing to fix**.

**The solution: Cloudflare D1**

D1 is Cloudflare's serverless SQLite database. It's SQLite-compatible, so your queries will mostly work as-is. Here's the migration plan:

1. **Create a D1 database** in your Cloudflare dashboard
2. **Replace `better-sqlite3`** with D1's API (it uses a different connection method)
3. **Move your schema** to D1 migration files
4. **Update all database calls** to use D1 bindings

Your `wrangler.jsonc` already has the foundation — you'll add a `d1_databases` binding.

### Problem: Auth needs to work serverless

Your current auth uses `better-sqlite3` directly. On Cloudflare, you'll use the D1 binding instead. The auth *logic* (password hashing, session cookies) stays the same — only the database calls change.

### Problem: Environment variables

Your `.env.local` has a placeholder session secret. You need to:
1. Generate a real secret: `openssl rand -hex 32`
2. Add it to `.dev.vars` for local development
3. Add it as a Cloudflare secret for production: `wrangler secret put SESSION_SECRET`

### Action Items for Phase 1
- [ ] Create Cloudflare D1 database
- [ ] Add D1 binding to `wrangler.jsonc`
- [ ] Create D1 migration files for your schema
- [ ] Rewrite `src/lib/db.ts` to use D1 instead of better-sqlite3
- [ ] Update `src/lib/auth.ts` to work with D1
- [ ] Generate and set SESSION_SECRET
- [ ] Test locally with `wrangler dev`
- [ ] Deploy to Cloudflare and verify

---

## 4. Phase 2: Build the Client Dashboard

This is where clients see and manage their projects after they sign up.

### Database Tables You Need

Add these to your D1 schema:

```sql
-- Client projects (what you're building for them)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'discovery',
  -- discovery, design, build, deploy, operating
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Services within a project
CREATE TABLE IF NOT EXISTS project_services (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  -- pending, active, paused, completed
  config TEXT DEFAULT '{}',
  -- JSON: API keys, webhook URLs, settings
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Activity log (what's happening with each project)
CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Client integrations (their connected tools)
CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT,
  provider TEXT NOT NULL,
  -- 'shopify', 'hubspot', 'google_calendar', 'slack', etc.
  access_token TEXT,
  refresh_token TEXT,
  webhook_url TEXT,
  config TEXT DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Dashboard Pages to Build

**`/dashboard/page.tsx` (Home)**
- Welcome message with client's name
- List of their active projects
- Quick stats: projects in progress, completed, total
- Recent activity feed
- CTA to start a new project (which contacts you)

**`/dashboard/projects/page.tsx`**
- Grid/list of all their projects
- Each card shows: name, status badge, description, last updated
- Click into a project for details

**`/dashboard/projects/[id]/page.tsx`**
- Project detail view
- Status timeline (Discovery → Design → Build → Deploy → Operating)
- List of services in this project
- Activity log for this project
- Integration status (which of their tools are connected)

**`/dashboard/projects/[id]/services/[serviceId]/page.tsx`**
- Individual service detail
- What it does, how it's configured
- Status (active/paused)
- Performance metrics (tasks completed, uptime, etc.)
- Configuration panel (if applicable)

**`/dashboard/settings/page.tsx`**
- Profile settings (name, email, password change)
- Notification preferences
- Integration management (connect/disconnect tools)
- API keys (if you give them API access)

**`/dashboard/settings/integrations/page.tsx`**
- List of available integrations
- "Connect" buttons for each provider
- OAuth flows for common tools
- Webhook URL generator (you give them a URL to paste into their system)

### Dashboard Components to Build

- `ProjectCard` — summary card for a project
- `StatusBadge` — colored badge (discovery=gray, design=blue, build=yellow, deploy=purple, operating=green)
- `ActivityFeed` — scrollable list of recent events
- `ServiceCard` — shows a service within a project
- `IntegrationCard` — shows a connected tool with status
- `WebhookSetup` — UI for generating webhook URLs and showing setup instructions

---

## 5. Phase 3: Build the Service Delivery System

This is the **internal system** — how YOU manage what you're building for clients.

### Admin Panel

**`/admin/page.tsx`**
- Overview: total clients, active projects, revenue pipeline
- Quick actions: create project, add client

**`/admin/clients/page.tsx`**
- List of all clients (users)
- Search/filter
- Click into a client to see their details

**`/admin/clients/[id]/page.tsx`**
- Client profile
- Their projects
- Contact info
- Notes (internal)
- Billing status

**`/admin/projects/page.tsx`**
- All projects across all clients
- Filter by status, client, date
- Kanban board view (optional but nice)

**`/admin/projects/[id]/page.tsx`**
- Full project management
- Change status
- Add/remove services
- Log activity
- View client's integrations

### How You Create a Project (The Workflow)

1. Client books a call (via your site's "Schedule a Call" button)
2. You talk to them, scope the work
3. You go to `/admin/clients` → create their account (or they register themselves)
4. You go to `/admin/projects` → create a project for them
5. You add services to the project (from your 30+ service catalog)
6. You configure each service (API keys, webhook URLs, settings)
7. Client logs in → sees their dashboard → sees their project
8. You build the AI service → deploy it → mark it active
9. Client monitors from their dashboard

---

## 6. Phase 4: Integrations & Webhooks

This answers your question about how clients connect their systems to yours.

### The Two Types of Integrations

**Type 1: You pull FROM them (API-based)**
- You need their API key or OAuth token
- Your system periodically calls their API to get data
- Example: Reading their CRM contacts, checking calendar availability
- They go to your dashboard → "Connect HubSpot" → OAuth flow → you get a token

**Type 2: They push TO you (Webhook-based)**
- You give them a URL
- Their system sends data to that URL when something happens
- Example: A new lead fills out their form → their system POSTs to your URL → your AI handles it
- They go to your dashboard → copy the webhook URL → paste it into their system's webhook settings

### How to Make Webhooks Easy for Clients

Most clients won't know how to set up webhooks. Here's how you handle it:

**For common platforms (Shopify, HubSpot, Stripe, etc.):**
Build OAuth integrations. They click "Connect Shopify" → they log into Shopify → they approve → done. No webhook setup needed on their end.

**For custom systems:**
Your dashboard generates a unique webhook URL for each service. You provide:
1. The URL to copy
2. Step-by-step instructions with screenshots for common platforms
3. A "Test Webhook" button that sends a test payload so they can verify it works
4. A log showing recent webhook deliveries (so they can see it's working)

**Webhook endpoint structure:**
```
POST /api/webhooks/:projectId/:serviceId
```

Your server receives the payload, validates it (check a signature or token), and processes it.

### Integration Database

The `integrations` table (defined above) stores:
- Which provider (shopify, hubspot, etc.)
- Their access tokens (encrypted)
- The webhook URL you gave them
- Status (active/disconnected)
- Configuration specific to that integration

---

## 7. Phase 5: Deploy & Scale

### Your Deployment Pipeline

```
You write code → git push → GitHub → Cloudflare deploys automatically
```

**Setup:**
1. Push code to GitHub
2. Connect GitHub to Cloudflare Pages (or use Wrangler CLI)
3. Every push to `main` triggers a build and deploy
4. Cloudflare runs `opennextjs-cloudflare build` then deploys to Workers

**Your `package.json` scripts already handle this:**
- `npm run build` — builds the Next.js app
- `npm run deploy` — builds with OpenNext and deploys to Cloudflare

### Custom Domain

1. Buy `frontier-agency.com` (or whatever domain)
2. Add it to Cloudflare
3. Update DNS to point to your Cloudflare Worker
4. Done — Cloudflare handles SSL automatically

### Scaling

**You don't need to think about scaling.** Cloudflare Workers runs on Cloudflare's global network. Whether you have 1 client or 1,000, the infrastructure handles it. You're not managing servers.

**What scales automatically:**
- Your website (static + serverless functions)
- Your API routes
- Your database (D1 handles up to 5M rows on free tier, more on paid)

**What you manage:**
- Your code
- Your database schema (migrations)
- Your client relationships

---

## 8. Answering Every Question You Asked

### "Would the server running it be separate?"

**Yes.** Each client's service runs as part of your Cloudflare Worker. It's not a separate physical server — it's a serverless function. Think of it like an apartment building: one building (Cloudflare's infrastructure), many apartments (your clients' services). They're isolated but share the same infrastructure.

### "Would we run the server?"

**No.** Cloudflare runs the servers. You just deploy your code. Cloudflare handles uptime, scaling, security, SSL, CDN, everything. You never SSH into a server, never patch an OS, never worry about hardware.

### "If we make another client another thing, same server or different?"

**Same server (Worker), different data.** Your code is deployed once. Each client's data is separate in the database (filtered by `user_id` and `project_id`). When Client A's webhook comes in, your code processes it with Client A's configuration. When Client B's comes in, it uses Client B's config. Same code, different data.

### "Wouldn't we have to stop the server? Wouldn't it cut off the first client?"

**No.** Serverless deployments are atomic. When you push an update, Cloudflare spins up new instances with your new code, then switches traffic over. Old instances finish processing in-flight requests, then shut down. No client ever sees downtime. This is a fundamental property of Cloudflare Workers — you don't manage it.

### "If we use another server, won't servers catch up to my computer?"

**No, because you're not running servers on your computer.** Your laptop is just where you write code. Once you deploy, everything runs on Cloudflare's global network (300+ data centers worldwide). Your laptop could be off and everything keeps running.

### "If the client wants it integrated with their system, do we need access?"

**Sometimes yes, sometimes no:**

- **API-based:** They give you an API key. You don't need access to their system — just the key. You call their API from your code.
- **Webhook-based:** You give them a URL. They configure their system to send data to you. They don't need to give you access — they just paste a URL.
- **OAuth-based:** They click "Connect [Tool]" in your dashboard, log into their tool, and approve access. You get a token. No passwords shared.
- **Direct access (rare):** For some integrations, you might need temporary access to their system to set up the integration. Use a VPN or secure tunnel, and only with their explicit permission.

### "Would we build webhooks?"

**Yes, both sides:**

1. **Your webhook endpoints (receiving):** You build API routes like `POST /api/webhooks/:projectId`. When the client's system sends data to this URL, your code processes it.

2. **Your webhook calls (sending):** Your AI services can also send webhooks TO the client's systems. For example, when your AI qualifies a lead, it sends a webhook to their CRM.

### "Would the client know how to set up webhooks on their side?"

**Often no — and that's your job to solve.** Here's how:

1. **For common platforms:** Build OAuth integrations. They click a button, log in, done. No webhook knowledge needed.

2. **For everything else:** Your dashboard provides:
   - The webhook URL to copy
   - Step-by-step instructions with screenshots
   - A "Test" button that sends a sample payload
   - A delivery log showing successful/failed deliveries
   - You offer to do it for them (billable service)

3. **The ultimate solution:** Build a setup wizard. They select their platform from a dropdown, and you show them exactly what to do with screenshots and videos. This is a huge competitive advantage.

---

## The Revenue Model

Based on your pricing page:

| Tier | Price | What It's For |
|------|-------|---------------|
| Starter | $1,500–$5,000 | Single automation (e.g., email triage) |
| Growth | $5,000–$25,000 | Multi-agent system (e.g., CRM + support + reporting) |
| Enterprise | $25,000–$100,000+ | Full AI operations team |

**Recurring revenue opportunity:** Charge a monthly maintenance/management fee on top of the build cost. For example:
- Starter: $500/month for monitoring + updates
- Growth: $1,500/month
- Enterprise: $5,000+/month

This is where the real money is. A $25K build + $1,500/month recurring = $43K/year from one client.

---

## Immediate Next Steps (Do These Now)

1. **Set up Cloudflare D1** — this is blocking everything else
2. **Migrate your database** from SQLite file to D1
3. **Build the admin panel** — you need this to manage clients
4. **Build the client dashboard** — projects, services, activity
5. **Set up a custom domain** — `frontier-agency.com`
6. **Build your first integration** — pick one (e.g., webhook receiver) and make it work end-to-end
7. **Get your first paying client** — even at a discount, to validate the model

---

## File Structure (What You're Building Toward)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          ✅ DONE
│   │   └── register/page.tsx       ✅ DONE
│   ├── api/
│   │   ├── auth/                   ✅ DONE
│   │   ├── webhooks/
│   │   │   └── [projectId]/
│   │   │       └── route.ts        ← NEW: receive webhooks
│   │   ├── projects/
│   │   │   ├── route.ts            ← NEW: CRUD projects
│   │   │   └── [id]/
│   │   │       ├── route.ts        ← NEW: single project ops
│   │   │       └── services/
│   │   │           └── route.ts    ← NEW: project services
│   │   └── admin/
│   │       ├── clients/
│   │       │   └── route.ts        ← NEW: admin client management
│   │       └── projects/
│   │           └── route.ts        ← NEW: admin project management
│   ├── dashboard/
│   │   ├── layout.tsx              ✅ DONE
│   │   ├── page.tsx                ✅ DONE (needs real data)
│   │   ├── projects/
│   │   │   ├── page.tsx            ← NEW: project list
│   │   │   └── [id]/
│   │   │       ├── page.tsx        ← NEW: project detail
│   │   │       └── services/
│   │   │           └── [serviceId]/
│   │   │               └── page.tsx ← NEW: service detail
│   │   └── settings/
│   │       ├── page.tsx            ← NEW: settings
│   │       └── integrations/
│   │           └── page.tsx        ← NEW: integration management
│   ├── admin/
│   │   ├── layout.tsx              ← NEW: admin layout (checks admin role)
│   │   ├── page.tsx                ← NEW: admin dashboard
│   │   ├── clients/
│   │   │   ├── page.tsx            ← NEW: client list
│   │   │   └── [id]/page.tsx       ← NEW: client detail
│   │   └── projects/
│   │       ├── page.tsx            ← NEW: all projects
│   │       └── [id]/page.tsx       ← NEW: project management
│   ├── services/                   ✅ DONE
│   ├── page.tsx                    ✅ DONE
│   └── layout.tsx                  ✅ DONE
├── components/                     ✅ DONE (marketing components)
├── lib/
│   ├── db.ts                       ⚠️ NEEDS MIGRATION to D1
│   ├── auth.ts                     ⚠️ NEEDS UPDATE for D1
│   ├── types.ts                    ✅ DONE
│   ├── auth-context.tsx            ✅ DONE
│   ├── admin.ts                    ← NEW: admin auth checks
│   └── webhooks.ts                 ← NEW: webhook validation
└── data/
    └── frontier.db                 ⚠️ MIGRATE to D1
```

---

## Summary

You have an incredible foundation. The marketing site is beautiful, the auth system works, and the design is professional. What you need now is:

1. **Database migration** (SQLite → Cloudflare D1) — 1-2 days
2. **Admin panel** (so you can manage clients) — 2-3 days
3. **Client dashboard** (so clients can see their projects) — 3-5 days
4. **Webhook system** (so services can receive data) — 2-3 days
5. **First integration** (pick one, make it real) — 2-3 days
6. **Deploy to production** (custom domain, SSL, live) — 1 day

**Total: ~2 weeks to a fully functional platform.**

Then you get your first client, deliver a real AI service, and start the million-dollar journey. 🚀
