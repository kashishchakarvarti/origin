# Crest Backend (PostgreSQL)

Node.js + Express + **Prisma + PostgreSQL** API for CREST OS.

## Frontend integration (dual mode)

The Next.js app can run **without** this backend (local/localStorage) or **with** it (API).

### Local mode (default)

```bash
# from repo root — no backend needed
npm run dev
```

Or set in `.env.local`:

```
NEXT_PUBLIC_DATA_MODE=local
```

### API mode

1. Start this backend (`npm run db:up && npm run db:push && npm run db:seed && npm run dev`)
2. In the frontend `.env.local`:

```
NEXT_PUBLIC_DATA_MODE=api
NEXT_PUBLIC_API_URL=http://localhost:4000
```

3. Restart `npm run dev` and log in with `user@mail.com` / `user`

You can also switch in the app: **Profile → Settings → Data source** (stores an override in `localStorage` and reloads).

| Mode | Data | Order algo |
|------|------|------------|
| `local` | Browser localStorage | Client ticker every 10s |
| `api` | Postgres via this API | Server ticker every 10s |

## Quick start

```bash
cd backend
cp .env.example .env
npm install

# Start Postgres (Docker)
npm run db:up

# Create tables + generate client
npm run db:push
npm run db:generate

# Seed ~₹5L demo portfolio
npm run db:seed

# Run API
npm run dev
```

API: `http://localhost:4000`  
Demo login: `user@mail.com` / `user`

## Database

| Setting | Value |
|---------|-------|
| Engine | PostgreSQL 16 |
| Connection | `postgresql://crest:crest@localhost:5433/crest` |
| ORM | Prisma |
| Compose | `docker compose up -d` |

Useful commands:

```bash
npm run db:up        # start Postgres container
npm run db:down      # stop container
npm run db:push      # sync schema
npm run db:seed      # reset + seed
npm run studio       # Prisma Studio UI
```

## Order algo

Runs on the server every **10 seconds** (`ORDER_ALGO_INTERVAL_MS`), writing orders/revenue into Postgres.

- `POST /api/algo/tick`
- `POST /api/algo/run`

## Auth

```bash
curl -s http://localhost:4000/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"user@mail.com","password":"user"}'
```

Use `Authorization: Bearer <token>` on `/api/*`.

## Endpoints

Same surface as before: auth, dashboard, opportunities, festivals, businesses, products, orders, transactions, withdraw, notifications, profile, reviews, meta, algo, reset.
