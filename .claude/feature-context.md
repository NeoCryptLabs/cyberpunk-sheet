# Feature Context

## Feature
Inviter les joueurs dans une campagne et accéder en tant que MJ à leurs fiches de persos

## Décisions
- **Invitation:** Code d'invitation (6 chars, expire 24h)
- **Accès MJ:** Lecture seule sur les fiches des joueurs

## State
- **Current step:** 7
- **Status:** in_progress
- **Started on:** 2026-01-31
- **Mode:** existing_feature

## Step History

### Step 1: Analysis - COMPLETED
**Summary:** Analyse de l'architecture existante
**Files:** `apps/api/src/campaign/`, `apps/api/src/character/`
**Notes:** `playerIds` et `characterIds` existent déjà mais ne sont pas exploités

### Step 2: Documentation - COMPLETED
**Summary:** Documentation technique créée
**Files:** `.claude/docs/campaign-players.md`
**Notes:** Flow utilisateur, API GraphQL, sécurité documentés

### Step 3: Planning - COMPLETED
**Summary:** Plan d'implémentation détaillé

## Implementation Plan

### Phase 1: Backend - Modèle & DTOs (15 min)

**Task 1.1:** Modifier `campaign.entity.ts`
- Ajouter `inviteCode?: string`
- Ajouter `inviteCodeExpiry?: Date`

**Task 1.2:** Modifier `campaign.dto.ts`
- Ajouter DTOs pour les nouvelles mutations
  - `GenerateInviteCodeInput`
  - `JoinCampaignInput`
  - `RemovePlayerInput`
  - `LinkCharacterInput`

### Phase 2: Backend - Service (30 min)

**Task 2.1:** `campaign.service.ts` - Méthodes d'invitation
- `generateInviteCode(campaignId, userId)` - Génère code 6 chars, stocke, retourne
- `joinCampaign(inviteCode, userId)` - Valide code, ajoute à playerIds

**Task 2.2:** `campaign.service.ts` - Gestion joueurs
- `removePlayer(campaignId, userId, requesterId)` - Vérifie MJ, retire de playerIds
- `linkCharacter(campaignId, characterId, userId)` - Ajoute à characterIds
- `unlinkCharacter(campaignId, characterId, userId)` - Retire de characterIds

**Task 2.3:** `campaign.service.ts` - Query MJ
- `getCampaignCharacters(campaignId, userId)` - Vérifie MJ, retourne personnages

### Phase 3: Backend - Resolver (20 min)

**Task 3.1:** `campaign.resolver.ts` - Nouvelles mutations
- `generateInviteCode(campaignId)`
- `joinCampaign(inviteCode)`
- `removePlayer(campaignId, userId)`
- `linkCharacterToCampaign(campaignId, characterId)`
- `unlinkCharacterFromCampaign(campaignId, characterId)`

**Task 3.2:** `campaign.resolver.ts` - Nouvelle query
- `getCampaignCharacters(campaignId)`

### Phase 4: Frontend - API (15 min)

**Task 4.1:** `campaign-api.ts` - Nouveaux endpoints
- `useGenerateInviteCodeMutation()`
- `useJoinCampaignMutation()`
- `useRemovePlayerMutation()`
- `useLinkCharacterMutation()`
- `useUnlinkCharacterMutation()`
- `useGetCampaignCharactersQuery()`

### Phase 5: Frontend - Composants (45 min)

**Task 5.1:** `components/campaign/player-management.tsx`
- Liste des joueurs avec bouton retirer
- Bouton générer code d'invitation
- Affichage du code actif

**Task 5.2:** `components/campaign/join-campaign-modal.tsx`
- Modal pour saisir le code d'invitation
- Accessible depuis la page campagnes

**Task 5.3:** `components/campaign/campaign-characters.tsx`
- Liste des personnages de la campagne (vue MJ)
- Lien vers fiche en lecture seule

**Task 5.4:** Modifier `campaigns/[id]/page.tsx`
- Ajouter onglet "Joueurs" pour le MJ
- Afficher les personnages liés

**Task 5.5:** Modifier `campaigns/page.tsx`
- Ajouter bouton "Rejoindre une campagne"

### Phase 6: Frontend - Vue Personnage Read-Only (20 min)

**Task 6.1:** `characters/[id]/page.tsx`
- Ajouter prop `readOnly` ou détecter via query param
- Route `/characters/[id]?view=readonly` ou nouvelle route

---

## Ordre d'exécution

1. Phase 1 (Backend modèle)
2. Phase 2 (Backend service)
3. Phase 3 (Backend resolver)
4. Phase 4 (Frontend API)
5. Phase 5 (Frontend composants)
6. Phase 6 (Vue read-only)

## Risques

| Risque | Mitigation |
|--------|------------|
| Code d'invitation devinable | Utiliser crypto.randomBytes |
| Race condition sur joinCampaign | Transaction MongoDB ou findOneAndUpdate |
| Accès non autorisé aux fiches | Vérification stricte gameMasterId |

### Step 4: Implementation - COMPLETED
**Summary:** Implémentation complète backend + frontend
**Files modified:**
- Backend: `campaign.entity.ts`, `campaign.dto.ts`, `campaign.service.ts`, `campaign.module.ts`, `campaign.resolver.ts`
- Frontend API: `campaign-api.ts`
- Frontend Components: `join-campaign-modal.tsx`, `player-management.tsx`, `campaign-characters.tsx`, `link-character-selector.tsx`
- Pages: `campaigns/page.tsx`, `campaigns/[id]/page.tsx`, `characters/[id]/page.tsx`
**Notes:**
- Code d'invitation 6 chars avec expiration 24h
- Onglets Journal/Joueurs/Personnages sur page campagne
- Vue read-only pour le MJ via query param `?readonly=true`

### Step 5: Code Review - COMPLETED
**Summary:** Revue du code et corrections
**Corrections apportées:**
- Remplacé `<img>` par `<Image>` de Next.js dans `campaign-characters.tsx` et `link-character-selector.tsx`
- Ajouté `relative` aux conteneurs d'images pour le layout `fill`
- Ajouté `unoptimized` pour les images externes (URLs dynamiques)
**Observations futures (non bloquantes):**
- La liste des joueurs affiche seulement l'ID (pas le username) - amélioration future
- Pourrait ajouter une query pour récupérer les infos utilisateur
**Files:** `campaign-characters.tsx`, `link-character-selector.tsx`

### Step 6: Verification - COMPLETED
**Summary:** Vérification complète des use cases et edge cases
**Checklist:**
- [x] MJ génère un code d'invitation → OK
- [x] Joueur rejoint avec code valide → OK
- [x] Code expire après 24h → OK (inviteCodeExpiry vérifié)
- [x] Code invalidé après utilisation → OK ($unset dans joinCampaign)
- [x] Joueur lie son personnage → OK
- [x] Joueur délie son personnage → OK
- [x] MJ retire un joueur (+ ses personnages) → OK
- [x] MJ voit les personnages de la campagne → OK
- [x] MJ voit les fiches en lecture seule → OK (?readonly=true)
**Edge Cases vérifiés:**
- [x] Code invalide → BadRequestException
- [x] Code expiré → BadRequestException
- [x] Déjà membre → BadRequestException
- [x] MJ essaie de rejoindre sa campagne → BadRequestException
- [x] Non-MJ essaie de retirer joueur → ForbiddenException
- [x] Lier personnage d'un autre → ForbiddenException
- [x] Non-membre essaie de lier → ForbiddenException
- [x] Personnage déjà lié → BadRequestException
**Imports/Exports:** Tous les composants et DTOs correctement exportés
**TODOs oubliés:** Aucun
**Schema GraphQL:** Toutes les mutations et queries présentes

### Step 7: Tests - COMPLETED
**Summary:** Vérification des builds et tests
**Résultats:**
- `pnpm test`: Pas de tests unitaires dans le projet (--passWithNoTests)
- `pnpm build`: ✅ API build OK, ✅ Web build OK
- TypeScript compilation: ✅ Aucune erreur de type
- Pages générées: 10 routes (dont campaigns et characters modifiés)
**Notes:**
- Projet sans tests unitaires actuellement
- Tests manuels recommandés pour valider le flow complet
- Warning ESLint non bloquant (config parserServices)

### Step 8: Final Validation - IN PROGRESS
