# Niah Foundation — working conventions

React (Vite) frontend in `niah/`, Go API in `niah-backend/`. Nigerian nonprofit:
mental health awareness, special needs inclusion, community outreach.

## Code

1. Clean, minimal code. No unnecessary fluff.
2. Output individual changed files, not zips, unless asked.
3. No markdown summaries after code.
4. Use the design tokens in `tailwind.config.js` and the component classes in
   `src/index.css` (`btn-primary`, `btn-secondary`, `btn-donate`, `card`,
   `card-container-low`, `section-eyebrow`, `section-title`, `section-body`,
   `glass-card`, `organic-shape`). Never hardcode hex in JSX. The inline flower
   SVGs in `Home.jsx` are the one existing exception.
5. Fonts: Playfair Display (`font-display`) for headings, Inter for body.
   Icons: Material Symbols Outlined.
6. The backend is not gofmt'd — columns are hand-aligned (see `volunteer.go`).
   Match the surrounding alignment; do not run `gofmt -w` across the repo.

## Backend

7. Auth header is always `Authorization: Bearer <token>`, never `X-Admin-Token`.
8. Handlers are closure constructors taking `*sql.DB` (`handlers.Foo(database)`),
   not package-level globals.
9. SQLite migrations live in `internal/db/db.go`: `CREATE TABLE IF NOT EXISTS`,
   plus `ALTER TABLE ... ADD COLUMN` via `db.Exec()` with errors ignored, so
   re-running against an existing DB is safe.
10. Every unauthenticated POST goes through `middleware.MaxBytes` and
    `middleware.RateLimit` in `cmd/server/main.go`. Add both when adding a new
    public POST, and cap each field's length in the handler.
11. The rate limiter is in-memory, so it is per-process. If the API is ever run
    behind a load balancer, move it to Redis or the limit becomes per-instance.
12. Go start command always includes `GOTOOLCHAIN=local`.

## Frontend

13. `react-leaflet@4` only — v5 requires React 19.
14. Paystack's script is loaded in `index.html`'s `<body>`, not injected
    dynamically. `usePaystack.js` reads `window.PaystackPop` directly.
15. File casing matters (this repo is also used from WSL): `usePaystack.js`,
    lowercase u, capital P.
16. After editing `.env`, restart Vite. It does not hot-reload env vars.

## Handoffs

17. The owner edits files between sessions. Never assume a file matches an
    earlier version — re-read the current one before changing it.

## Running locally

```bash
# Backend
cd niah-backend
ADMIN_TOKEN=... PAYSTACK_SECRET_KEY=sk_test_... GOTOOLCHAIN=local go run ./cmd/server

# Frontend
cd niah && npm run dev
```

See `niah-backend/.env.example` for the full environment. `ADMIN_TOKEN` and
`PAYSTACK_SECRET_KEY` are both required — the server exits without them.

## WSL gotchas already hit

Case-sensitive filenames; DNS sometimes fails
(`echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf`); delete files from the
WSL terminal, not Windows Explorer, or you get stale ghost files.
