#!/bin/sh
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "========================================="
echo "  SaaS Platform Setup"
echo "========================================="
echo ""
echo "  Web:    https://develop"
echo "  Admin:  https://develop/admin"
echo "  API:    https://api.develop"
echo ""

# 1. Kill processes on ports 3000-3003
echo "[1/5] Closing ports 3000-3003..."
for PORT in 3000 3001 3002 3003; do
  lsof -ti:$PORT 2>/dev/null | xargs kill -9 2>/dev/null || true
done
echo "  Done."

# 2. Add domains to /etc/hosts
echo "[2/5] Checking /etc/hosts..."
NEEDS_HOSTS=false
if ! grep -q "develop" /etc/hosts 2>/dev/null; then
  NEEDS_HOSTS=true
fi
if [ "$NEEDS_HOSTS" = true ]; then
  echo "  Adding 'develop' and 'api.develop' to /etc/hosts (requires sudo)..."
  echo "127.0.0.1 develop api.develop" | sudo tee -a /etc/hosts > /dev/null
  echo "  Added."
else
  echo "  Already present."
fi

# 3. Generate SSL certificate
echo "[3/5] Generating SSL certificate..."
cd "$PROJECT_DIR/nginx/certs"
chmod +x generate.sh
./generate.sh

# 4. Trust certificate in macOS Keychain
echo "[4/5] Trusting certificate (requires sudo)..."
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "$PROJECT_DIR/nginx/certs/server.crt" 2>/dev/null || true
echo "  Done."

# 5. Start Docker
echo "[5/5] Starting Docker containers..."
cd "$PROJECT_DIR"
docker compose down --remove-orphans 2>/dev/null || true
docker compose up --build -d

echo ""
echo "  Waiting for services..."
for i in $(seq 1 30); do
  if curl -sk https://api.develop/health > /dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo ""
echo "========================================="
echo "  SaaS Platform is running!"
echo "========================================="
echo ""
echo "  Web App:        https://develop"
echo "  Admin Panel:    https://develop/admin"
echo "  API:            https://api.develop"
echo "  Admin Swagger:  https://api.develop/api/admin/docs"
echo "  Client Swagger: https://api.develop/api/client/docs"
echo ""
echo "  Create admin:"
echo "    docker compose exec api npx tsx src/scripts/create-admin.ts --email admin@example.com --password secret --name Admin --superuser"
echo ""
echo "  Stop:  docker compose down"
echo "  Logs:  docker compose logs -f"
echo ""
