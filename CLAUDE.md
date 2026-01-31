# Player Sheet - Cyberpunk Red Campaign App

## Project Overview
Application de gestion de campagne Cyberpunk Red pour un petit groupe de joueurs (2-5).

## Tech Stack

### Backend (`apps/api/`)
- **Framework**: NestJS
- **Database**: MongoDB (Mongoose ODM)
- **API**: GraphQL (Apollo Server / @nestjs/graphql)
- **Auth**: JWT + Refresh Token (Passport)

### Frontend (`apps/web/`)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **State**: Redux Toolkit + RTK Query (GraphQL)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Components**: Feature-based organization

### Shared (`packages/`)
- `packages/types/` - Types TypeScript partagés
- `packages/graphql/` - Schema GraphQL et types générés

### DevOps
- **Container orchestration**: Kubernetes (Docker Desktop)
- **Package manager K8s**: Helm 3
- **Local dev**: Skaffold (hot-reload dans K8s)
- **Env variables**: envstub (`.env.stub` templates)
- **Environments**: dev, prod

## Features (MVP)
1. **Fiche de personnage** - Stats, compétences, cyberware, inventaire Cyberpunk Red
2. **Journal de campagne** - Notes, quêtes, PNJ, lieux

## Architecture Decisions

### Langue
- **Code**: 100% anglais (variables, fonctions, classes, commentaires, commits)
- **UI**: 100% français (labels, messages, textes affichés)
- **i18n**: next-intl pour la gestion des traductions (fichiers dans `messages/fr.json`)

### Conventions de code
- **Nommage fichiers**: kebab-case (`character-sheet.resolver.ts`)
- **Nommage classes**: PascalCase (`CharacterSheetResolver`)
- **Nommage variables/fonctions**: camelCase
- **Exports**: Named exports (pas de default sauf pages Next.js)

### Best Practices
- **DRY**: Pas de duplication, factoriser le code réutilisable
- **SOLID**: Single responsibility, interfaces claires
- **Error handling**: Try/catch explicites, messages d'erreur utiles
- **Security**: Validation côté serveur, sanitization des inputs, CORS configuré
- **Performance**: Lazy loading, pagination, indexes MongoDB
- **Testing**: Tests unitaires pour la logique métier, tests d'intégration pour les resolvers

### React/Next.js Best Practices (Vercel)
**IMPORTANT**: Suivre les guidelines dans `.claude/skills/react-best-practices/`

Priorités par impact:
1. **CRITICAL** - Eliminating Waterfalls (`async-*`)
   - `Promise.all()` pour opérations indépendantes
   - Suspense boundaries pour streaming
2. **CRITICAL** - Bundle Size (`bundle-*`)
   - Imports directs (pas de barrel files)
   - `next/dynamic` pour composants lourds
3. **HIGH** - Server-Side Performance (`server-*`)
   - `React.cache()` pour dedup par request
   - Minimiser data passée au client
4. **MEDIUM** - Re-render Optimization (`rerender-*`)
   - Dériver state pendant render, pas dans effects
   - `useMemo`/`useCallback` quand nécessaire

Voir `.claude/skills/react-best-practices/AGENTS.md` pour la documentation complète.

### Backend patterns
- Un module NestJS par domaine (`character/`, `campaign/`, `auth/`)
- Resolvers pour GraphQL, Services pour la logique métier
- DTOs avec class-validator pour la validation
- Guards pour l'authentification

### Frontend patterns
- App Router Next.js (pas Pages Router)
- Un slice RTK par domaine
- Composants dans `components/` avec co-location des styles
- Types générés depuis le schema GraphQL avec graphql-codegen

### Base de données
- Collections MongoDB: `users`, `characters`, `campaigns`, `journal_entries`
- Pas de relations complexes, embedded documents quand pertinent

### Variables d'environnement (envstub)
Convention: chaque app a un `.env.stub` versionné (template) et un `.env` gitignored (valeurs réelles).

**apps/api/.env.stub**:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/player-sheet

# Auth
JWT_SECRET=<generate-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=4000
NODE_ENV=development
```

**apps/web/.env.stub**:
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

# Auth
NEXT_PUBLIC_AUTH_ENABLED=true
```

**Règles**:
- Ne jamais committer de `.env` (gitignore)
- `.env.stub` contient des placeholders `<description>` pour les secrets
- `pnpm env:setup` copie `.env.stub` → `.env` si `.env` n'existe pas

### Kubernetes / Helm / Skaffold

**Skaffold** (`skaffold.yaml`):
- Profiles: `dev` (default), `prod`
- Build: Docker avec cache
- Deploy: Helm
- Sync: Hot-reload des fichiers source vers les containers

**Helm** (`helm/player-sheet/`):
- Chart unique avec tous les services
- `values-dev.yaml`: replicas=1, debug=true, MongoDB local
- `values-prod.yaml`: replicas=2+, debug=false, MongoDB externe
- Secrets gérés via Kubernetes Secrets (pas dans values)

**Services K8s**:
| Service | Port interne | Port exposé |
|---------|--------------|-------------|
| api     | 4000         | ClusterIP   |
| web     | 3000         | ClusterIP   |
| mongodb | 27017        | ClusterIP   |
| ingress | -            | 80/443      |

**Ingress paths**:
- `/` → web (Next.js)
- `/graphql` → api (NestJS)

## Workflow avec Claude

### Mode de travail: AUTONOME
- Je propose et implémente les solutions
- Je fais des commits atomiques avec messages clairs
- Je demande validation uniquement pour les décisions architecturales majeures

### Ce que je fais automatiquement
- Création des fichiers et dossiers nécessaires
- Installation des dépendances
- Configuration des outils (ESLint, Prettier, etc.)
- Tests unitaires pour la logique critique

### Ce que je demande avant de faire
- Changements de stack ou d'architecture
- Ajout de fonctionnalités non prévues
- Suppressions majeures de code existant

## Commands

```bash
# Développement local (Node.js)
pnpm dev           # Lance api + web en parallèle
pnpm dev:api       # Lance uniquement l'API
pnpm dev:web       # Lance uniquement le frontend

# Développement K8s (Skaffold)
skaffold dev       # Build + deploy + hot-reload dans K8s local
skaffold run       # Build + deploy sans watch

# Build
pnpm build         # Build tous les packages
pnpm build:api     # Build l'API
pnpm build:web     # Build le frontend

# Tests
pnpm test          # Lance tous les tests
pnpm test:api      # Tests backend
pnpm test:web      # Tests frontend

# Génération de types
pnpm codegen       # Génère les types depuis le schema GraphQL

# Helm
helm upgrade --install player-sheet ./helm/player-sheet -f helm/values-dev.yaml    # Deploy dev
helm upgrade --install player-sheet ./helm/player-sheet -f helm/values-prod.yaml   # Deploy prod

# Env setup
pnpm env:setup     # Copie les .env.stub vers .env si non existants
```

## Project Structure

```
player-sheet/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/        # Module authentification
│   │   │   ├── character/   # Module fiches de personnage
│   │   │   ├── campaign/    # Module campagne/journal
│   │   │   ├── common/      # Guards, decorators, filters
│   │   │   └── main.ts
│   │   ├── Dockerfile
│   │   ├── .env.stub        # Template variables d'env
│   │   └── package.json
│   │
│   └── web/                 # Next.js Frontend
│       ├── app/             # App Router (routes)
│       ├── components/
│       │   ├── character/   # Composants fiche de perso
│       │   ├── campaign/    # Composants journal/campagne
│       │   ├── auth/        # Composants auth (login, etc.)
│       │   └── ui/          # Composants génériques (Button, Card, etc.)
│       ├── lib/             # Utilitaires, hooks, validation schemas
│       ├── messages/        # Traductions (fr.json)
│       ├── store/           # Redux store + slices RTK Query
│       ├── Dockerfile
│       ├── .env.stub        # Template variables d'env
│       └── package.json
│
├── packages/
│   ├── types/               # Types TypeScript partagés
│   └── graphql/             # Schema + types générés
│
├── helm/
│   └── player-sheet/        # Helm chart principal
│       ├── Chart.yaml
│       ├── values.yaml      # Valeurs par défaut
│       ├── values-dev.yaml  # Override dev
│       ├── values-prod.yaml # Override prod
│       └── templates/
│           ├── api-deployment.yaml
│           ├── api-service.yaml
│           ├── web-deployment.yaml
│           ├── web-service.yaml
│           ├── ingress.yaml
│           ├── mongodb.yaml  # StatefulSet MongoDB
│           ├── configmap.yaml
│           └── secrets.yaml
│
├── skaffold.yaml            # Config Skaffold
├── package.json             # Workspace root
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── CLAUDE.md
```

## Notes Cyberpunk Red

### Stats de personnage
- **STATS**: INT, REF, DEX, TECH, COOL, WILL, LUCK, MOVE, BODY, EMP
- **Compétences**: Liées aux stats, niveaux 0-10
- **Cyberware**: Affecte EMP (Humanité)
- **Rôles**: Solo, Netrunner, Tech, Medtech, Media, Exec, Lawman, Fixer, Nomad, Rockerboy

### Ressources utiles
- Cyberpunk Red Corebook pour les règles exactes
- Les formules de calcul (HP, Humanité, etc.) seront documentées dans le code
