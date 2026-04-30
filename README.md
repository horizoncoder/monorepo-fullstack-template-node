# Monorepo Fullstack Template

Fullstack SaaS monorepo orchestrated by Turborepo. Includes a Hono REST API, two Nuxt 3 frontends (customer web + admin panel), and shared `ui` / `shared` packages.

## Stack

- **Package manager:** pnpm 9.15 (workspaces)
- **Build orchestration:** Turborepo
- **Backend:** Hono + Prisma + Zod + OpenAPI
- **Frontend:** Nuxt 3 + Vue 3 + Pinia + Tailwind CSS + Radix Vue
- **Database:** PostgreSQL 16
- **Containerization:** Docker Compose with Nginx reverse proxy (HTTPS)

## Project Layout

```
apps/
  api/        → @repo/api    — Hono REST API (port 3001)
  web/        → @repo/web    — Customer-facing Nuxt 3 app (port 3000)
  admin/      → @repo/admin  — Admin panel Nuxt 3 app (port 3002)
packages/
  shared/     → @repo/shared — Zod schemas and inferred TypeScript types
  ui/         → @repo/ui     — Shared Vue components (Radix Vue + Tailwind)
```

## Requirements

- Node.js >= 20
- pnpm 9.15
- Docker + Docker Compose (for the full-stack flow)
- PostgreSQL 16 (only if running locally without Docker)

## Quick Start

### 1. Clone & install

```bash
git clone git@github.com:horizoncoder/monorepo-fullstack-template-node.git
cd monorepo-fullstack-template-node
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:

- `DATABASE_URL` — PostgreSQL connection string
- `COOKIE_SECRET` — random string used to sign session cookies
- `CORS_ORIGINS` — comma-separated list of allowed origins
- `NUXT_PUBLIC_API_BASE_URL` — public API URL (e.g. `http://localhost:3001`)
- `API_INTERNAL_URL` — internal API URL for SSR (e.g. `http://api:3001` in Docker)
- Optional: email provider (`EMAIL_PROVIDER`, `EMAIL_FROM`, `MAILEROO_API_KEY`), Google OAuth (`GOOGLE_CLIENT_ID`), Telegram OAuth (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`)

### 3a. Run with Docker (recommended)

First-time setup adds local hostnames (`develop`, `api.develop`) to `/etc/hosts`, generates SSL certs, and starts all services behind Nginx:

```bash
./start.sh
```

Subsequent runs:

```bash
docker compose up --build -d   # rebuild and start
docker compose down            # stop
```

Access:

- Web: <https://develop>
- Admin: <https://develop/admin>
- API: <https://api.develop>

### 3b. Run locally (without Docker)

Make sure PostgreSQL is running and `DATABASE_URL` points to it, then:

```bash
pnpm dev          # all apps in parallel
# or run individually:
pnpm dev:api      # API on :3001
pnpm dev:web      # Web on :3000
pnpm dev:admin    # Admin on :3002
```

## Database

Run from `apps/api`:

```bash
pnpm db:push                # push schema (no migration files)
pnpm db:generate            # regenerate Prisma client
pnpm db:migrate             # create and apply a migration
pnpm db:studio              # open Prisma Studio GUI
pnpm db:seed                # seed initial data
pnpm db:seed-permissions    # seed RBAC permissions
pnpm create-admin           # create an admin user interactively
```

Inside Docker:

```bash
docker compose exec api npx tsx src/scripts/create-admin.ts \
  --email admin@example.com --password secret --name Admin --superuser
```

## Build & Checks

```bash
pnpm build       # build all packages
pnpm typecheck   # typecheck all packages
pnpm lint        # lint all packages
```

## API Docs

Swagger UI is available at:

- Admin API: `/api/admin/docs`
- Client API: `/api/client/docs`

Health check: `/health`
