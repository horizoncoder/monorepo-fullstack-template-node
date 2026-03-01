#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate

echo "Running database schema push..."
npx prisma db push --accept-data-loss

echo "Seeding database..."
pnpm db:seed

echo "Starting API server..."
exec pnpm dev
