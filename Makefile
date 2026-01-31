.PHONY: build deploy status logs clean

# Load .env if exists
ifneq (,$(wildcard .env))
    include .env
    export
endif

NAMESPACE ?= player-sheet
REGISTRY ?=

# Image prefix
ifdef REGISTRY
    IMAGE_PREFIX := $(REGISTRY)
else
    IMAGE_PREFIX := player-sheet
endif

# === Build ===

build: build-api build-web

build-api:
	@echo ">>> Building API..."
ifdef REGISTRY
	docker build -t $(IMAGE_PREFIX)/api:latest -f apps/api/Dockerfile .
	docker push $(IMAGE_PREFIX)/api:latest
else
	docker build -t $(IMAGE_PREFIX)/api:latest -f apps/api/Dockerfile .
endif

build-web:
	@echo ">>> Building Web..."
ifdef REGISTRY
	docker build -t $(IMAGE_PREFIX)/web:latest -f apps/web/Dockerfile .
	docker push $(IMAGE_PREFIX)/web:latest
else
	docker build -t $(IMAGE_PREFIX)/web:latest -f apps/web/Dockerfile .
endif

# === Deploy ===

deploy:
	./scripts/deploy.sh all

deploy-mongodb:
	./scripts/deploy.sh mongodb

deploy-api:
	./scripts/deploy.sh api

deploy-web:
	./scripts/deploy.sh web

# === Operations ===

status:
	@kubectl get pods -n $(NAMESPACE)
	@echo ""
	@kubectl get svc -n $(NAMESPACE)

logs-api:
	kubectl logs -f -n $(NAMESPACE) -l app=api --tail=100

logs-web:
	kubectl logs -f -n $(NAMESPACE) -l app=web --tail=100

logs-mongodb:
	kubectl logs -f -n $(NAMESPACE) -l app=mongodb --tail=100

# === Cleanup ===

clean:
	helm uninstall mongodb -n $(NAMESPACE) || true
	helm uninstall api -n $(NAMESPACE) || true
	helm uninstall web -n $(NAMESPACE) || true

clean-all: clean
	kubectl delete namespace $(NAMESPACE) || true
