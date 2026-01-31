# Player Sheet - Kubernetes Deployment Makefile
# Usage: make [target] [REGISTRY=<registry-url>] [NAMESPACE=<namespace>]

# Load .env file if exists (must be before ifeq checks)
-include .env
export

NAMESPACE ?= player-sheet
RELEASE_NAME ?= player-sheet
CHART_PATH := ./helm/player-sheet
VERSION := v$(shell date +%s)

# Registry: empty = minikube mode, set = push to registry
REGISTRY ?=

# Domain configuration
DOMAIN ?= player-sheet.local

# Colors
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

.PHONY: help dev build deploy upgrade status logs clean

help:
	@echo "$(GREEN)Player Sheet - Kubernetes Deployment$(NC)"
	@echo ""
	@echo "$(YELLOW)Development:$(NC)"
	@echo "  make dev              - Run local development (docker-compose)"
	@echo "  make build            - Build Docker images"
	@echo ""
	@echo "$(YELLOW)Deployment:$(NC)"
	@echo "  make deploy           - Full deployment (build + deploy all)"
	@echo "  make deploy-api       - Deploy API only"
	@echo "  make deploy-web       - Deploy Web only"
	@echo "  make deploy-mongodb   - Deploy MongoDB only"
	@echo "  make upgrade          - Rebuild and upgrade all services"
	@echo ""
	@echo "$(YELLOW)Operations:$(NC)"
	@echo "  make status           - Show deployment status"
	@echo "  make logs-api         - Tail API logs"
	@echo "  make logs-web         - Tail Web logs"
	@echo "  make logs-mongodb     - Tail MongoDB logs"
	@echo "  make port-forward     - Setup port forwarding"
	@echo "  make clean            - Remove deployment"
	@echo ""
	@echo "$(YELLOW)Variables:$(NC)"
	@echo "  REGISTRY=<url>        - Docker registry (empty = minikube)"
	@echo "  NAMESPACE=<ns>        - Kubernetes namespace (default: player-sheet)"
	@echo "  DOMAIN=<domain>       - Domain for Traefik (default: player-sheet.local)"

# ============================================================
# Development
# ============================================================

dev:
	@echo "$(GREEN)Starting local development...$(NC)"
	cd apps/api && pnpm dev &
	cd apps/web && pnpm dev

# ============================================================
# Build
# ============================================================

build: build-api build-web

build-api:
	@echo "$(GREEN)Building API image...$(NC)"
ifeq ($(REGISTRY),)
	@echo "Minikube mode - building locally"
	eval $$(minikube docker-env) && docker build -t player-sheet/api:$(VERSION) -t player-sheet/api:latest -f apps/api/Dockerfile .
else
	@echo "Registry mode - pushing to $(REGISTRY)"
	docker build -t $(REGISTRY)/api:$(VERSION) -t $(REGISTRY)/api:latest -f apps/api/Dockerfile .
	docker push $(REGISTRY)/api:$(VERSION)
	docker push $(REGISTRY)/api:latest
endif

build-web:
	@echo "$(GREEN)Building Web image...$(NC)"
ifeq ($(REGISTRY),)
	@echo "Minikube mode - building locally"
	eval $$(minikube docker-env) && docker build -t player-sheet/web:$(VERSION) -t player-sheet/web:latest -f apps/web/Dockerfile .
else
	@echo "Registry mode - pushing to $(REGISTRY)"
	docker build -t $(REGISTRY)/web:$(VERSION) -t $(REGISTRY)/web:latest -f apps/web/Dockerfile .
	docker push $(REGISTRY)/web:$(VERSION)
	docker push $(REGISTRY)/web:latest
endif

# ============================================================
# Deploy
# ============================================================

deploy: ensure-namespace build deploy-helm
	@echo "$(GREEN)Deployment complete!$(NC)"

deploy-helm:
	@echo "$(GREEN)Deploying Helm chart...$(NC)"
	./scripts/deploy.sh all

deploy-api:
	@echo "$(GREEN)Deploying API...$(NC)"
	./scripts/deploy.sh api

deploy-web:
	@echo "$(GREEN)Deploying Web...$(NC)"
	./scripts/deploy.sh web

deploy-mongodb:
	@echo "$(GREEN)Deploying MongoDB...$(NC)"
	./scripts/deploy.sh mongodb

ensure-namespace:
	@kubectl create namespace $(NAMESPACE) --dry-run=client -o yaml | kubectl apply -f -

# ============================================================
# Upgrade
# ============================================================

upgrade: build
	@echo "$(GREEN)Upgrading deployment...$(NC)"
	./scripts/upgrade.sh

upgrade-api: build-api
	@echo "$(GREEN)Upgrading API...$(NC)"
	./scripts/upgrade.sh api

upgrade-web: build-web
	@echo "$(GREEN)Upgrading Web...$(NC)"
	./scripts/upgrade.sh web

# ============================================================
# Operations
# ============================================================

status:
	@echo "$(GREEN)=== Pods ===$(NC)"
	@kubectl get pods -n $(NAMESPACE) -o wide
	@echo ""
	@echo "$(GREEN)=== Services ===$(NC)"
	@kubectl get svc -n $(NAMESPACE)
	@echo ""
	@echo "$(GREEN)=== IngressRoutes ===$(NC)"
	@kubectl get ingressroute -n $(NAMESPACE) 2>/dev/null || echo "No IngressRoutes found"
	@echo ""
	@echo "$(GREEN)=== PVCs ===$(NC)"
	@kubectl get pvc -n $(NAMESPACE)

logs-api:
	kubectl logs -f -n $(NAMESPACE) -l app.kubernetes.io/component=api --tail=100

logs-web:
	kubectl logs -f -n $(NAMESPACE) -l app.kubernetes.io/component=web --tail=100

logs-mongodb:
	kubectl logs -f -n $(NAMESPACE) -l app.kubernetes.io/component=mongodb --tail=100

port-forward:
	@echo "$(GREEN)Setting up port forwarding...$(NC)"
	@echo "API: http://localhost:4000"
	@echo "Web: http://localhost:3000"
	@echo "MongoDB: localhost:27017"
	@kubectl port-forward -n $(NAMESPACE) svc/$(RELEASE_NAME)-api 4000:4000 &
	@kubectl port-forward -n $(NAMESPACE) svc/$(RELEASE_NAME)-web 3000:3000 &
	@kubectl port-forward -n $(NAMESPACE) svc/$(RELEASE_NAME)-mongodb 27017:27017 &

restart-api:
	kubectl rollout restart deployment/$(RELEASE_NAME)-api -n $(NAMESPACE)

restart-web:
	kubectl rollout restart deployment/$(RELEASE_NAME)-web -n $(NAMESPACE)

# ============================================================
# Cleanup
# ============================================================

clean:
	@echo "$(YELLOW)Removing deployment...$(NC)"
	helm uninstall $(RELEASE_NAME) -n $(NAMESPACE) || true
	@echo "$(GREEN)Deployment removed$(NC)"

clean-all: clean
	@echo "$(YELLOW)Removing namespace...$(NC)"
	kubectl delete namespace $(NAMESPACE) || true
	@echo "$(GREEN)Namespace removed$(NC)"
