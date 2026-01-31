/**
 * Cyberpunk Red Core Data
 * Données de référence pour la création et validation de personnages
 */

// ============================================
// COMPÉTENCES - Les 66 compétences de Cyberpunk Red
// ============================================

export const SKILLS_BY_STAT = {
  INT: [
    'Comptabilité',
    'Dressage',
    'Bureaucratie',
    'Business',
    'Composition',
    'Criminologie',
    'Cryptographie',
    'Déduction',
    'Éducation',
    'Jeu',
    'Langue',
    'Recherche documentaire',
    'Expert local',
    'Science',
    'Tactique',
    'Survie en milieu naturel',
  ],
  REF: [
    'Archerie',
    'Tir automatique',
    'Bagarre',
    'Esquive',
    'Arme de poing',
    'Arme lourde',
    'Arts martiaux',
    'Arme de mêlée',
    'Arme d\'épaule',
  ],
  DEX: ['Athlétisme', 'Contorsion', 'Danse', 'Conduite', 'Pilotage aérien', 'Pilotage maritime', 'Équitation', 'Discrétion'],
  TECH: [
    'Mécanique aérienne',
    'Technique de base',
    'Cybertechnique',
    'Démolition',
    'Électronique/Sécurité',
    'Premiers secours',
    'Falsification',
    'Mécanique terrestre',
    'Art visuel',
    'Paramédical',
    'Photo/Vidéo',
    'Crochetage',
    'Pickpocket',
    'Mécanique navale',
    'Armurerie',
  ],
  COOL: ['Comédie', 'Corruption', 'Conversation', 'Perception humaine', 'Interrogatoire', 'Persuasion', 'Soin personnel', 'Connaissance de la rue', 'Négociation', 'Style vestimentaire'],
  WILL: ['Concentration', 'Endurance', 'Résistance torture/drogues'],
  EMP: ['Perception'],
} as const;

export const ALL_SKILLS = Object.entries(SKILLS_BY_STAT).flatMap(([stat, skills]) =>
  skills.map((name) => ({ name, linkedStat: stat }))
);

// ============================================
// CAPACITÉS DE RÔLE
// ============================================

export const ROLE_ABILITIES = {
  SOLO: {
    name: 'Conscience du combat',
    description:
      'Ajoute le rang de Conscience du combat à l\'Initiative. Au rang 4+, ajoute aux jets d\'attaque à distance. Au rang 6+, ajoute aux dégâts. Au rang 8+, choisissez Attaque de précision ou Détection de menaces.',
  },
  NETRUNNER: {
    name: 'Interface',
    description:
      'Accède au NET via un cyberdeck. Actions de Netrunning : Jack In/Out, Activer programme, Scanner, Porte dérobée, Camouflage, Contrôle, Identification, Éclaireur, Glissement, Virus, Zap.',
  },
  TECH: {
    name: 'Fabricant',
    description:
      'Fabrique des objets, améliorations et invente de nouveaux gadgets. Expertise de terrain pour réparations rapides. Expertise d\'amélioration pour modifications. Expertise d\'invention pour créer de nouveaux objets.',
  },
  MEDTECH: {
    name: 'Médecine',
    description:
      'Spécialisation en Chirurgie (installer cyberware, soigner blessures critiques), Pharmacologie (créer des drogues), ou Opération cryogénique (tanks cryo pour guérison/préservation).',
    specializations: ['Chirurgie', 'Pharmacologie', 'Opération cryogénique'],
  },
  MEDIA: {
    name: 'Crédibilité',
    description:
      'Influence l\'opinion publique. La crédibilité détermine votre portée et impact. Peut exposer des secrets, rallier du soutien ou détruire des réputations.',
  },
  EXEC: {
    name: 'Travail d\'équipe',
    description:
      'Dirige une équipe corporatiste. Les membres ont des compétences utiles. Rang plus élevé = équipe plus grande, meilleures compétences, plus de loyauté.',
  },
  LAWMAN: {
    name: 'Renforts',
    description:
      'Appelle des renforts police/sécurité. Rang plus élevé = plus d\'agents, mieux équipés, réponse plus rapide. Utilisable dans sa juridiction.',
  },
  FIXER: {
    name: 'Opérateur',
    description:
      'Accès au marché noir, trouve des objets rares, établit des connexions. Rang plus élevé = meilleurs prix, objets plus rares, contacts plus fiables.',
  },
  NOMAD: {
    name: 'Moto',
    description:
      'Accès aux véhicules du clan. Rang plus élevé = plus de véhicules, mieux armés/blindés, plus grande capacité de transport.',
  },
  ROCKERBOY: {
    name: 'Impact charismatique',
    description:
      'Influence les fans et les foules par la performance. Peut inspirer l\'action, calmer les émeutes ou inciter à la rébellion. Rang plus élevé = influence plus grande.',
  },
} as const;

// ============================================
// CYBERWARE - Exemples courants
// ============================================

export const FOUNDATIONAL_CYBERWARE = [
  { name: 'Lien neural', type: 'NEURALWARE', cost: 500, humanityLoss: 7, optionSlots: 5, installation: 'CLINIC' },
  { name: 'Suite cyberaudio', type: 'CYBERAUDIO', cost: 500, humanityLoss: 7, optionSlots: 3, installation: 'CLINIC' },
  { name: 'Cyberoeil', type: 'CYBEROPTICS', cost: 100, humanityLoss: 7, optionSlots: 3, installation: 'CLINIC' },
  { name: 'Cyberbras', type: 'CYBERARM', cost: 500, humanityLoss: 7, optionSlots: 4, installation: 'HOSPITAL' },
  { name: 'Cyberjambe', type: 'CYBERLEG', cost: 500, humanityLoss: 7, optionSlots: 3, installation: 'HOSPITAL' },
] as const;

export const CYBERWARE_OPTIONS = {
  NEURALWARE: [
    { name: 'Enregistreur braindance', cost: 500, humanityLoss: 0 },
    { name: 'Socket à puces', cost: 500, humanityLoss: 7 },
    { name: 'Prises d\'interface', cost: 500, humanityLoss: 7 },
    { name: 'Kerenzikov', cost: 500, humanityLoss: 14 },
    { name: 'Sandevistan', cost: 500, humanityLoss: 14 },
    { name: 'Analyseur chimique', cost: 500, humanityLoss: 0 },
    { name: 'Éditeur de douleur', cost: 1000, humanityLoss: 14 },
  ],
  CYBEROPTICS: [
    { name: 'Anti-éblouissement', cost: 100, humanityLoss: 0 },
    { name: 'Chyron', cost: 100, humanityLoss: 0 },
    { name: 'Changement de couleur', cost: 100, humanityLoss: 0 },
    { name: 'Pistolet à fléchettes', cost: 500, humanityLoss: 2 },
    { name: 'Amélioration d\'image', cost: 500, humanityLoss: 0 },
    { name: 'Vision nocturne/IR/UV', cost: 500, humanityLoss: 0 },
    { name: 'MicroOptique', cost: 500, humanityLoss: 0 },
    { name: 'Viseur de ciblage', cost: 500, humanityLoss: 0 },
    { name: 'TéléOptique', cost: 500, humanityLoss: 0 },
    { name: 'Virtualité', cost: 100, humanityLoss: 0 },
  ],
  CYBERAUDIO: [
    { name: 'Audition amplifiée', cost: 100, humanityLoss: 0 },
    { name: 'Enregistreur audio', cost: 100, humanityLoss: 0 },
    { name: 'Détecteur de micros', cost: 100, humanityLoss: 0 },
    { name: 'Traceur', cost: 100, humanityLoss: 0 },
    { name: 'Agent interne', cost: 100, humanityLoss: 0 },
    { name: 'Limiteur de niveau', cost: 100, humanityLoss: 0 },
    { name: 'Radio communicateur', cost: 100, humanityLoss: 0 },
    { name: 'Détecteur radar', cost: 500, humanityLoss: 0 },
    { name: 'Brouilleur/Débrouilleur', cost: 100, humanityLoss: 0 },
    { name: 'Analyseur vocal', cost: 100, humanityLoss: 0 },
  ],
  CYBERARM: [
    { name: 'Gros poings', cost: 100, humanityLoss: 3 },
    { name: 'Cyberdeck', cost: 500, humanityLoss: 0 },
    { name: 'Main grappin', cost: 100, humanityLoss: 3 },
    { name: 'Scanner médical', cost: 500, humanityLoss: 0 },
    { name: 'Lance-grenades rétractable', cost: 500, humanityLoss: 7 },
    { name: 'Arme de mêlée rétractable', cost: 500, humanityLoss: 7 },
    { name: 'Arme à distance rétractable', cost: 500, humanityLoss: 7 },
    { name: 'Montage changement rapide', cost: 100, humanityLoss: 0 },
    { name: 'Griffes', cost: 500, humanityLoss: 7 },
    { name: 'Égratigneurs', cost: 100, humanityLoss: 3 },
    { name: 'Caméra d\'épaule', cost: 500, humanityLoss: 0 },
    { name: 'Lame tranchante', cost: 500, humanityLoss: 7 },
    { name: 'Poignée sous-dermique', cost: 100, humanityLoss: 3 },
    { name: 'Scanner technique', cost: 500, humanityLoss: 0 },
    { name: 'Main outil', cost: 100, humanityLoss: 0 },
    { name: 'Wolvers', cost: 500, humanityLoss: 7 },
  ],
  INTERNAL_BODY: [
    { name: 'AudioVox', cost: 500, humanityLoss: 3 },
    { name: 'Implant contraceptif', cost: 10, humanityLoss: 0 },
    { name: 'Cyberserpent', cost: 1000, humanityLoss: 14 },
    { name: 'Branchies', cost: 1000, humanityLoss: 7 },
    { name: 'Muscles et os greffés', cost: 1000, humanityLoss: 14 },
    { name: 'Réserve d\'air indépendante', cost: 1000, humanityLoss: 2 },
    { name: 'Mr. Studd/Midnight Lady', cost: 100, humanityLoss: 7 },
    { name: 'Filtres nasaux', cost: 100, humanityLoss: 0 },
    { name: 'Implant radar/sonar', cost: 1000, humanityLoss: 7 },
    { name: 'Liants à toxines', cost: 100, humanityLoss: 0 },
    { name: 'Vampyres', cost: 500, humanityLoss: 14 },
  ],
  EXTERNAL_BODY: [
    { name: 'Holster caché', cost: 500, humanityLoss: 0 },
    { name: 'Trame cutanée', cost: 500, humanityLoss: 7 },
    { name: 'Armure sous-dermique', cost: 1000, humanityLoss: 14 },
    { name: 'Poche sous-dermique', cost: 100, humanityLoss: 3 },
    { name: 'Revêtement superchrome', cost: 1000, humanityLoss: 14 },
  ],
  FASHIONWARE: [
    { name: 'Biomoniteur', cost: 100, humanityLoss: 0 },
    { name: 'Peau chimique', cost: 100, humanityLoss: 0 },
    { name: 'Filaments EMP', cost: 10, humanityLoss: 0 },
    { name: 'Tatouage lumineux', cost: 100, humanityLoss: 0 },
    { name: 'Lentilles changeantes', cost: 100, humanityLoss: 0 },
    { name: 'Montre cutanée', cost: 100, humanityLoss: 0 },
    { name: 'Cheveux tech', cost: 100, humanityLoss: 0 },
  ],
} as const;

// ============================================
// ARMES - Exemples courants
// ============================================

export const WEAPONS = {
  MELEE: [
    { name: 'Arme de mêlée légère', damage: '1d6', rof: 2, skill: 'Arme de mêlée', concealable: true },
    { name: 'Arme de mêlée moyenne', damage: '2d6', rof: 2, skill: 'Arme de mêlée', concealable: false },
    { name: 'Arme de mêlée lourde', damage: '3d6', rof: 2, skill: 'Arme de mêlée', concealable: false, handsRequired: 2 },
    { name: 'Arme de mêlée très lourde', damage: '4d6', rof: 1, skill: 'Arme de mêlée', concealable: false, handsRequired: 2 },
  ],
  RANGED: [
    { name: 'Pistolet moyen', damage: '2d6', rof: 2, magazine: 12, skill: 'Arme de poing', concealable: true },
    { name: 'Pistolet lourd', damage: '3d6', rof: 2, magazine: 8, skill: 'Arme de poing', concealable: true },
    { name: 'Pistolet très lourd', damage: '4d6', rof: 1, magazine: 8, skill: 'Arme de poing', concealable: false },
    { name: 'Mitraillette', damage: '2d6', rof: 1, magazine: 30, skill: 'Tir automatique', concealable: true },
    { name: 'Mitraillette lourde', damage: '3d6', rof: 1, magazine: 40, skill: 'Tir automatique', concealable: false },
    { name: 'Fusil d\'assaut', damage: '5d6', rof: 1, magazine: 25, skill: 'Arme d\'épaule', concealable: false, handsRequired: 2 },
    { name: 'Fusil à pompe', damage: '5d6', rof: 1, magazine: 4, skill: 'Arme d\'épaule', concealable: false, handsRequired: 2 },
    { name: 'Fusil de précision', damage: '5d6', rof: 1, magazine: 4, skill: 'Arme d\'épaule', concealable: false, handsRequired: 2 },
    { name: 'Arc', damage: '4d6', rof: 1, magazine: 1, skill: 'Archerie', concealable: false, handsRequired: 2 },
    { name: 'Arbalète', damage: '4d6', rof: 1, magazine: 1, skill: 'Archerie', concealable: false, handsRequired: 2 },
  ],
  EXOTIC: [
    { name: 'Lance-grenades', damage: '6d6', rof: 1, magazine: 2, skill: 'Arme lourde', concealable: false, handsRequired: 2 },
    { name: 'Lance-roquettes', damage: '8d6', rof: 1, magazine: 1, skill: 'Arme lourde', concealable: false, handsRequired: 2 },
  ],
} as const;

// ============================================
// ARMURES - Exemples courants
// ============================================

export const ARMOR = {
  BODY: [
    { name: 'Cuir', stoppingPower: 4, penalty: 0 },
    { name: 'Kevlar', stoppingPower: 7, penalty: 0 },
    { name: 'Veste blindée légère', stoppingPower: 11, penalty: 0 },
    { name: 'Veste blindée moyenne', stoppingPower: 12, penalty: -2 },
    { name: 'Veste blindée lourde', stoppingPower: 13, penalty: -2 },
    { name: 'Gilet pare-éclats', stoppingPower: 15, penalty: -4 },
    { name: 'Metalgear', stoppingPower: 18, penalty: -4 },
  ],
  HEAD: [
    { name: 'Casque léger', stoppingPower: 11, penalty: 0 },
    { name: 'Casque lourd', stoppingPower: 13, penalty: -2 },
    { name: 'Casque pare-éclats', stoppingPower: 15, penalty: -4 },
    { name: 'Casque metalgear', stoppingPower: 18, penalty: -4 },
  ],
  SHIELD: [
    { name: 'Bouclier pare-balles', stoppingPower: 10, penalty: 0 },
    { name: 'Bouclier corporel', stoppingPower: 20, penalty: -2 },
  ],
} as const;

// ============================================
// LIMITES DE STATISTIQUES
// ============================================

export const STAT_LIMITS = {
  MIN: 2,
  MAX: 8,
  TOTAL_POINTS: 62, // Pour création de personnage standard
} as const;

export const SKILL_LIMITS = {
  MIN: 0,
  MAX: 10,
  STARTING_POINTS: 86, // Pour template Streetrat
} as const;

// ============================================
// ORIGINES CULTURELLES (Lifepath)
// ============================================

export const CULTURAL_ORIGINS = [
  'Nord-Américain',
  'Sud/Centre-Américain',
  'Europe de l\'Ouest',
  'Europe de l\'Est',
  'Moyen-Orient/Afrique du Nord',
  'Afrique subsaharienne',
  'Asie du Sud',
  'Asie du Sud-Est',
  'Asie de l\'Est',
  'Océanie/Îles du Pacifique',
] as const;

export const LANGUAGES_BY_ORIGIN = {
  'Nord-Américain': ['Anglais', 'Espagnol'],
  'Sud/Centre-Américain': ['Espagnol', 'Portugais'],
  'Europe de l\'Ouest': ['Anglais', 'Français', 'Allemand', 'Italien', 'Espagnol'],
  'Europe de l\'Est': ['Russe', 'Polonais', 'Ukrainien'],
  'Moyen-Orient/Afrique du Nord': ['Arabe', 'Hébreu', 'Persan', 'Turc'],
  'Afrique subsaharienne': ['Swahili', 'Français', 'Arabe'],
  'Asie du Sud': ['Hindi', 'Ourdou', 'Bengali', 'Tamoul'],
  'Asie du Sud-Est': ['Vietnamien', 'Thaï', 'Filipino', 'Indonésien'],
  'Asie de l\'Est': ['Chinois', 'Japonais', 'Coréen'],
  'Océanie/Îles du Pacifique': ['Anglais', 'Tagalog'],
} as const;
