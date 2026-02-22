#!/bin/sh
set -e

echo "Running database schema push..."
pnpm db:push

echo "Seeding database..."
pnpm db:seed

echo "Starting API server..."
exec pnpm dev
