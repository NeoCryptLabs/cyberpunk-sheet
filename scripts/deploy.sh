#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load .env
if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a
    source "$PROJECT_ROOT/.env"
    set +a
fi

# Defaults
NAMESPACE="${NAMESPACE:-player-sheet}"
REGISTRY="${REGISTRY:-}"
DOMAIN="${DOMAIN:-}"
CERT_RESOLVER="${CERT_RESOLVER:-letsencrypt}"

# Secrets (generate if not set)
JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 32)}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET:-$(openssl rand -base64 32)}"
MONGODB_ROOT_PASSWORD="${MONGODB_ROOT_PASSWORD:-$(openssl rand -base64 16)}"

# Image prefix
if [ -z "$REGISTRY" ]; then
    IMAGE_PREFIX="player-sheet"
else
    IMAGE_PREFIX="$REGISTRY"
fi

# MongoDB URI
MONGODB_URI="mongodb://root:${MONGODB_ROOT_PASSWORD}@mongodb:27017/player-sheet?authSource=admin"

# API URL
if [ -n "$DOMAIN" ]; then
    API_URL="https://${DOMAIN}/graphql"
    CORS_ORIGIN="https://${DOMAIN}"
else
    API_URL="http://localhost:4000/graphql"
    CORS_ORIGIN="http://localhost:3000"
fi

echo "=== Player Sheet Deploy ==="
echo "Namespace: $NAMESPACE"
echo "Registry: ${REGISTRY:-local}"
echo "Domain: ${DOMAIN:-none}"
echo ""

deploy_mongodb() {
    echo ">>> Deploying MongoDB..."
    helm upgrade --install mongodb "$PROJECT_ROOT/charts/mongodb" \
        --namespace "$NAMESPACE" \
        --create-namespace \
        --set rootPassword="$MONGODB_ROOT_PASSWORD" \
        --wait --timeout 3m
}

deploy_api() {
    echo ">>> Deploying API..."
    helm upgrade --install api "$PROJECT_ROOT/charts/api" \
        --namespace "$NAMESPACE" \
        --set image="$IMAGE_PREFIX/api" \
        --set tag=latest \
        --set mongodbUri="$MONGODB_URI" \
        --set jwtSecret="$JWT_SECRET" \
        --set jwtRefreshSecret="$JWT_REFRESH_SECRET" \
        --set corsOrigin="$CORS_ORIGIN" \
        --wait --timeout 3m
}

deploy_web() {
    echo ">>> Deploying Web..."
    helm upgrade --install web "$PROJECT_ROOT/charts/web" \
        --namespace "$NAMESPACE" \
        --set image="$IMAGE_PREFIX/web" \
        --set tag=latest \
        --set apiUrl="$API_URL" \
        --set domain="$DOMAIN" \
        --set certResolver="$CERT_RESOLVER" \
        --wait --timeout 3m
}

case "${1:-all}" in
    mongodb) deploy_mongodb ;;
    api) deploy_api ;;
    web) deploy_web ;;
    all)
        deploy_mongodb
        deploy_api
        deploy_web
        ;;
    *)
        echo "Usage: $0 [all|mongodb|api|web]"
        exit 1
        ;;
esac

echo ""
echo "=== Done ==="
kubectl get pods -n "$NAMESPACE"
