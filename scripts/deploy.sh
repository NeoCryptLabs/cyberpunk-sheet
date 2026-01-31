#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CHART_PATH="$PROJECT_ROOT/helm/player-sheet"

# Load .env file if exists
if [ -f "$PROJECT_ROOT/.env" ]; then
    echo -e "${GREEN}Loading .env file...${NC}"
    export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

# Defaults
NAMESPACE="${NAMESPACE:-player-sheet}"
RELEASE_NAME="${RELEASE_NAME:-player-sheet}"
DOMAIN="${DOMAIN:-player-sheet.local}"
REGISTRY="${REGISTRY:-}"

# Generate secrets if not set
JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET:-$(openssl rand -hex 32)}"
MONGODB_ROOT_PASSWORD="${MONGODB_ROOT_PASSWORD:-$(openssl rand -hex 16)}"

# Version
VERSION="${VERSION:-latest}"

echo -e "${GREEN}Player Sheet - Kubernetes Deployment${NC}"
echo -e "Namespace: ${YELLOW}$NAMESPACE${NC}"
echo -e "Domain: ${YELLOW}$DOMAIN${NC}"
echo -e "Registry: ${YELLOW}${REGISTRY:-minikube (local)}${NC}"
echo ""

# Function to deploy with Helm
deploy_helm() {
    local component=$1
    echo -e "${GREEN}Deploying $component...${NC}"

    # Build image tag
    if [ -z "$REGISTRY" ]; then
        IMAGE_PREFIX="player-sheet"
    else
        IMAGE_PREFIX="$REGISTRY"
    fi

    # Generate values file from template
    export NAMESPACE DOMAIN JWT_SECRET JWT_REFRESH_SECRET MONGODB_ROOT_PASSWORD VERSION REGISTRY
    envsubst < "$CHART_PATH/values.env.yaml" > "$CHART_PATH/values-generated.yaml"

    # Helm upgrade/install
    helm upgrade --install "$RELEASE_NAME" "$CHART_PATH" \
        --namespace "$NAMESPACE" \
        --create-namespace \
        --values "$CHART_PATH/values-generated.yaml" \
        --set api.image="$IMAGE_PREFIX/api" \
        --set api.tag="$VERSION" \
        --set web.image="$IMAGE_PREFIX/web" \
        --set web.tag="$VERSION" \
        --set traefik.domain="$DOMAIN" \
        --set secrets.jwtSecret="$JWT_SECRET" \
        --set secrets.jwtRefreshSecret="$JWT_REFRESH_SECRET" \
        --set secrets.mongodbRootPassword="$MONGODB_ROOT_PASSWORD" \
        --atomic \
        --timeout 5m \
        --wait

    echo -e "${GREEN}$component deployed successfully!${NC}"
}

# Function to deploy only MongoDB
deploy_mongodb() {
    echo -e "${GREEN}Deploying MongoDB only...${NC}"

    helm upgrade --install "$RELEASE_NAME" "$CHART_PATH" \
        --namespace "$NAMESPACE" \
        --create-namespace \
        --set api.replicas=0 \
        --set web.replicas=0 \
        --set mongodb.enabled=true \
        --set secrets.mongodbRootPassword="$MONGODB_ROOT_PASSWORD" \
        --atomic \
        --timeout 5m \
        --wait

    echo -e "${GREEN}MongoDB deployed!${NC}"
}

# Function to deploy only API
deploy_api() {
    echo -e "${GREEN}Deploying API only...${NC}"

    if [ -z "$REGISTRY" ]; then
        IMAGE_PREFIX="player-sheet"
    else
        IMAGE_PREFIX="$REGISTRY"
    fi

    helm upgrade --install "$RELEASE_NAME" "$CHART_PATH" \
        --namespace "$NAMESPACE" \
        --reuse-values \
        --set api.image="$IMAGE_PREFIX/api" \
        --set api.tag="$VERSION" \
        --set api.replicas=1 \
        --atomic \
        --timeout 5m \
        --wait

    echo -e "${GREEN}API deployed!${NC}"
}

# Function to deploy only Web
deploy_web() {
    echo -e "${GREEN}Deploying Web only...${NC}"

    if [ -z "$REGISTRY" ]; then
        IMAGE_PREFIX="player-sheet"
    else
        IMAGE_PREFIX="$REGISTRY"
    fi

    helm upgrade --install "$RELEASE_NAME" "$CHART_PATH" \
        --namespace "$NAMESPACE" \
        --reuse-values \
        --set web.image="$IMAGE_PREFIX/web" \
        --set web.tag="$VERSION" \
        --set web.replicas=1 \
        --atomic \
        --timeout 5m \
        --wait

    echo -e "${GREEN}Web deployed!${NC}"
}

# Main
case "${1:-all}" in
    all)
        deploy_helm "all components"
        ;;
    api)
        deploy_api
        ;;
    web)
        deploy_web
        ;;
    mongodb)
        deploy_mongodb
        ;;
    *)
        echo -e "${RED}Unknown component: $1${NC}"
        echo "Usage: $0 [all|api|web|mongodb]"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Deployment Status:${NC}"
kubectl get pods -n "$NAMESPACE"
