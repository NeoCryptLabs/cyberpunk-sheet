#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CHART_PATH="$PROJECT_ROOT/helm/player-sheet"

# Load .env file if exists
if [ -f "$PROJECT_ROOT/.env" ]; then
    export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

# Defaults
NAMESPACE="${NAMESPACE:-player-sheet}"
RELEASE_NAME="${RELEASE_NAME:-player-sheet}"
REGISTRY="${REGISTRY:-}"

# Version with timestamp
VERSION="v$(date +%s)"

# Parse arguments
NO_BUILD=false
CLEAN=false
COMPONENT="${1:-all}"

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-build)
            NO_BUILD=true
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        api|web|all)
            COMPONENT=$1
            shift
            ;;
        *)
            shift
            ;;
    esac
done

echo -e "${GREEN}Player Sheet - Upgrade${NC}"
echo -e "Component: ${YELLOW}$COMPONENT${NC}"
echo -e "Version: ${YELLOW}$VERSION${NC}"
echo ""

# Build function
build_image() {
    local name=$1
    local dockerfile=$2

    echo -e "${GREEN}Building $name image...${NC}"

    if [ -z "$REGISTRY" ]; then
        # Minikube mode
        eval $(minikube docker-env)
        docker build -t "player-sheet/$name:$VERSION" -t "player-sheet/$name:latest" -f "$PROJECT_ROOT/$dockerfile" "$PROJECT_ROOT"
    else
        # Registry mode
        docker build -t "$REGISTRY/$name:$VERSION" -t "$REGISTRY/$name:latest" -f "$PROJECT_ROOT/$dockerfile" "$PROJECT_ROOT"
        docker push "$REGISTRY/$name:$VERSION"
        docker push "$REGISTRY/$name:latest"
    fi
}

# Clean if requested
if [ "$CLEAN" = true ]; then
    echo -e "${YELLOW}Cleaning build artifacts...${NC}"
    rm -rf "$PROJECT_ROOT/apps/api/dist"
    rm -rf "$PROJECT_ROOT/apps/web/.next"
fi

# Build images
if [ "$NO_BUILD" = false ]; then
    case $COMPONENT in
        api)
            build_image "api" "apps/api/Dockerfile"
            ;;
        web)
            build_image "web" "apps/web/Dockerfile"
            ;;
        all)
            build_image "api" "apps/api/Dockerfile"
            build_image "web" "apps/web/Dockerfile"
            ;;
    esac
fi

# Upgrade Helm release
echo -e "${GREEN}Upgrading Helm release...${NC}"

if [ -z "$REGISTRY" ]; then
    IMAGE_PREFIX="player-sheet"
else
    IMAGE_PREFIX="$REGISTRY"
fi

case $COMPONENT in
    api)
        helm upgrade "$RELEASE_NAME" "$CHART_PATH" \
            --namespace "$NAMESPACE" \
            --reuse-values \
            --set api.image="$IMAGE_PREFIX/api" \
            --set api.tag="$VERSION" \
            --atomic \
            --cleanup-on-fail \
            --timeout 5m \
            --wait

        # Force restart to pick up new image
        kubectl rollout restart deployment/"$RELEASE_NAME-api" -n "$NAMESPACE"
        ;;
    web)
        helm upgrade "$RELEASE_NAME" "$CHART_PATH" \
            --namespace "$NAMESPACE" \
            --reuse-values \
            --set web.image="$IMAGE_PREFIX/web" \
            --set web.tag="$VERSION" \
            --atomic \
            --cleanup-on-fail \
            --timeout 5m \
            --wait

        # Force restart to pick up new image
        kubectl rollout restart deployment/"$RELEASE_NAME-web" -n "$NAMESPACE"
        ;;
    all)
        helm upgrade "$RELEASE_NAME" "$CHART_PATH" \
            --namespace "$NAMESPACE" \
            --reuse-values \
            --set api.image="$IMAGE_PREFIX/api" \
            --set api.tag="$VERSION" \
            --set web.image="$IMAGE_PREFIX/web" \
            --set web.tag="$VERSION" \
            --atomic \
            --cleanup-on-fail \
            --timeout 5m \
            --wait

        # Force restart
        kubectl rollout restart deployment/"$RELEASE_NAME-api" -n "$NAMESPACE"
        kubectl rollout restart deployment/"$RELEASE_NAME-web" -n "$NAMESPACE"
        ;;
esac

echo ""
echo -e "${GREEN}Upgrade complete!${NC}"
echo ""
kubectl get pods -n "$NAMESPACE"
