# Dashboard Build Area

Build all client dashboard features in this folder.

## Rules

- Use **lucide-react** icons only — no emojis
- Use the existing design system from `src/app/globals.css`
- Match existing site patterns: `px-6 md:px-12` padding, `max-w-[1200px]` max-width
- Nav links: `text-xs uppercase tracking-[0.04em]`
- Keep it minimal and professional

## Auth

- This area is protected by middleware — unauthenticated users redirect to `/login`
- Use `import { getSession } from "@/lib/auth"` in server components to get the current user
- The session is validated against SQLite on every request
- User data is available via `session.user` which has `{ id, email, name, created_at }`
- For client-side auth state, use `import { useAuth } from "@/lib/auth-context"`

## Notes

- The dashboard layout is in `layout.tsx` — it provides the sidebar shell with user info
- The main content area is in `page.tsx`
- When adding new dashboard pages, create folders with `page.tsx` files
- All dashboard pages are server components by default — use `"use client"` only when needed
