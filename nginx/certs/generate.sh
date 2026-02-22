#!/bin/sh
set -e

CERT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Generating SSL certificate for develop + api.develop..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$CERT_DIR/server.key" \
  -out "$CERT_DIR/server.crt" \
  -subj "/C=US/ST=Local/L=Local/O=Dev/CN=develop" \
  -addext "subjectAltName=DNS:develop,DNS:api.develop,DNS:localhost,IP:127.0.0.1"

echo ""
echo "Certificate generated:"
echo "  Key:  $CERT_DIR/server.key"
echo "  Cert: $CERT_DIR/server.crt"
echo "  Domains: develop, api.develop"
