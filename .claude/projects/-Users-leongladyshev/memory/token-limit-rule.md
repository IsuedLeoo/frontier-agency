---
name: token-limit-rule
description: "Hard rule: never read or write more than 500 lines at a time to avoid API overload"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8a7b7fe5-7c54-4a9d-a209-4240917863c2
---

**HARD RULE — Always remember before every response:**

Never read or write more than 500 lines of a file at once. Doing so overloads the API and causes shutdowns.

- When reading: use `offset` and `limit` parameters to read in chunks of ≤500 lines
- When writing: if a file is large, read it in chunks first, then write in sections
- This applies to every single response — no exceptions

**Why:** The user explicitly requested this after a previous session where large reads/writes caused the API to shut down.
