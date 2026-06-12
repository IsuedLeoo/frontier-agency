# Deploying Frontier Agency to Cloudflare

**Live site:** https://frontieragency.gstudios.dev/

---

## Prerequisites

1. **Cloudflare account** with access to the `gstudios.dev` zone.
2. **Wrangler CLI** authenticated:
   ```bash
   npx wrangler login
   ```
3. **Node.js** (v20+) and **npm** installed.

---

## Project Structure (Cloudflare)

| Path | Purpose |
|---|---|
| `wrangler.jsonc` | Cloudflare Workers/Pages config |
| `.open-next/worker.js` | Compiled Cloudflare Worker entry point |
| `.open-next/assets/` | Static assets served via `ASSETS` binding |
| `d1_databases > frontier_agency_db` | Cloudflare D1 database binding |

---

## Environment Variables

The project uses one secret:

| Variable | Where | Description |
|---|---|---|
| `SESSION_SECRET` | Cloudflare secret | Random 64-char hex string for session encryption |

### Setting the secret

```bash
npx wrangler secret put SESSION_SECRET
# Paste your value when prompted
```

Verify it's set:

```bash
npx wrangler secret list
```

---

## Deploy from Local

Build and deploy in one step:

```bash
npm run deploy
```

This is a shorthand for:

```bash
opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

### Step-by-step

1. **Install dependencies** (first time or after `pull`):
   ```bash
   npm install
   ```

2. **Build the Cloudflare bundle:**
   ```bash
   opennextjs-cloudflare build
   ```
   Output goes to `.open-next/`.

3. **Deploy:**
   ```bash
   opennextjs-cloudflare deploy
   ```

4. **Verify:** visit https://frontieragency.gstudios.dev/

---

## Publishing only (no deploy)

To upload the bundle to Cloudflare without triggering a deployment (useful for CI or preview):

```bash
npm run upload
```

---

## Preview locally (Cloudflare dev environment)

```bash
npm run preview
```

This builds the bundle and runs it against a local Wrangler dev server that mimics the Cloudflare runtime — routes, bindings (D1, KV, R2), and all.

---

## D1 Database

The production database is:

| Property | Value |
|---|---|
| **Binding** | `frontier_agency_db` |
| **Database name** | `frontier-agency-db` |
| **Database ID** | `dbbe76c6-a0e4-4191-8f91-af9db5082f10` |

Run migrations against it:

```bash
npx wrangler d1 migrations apply frontier-agency-db --remote
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `not authenticated` errors | Run `npx wrangler login` |
| `SESSION_SECRET` missing at runtime | Run `npx wrangler secret put SESSION_SECRET` |
| Build fails / missing deps | Run `rm -rf node_modules && npm install` |
| Old assets served | Delete `.open-next/` and rebuild (`opennextjs-cloudflare build`) |
| D1 binding not found | Ensure `database_id` in `wrangler.jsonc` matches the remote DB |
