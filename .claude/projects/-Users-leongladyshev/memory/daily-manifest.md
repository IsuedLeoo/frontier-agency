# Daily Business Automation — Manifest

## Status: ACTIVE
## Created: 2026-06-16
## Last Updated: 2026-06-17

## Active Jobs (Weekdays Only)

| Time | Role | Job ID | Status |
|------|------|--------|--------|
| 7:00 AM | CEO / Morning Planner | 8a47fc22 | ✅ Complete |
| 8:00 AM | Sales Agent | 74feb543 | ⏳ Pending |
| 9:00 AM | Developer | c7b2ce6d | ⏳ Pending |
| 10:00 AM | Marketing Agent | f2146484 | ⏳ Pending |
| 11:00 AM | Customer Success | 232b0968 | ⏳ Pending |
| 12:00 PM | Analyst | 615cf505 | ⏳ Pending |
| 1:00 PM | CEO / End-of-Day Report | f74be4ab | ⏳ Pending |

## Coordination Files (Sources of Truth)
- `daily-plan.md` — Today's task list (created by 7am CEO)
- `daily-log.md` — Activity log (appended by all agents)
- `daily-handoff.md` — Between-shift notes (written by each agent)
- `daily-capabilities.md` — Tool inventory (created by 7am CEO)
- `daily-report.md` — End-of-day report (created by 1pm CEO)
- `sales-pipeline.md` — Lead tracking (updated by 8am Sales, 11am CS)
- `dev-tasks.md` — Technical issues (updated by 9am Dev)
- `marketing-status.md` — Marketing state (updated by 10am Marketing)
- `business-intel.md` — Long-term research (updated by 12pm Analyst)

## Business Context
Frontier Agency is an AI automation agency in Miami. We sell:
1. AI Receptionist (Mia) — automated phone answering
2. AI Sales Agents (Alex) — outbound sales calls
3. Web Development — modern business websites
4. Digital Marketing — SEO, content, social media

Target market: Local Miami businesses (restaurants, dentists, salons, auto shops, real estate, law firms)

## Google Workspace Access
- Account: leongladyshev1107@gmail.com
- Tools: gog CLI (v0.11.0) — Gmail, Calendar, Drive, Docs, Sheets
- Safety: Always use `--no-input`. Use `GOG_GMAIL_NO_SEND=1` for dry runs.
