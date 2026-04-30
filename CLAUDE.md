# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fullstack SaaS monorepo with three apps and two shared packages, orchestrated by Turborepo.

## Commands

### Development (Docker — full stack)
```bash
./start.sh          # First-time setup: hosts, SSL certs, docker compose up
docker compose up --build -d   # Rebuild and start all services
docker compose down             # Stop all services
```

### Development (local — individual apps)
```bash
pnpm dev              # All apps in parallel (turbo)
pnpm dev:api          # API only (port 3001)
pnpm dev:web          # Web only (port 3000)
pnpm dev:admin        # Admin only (port 3002)
```

### Build & Checks
```bash
pnpm build            # Build all packages
pnpm typecheck        # Typecheck all packages
```

### Database (run from apps/api)
```bash
pnpm db:push          # Push schema to database (no migration files)
pnpm db:generate      # Regenerate Prisma client
pnpm db:migrate       # Create and apply migration
pnpm db:studio        # Open Prisma Studio GUI
pnpm db:seed          # Run seed script
pnpm db:seed-permissions  # Seed RBAC permissions
pnpm create-admin     # Create admin user interactively
```
In Docker: `docker compose exec api npx tsx src/scripts/create-admin.ts --email admin@example.com --password secret --name Admin --superuser`

## Architecture

### Monorepo Layout
```
apps/
  api/        → @repo/api    — Hono REST API (Node.js, port 3001)
  web/        → @repo/web    — Customer-facing Nuxt 3 app (port 3000)
  admin/      → @repo/admin  — Admin panel Nuxt 3 app (port 3002)
packages/
  shared/     → @repo/shared — Zod schemas and inferred TypeScript types
  ui/         → @repo/ui     — Shared Vue components (Radix Vue + Tailwind CSS)
```

### API Module Pattern (`apps/api/src/modules/<module>/`)
Each module follows a three-layer pattern:
- `*.routes.ts` — Hono route definitions with OpenAPI specs
- `*.service.ts` — Business logic
- `*.repository.ts` — Prisma database queries

Modules: `auth`, `users`, `admins`, `roles`, `permissions`, `profile`, `stats`

### API Route Structure
- `/api/admin/**` — Admin routes (protected by `adminAuthMiddleware` + `requirePermission`)
- `/api/client/**` — Client routes (protected by `userAuthMiddleware`)
- `/api/admin/docs` and `/api/client/docs` — Swagger UI
- `/health` — Health check

### Auth System
- Session-based with cookie authentication (not JWT)
- Separate cookie names: `user_session` (web) and `admin_session` (admin)
- 7-day session TTL, stored in PostgreSQL
- Bcrypt password hashing
- Admin RBAC: roles → permissions (many-to-many), superusers bypass permission checks
- SSR-aware: cookies are forwarded in server-side requests via `API_INTERNAL_URL`

### Shared Package (`@repo/shared`)
Exports Zod schemas and inferred types used by both API and frontend apps:
- Import schemas: `from '@repo/shared/schemas'`
- Import types: `from '@repo/shared/types'`

### UI Package (`@repo/ui`)
Nuxt layer that provides shared UI components, Tailwind config, and global CSS. Extended by web and admin apps via `extends: ['../../packages/ui']` in their nuxt.config.

### Frontend Conventions
- State management: Pinia stores in `stores/` directory
- Auth flow: `fetchMe()` called in auth middleware (SSR + client), redirects unauthenticated users
- i18n: English and Ukrainian, `no_prefix` strategy, lazy-loaded locale files
- Admin composables: `useAdminClient` wraps `$fetch` with credentials for API calls

### Database
- PostgreSQL 16 with Prisma ORM
- Schema at `apps/api/prisma/schema.prisma`
- Uses `db push` strategy (not migration files) for development
- Snake_case DB columns mapped to camelCase in Prisma models
- UUID primary keys throughout

## Environment

Copy `.env.example` to `.env`. Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `COOKIE_SECRET` — Session cookie signing key
- `CORS_ORIGINS` — Comma-separated allowed origins
- `NUXT_PUBLIC_API_BASE_URL` — Public API URL for frontend
- `API_INTERNAL_URL` — Internal API URL for SSR (e.g., `http://api:3001` in Docker)

## Tech Stack
- **Package manager:** pnpm 9.15 with workspaces
- **Build orchestration:** Turborepo
- **Backend:** Hono + Prisma + Zod + OpenAPI
- **Frontend:** Nuxt 3 + Vue 3 + Pinia + Tailwind CSS + Radix Vue
- **Database:** PostgreSQL 16
- **Containerization:** Docker Compose with Nginx reverse proxy (HTTPS)
