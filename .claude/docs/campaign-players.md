# Campaign Players & GM Access

## Contexte

Cette fonctionnalité permet au MJ (Game Master) d'inviter des joueurs dans sa campagne et de consulter leurs fiches de personnages en lecture seule.

## Décisions techniques

### Système d'invitation

**Choix : Code d'invitation unique**

- Le MJ génère un code d'invitation (6 caractères alphanumériques)
- Le joueur saisit ce code pour rejoindre la campagne
- Le code expire après utilisation ou après 24h

**Pourquoi pas email/lien ?**
- Plus simple à implémenter
- Pas besoin de système d'email
- Fonctionne offline (le MJ peut donner le code verbalement)

### Accès MJ aux fiches

**Choix : Lecture seule**

- Le MJ peut voir toutes les fiches des joueurs de sa campagne
- Le MJ ne peut pas modifier les fiches (seul le propriétaire peut)
- Implémenté via une query `getCampaignCharacters` avec vérification `gameMasterId`

### Liaison Personnage-Campagne

- Un personnage peut être lié à UNE campagne à la fois
- Ajout d'un champ `campaignId` optionnel sur Character
- Ou utilisation du tableau `characterIds` existant sur Campaign

**Choix : `characterIds` sur Campaign**
- Déjà existant dans le modèle
- Pas de modification du modèle Character
- Un personnage peut potentiellement être dans plusieurs campagnes

## Flow utilisateur

### MJ - Inviter un joueur

```
1. MJ ouvre la page campagne
2. MJ clique "Gérer les joueurs"
3. MJ clique "Générer un code"
4. MJ partage le code au joueur (6 chars, ex: "ABC123")
```

### Joueur - Rejoindre une campagne

```
1. Joueur va sur "Mes campagnes"
2. Joueur clique "Rejoindre une campagne"
3. Joueur entre le code d'invitation
4. Joueur est ajouté à playerIds
5. Joueur peut lier un de ses personnages
```

### MJ - Voir les fiches

```
1. MJ ouvre la page campagne
2. MJ voit l'onglet "Joueurs"
3. MJ clique sur un joueur → voit ses personnages
4. MJ clique sur un personnage → fiche en lecture seule
```

## Modèle de données

### Modifications Campaign

```typescript
// Nouveau champ
inviteCode?: string      // Code actif (null si pas d'invitation en cours)
inviteCodeExpiry?: Date  // Expiration du code
```

### Pas de modification Character

Le champ `characterIds` sur Campaign suffit.

## API GraphQL

### Nouvelles mutations

```graphql
# MJ génère un code
generateInviteCode(campaignId: ID!): String!

# Joueur rejoint avec le code
joinCampaign(inviteCode: String!): Campaign!

# MJ retire un joueur
removePlayer(campaignId: ID!, userId: ID!): Campaign!

# Joueur lie son personnage
linkCharacterToCampaign(campaignId: ID!, characterId: ID!): Campaign!

# Joueur délie son personnage
unlinkCharacterFromCampaign(campaignId: ID!, characterId: ID!): Campaign!
```

### Nouvelles queries

```graphql
# MJ voit les personnages de la campagne
getCampaignCharacters(campaignId: ID!): [Character!]!

# Joueur voit les campagnes qu'il peut rejoindre (via code)
# Pas besoin - le code suffit
```

## Sécurité

- Seul le MJ peut générer des codes d'invitation
- Seul le MJ peut retirer des joueurs
- Seul le propriétaire peut lier/délier son personnage
- Le MJ ne peut que VOIR les fiches, pas les modifier
- Les codes expirent après 24h ou après utilisation

## Tests à prévoir

1. MJ génère un code → code valide retourné
2. Joueur rejoint avec code valide → ajouté à playerIds
3. Joueur rejoint avec code expiré → erreur
4. Joueur rejoint avec code invalide → erreur
5. MJ accède aux personnages → liste correcte
6. Joueur lie son personnage → ajouté à characterIds
7. Joueur essaie de lier le personnage d'un autre → erreur
8. Non-MJ essaie de retirer un joueur → erreur
