// Cyberpunk Red - Complete Equipment Data (French)

export interface WeaponTemplate {
  name: string;
  type: 'MELEE' | 'RANGED' | 'EXOTIC';
  damage: string;
  rof: number;
  magazine?: number;
  skill: string;
  concealable: boolean;
  handsRequired?: number;
}

export interface ArmorTemplate {
  name: string;
  type: 'BODY' | 'HEAD' | 'SHIELD';
  stoppingPower: number;
  penalty: number;
}

export interface CyberwareTemplate {
  name: string;
  type: string;
  installation: 'MALL' | 'CLINIC' | 'HOSPITAL';
  description: string;
  humanityLoss: number;
  cost: number;
}

// === ARMES ===
export const WEAPON_TEMPLATES: WeaponTemplate[] = [
  // Armes de poing
  { name: 'Pistolet léger', type: 'RANGED', damage: '1d6', rof: 2, magazine: 8, skill: 'Arme de poing', concealable: true },
  { name: 'Pistolet moyen', type: 'RANGED', damage: '2d6', rof: 2, magazine: 12, skill: 'Arme de poing', concealable: true },
  { name: 'Pistolet lourd', type: 'RANGED', damage: '3d6', rof: 2, magazine: 8, skill: 'Arme de poing', concealable: true },
  { name: 'Pistolet très lourd', type: 'RANGED', damage: '4d6', rof: 1, magazine: 8, skill: 'Arme de poing', concealable: false },

  // Mitraillettes
  { name: 'Mitraillette légère', type: 'RANGED', damage: '2d6', rof: 1, magazine: 20, skill: 'Tir auto', concealable: true },
  { name: 'Mitraillette moyenne', type: 'RANGED', damage: '2d6', rof: 1, magazine: 30, skill: 'Tir auto', concealable: true },
  { name: 'Mitraillette lourde', type: 'RANGED', damage: '3d6', rof: 1, magazine: 40, skill: 'Tir auto', concealable: false },

  // Fusils
  { name: 'Fusil d\'assaut', type: 'RANGED', damage: '5d6', rof: 1, magazine: 25, skill: 'Arme d\'épaule', concealable: false, handsRequired: 2 },
  { name: 'Fusil de sniper', type: 'RANGED', damage: '5d6', rof: 1, magazine: 4, skill: 'Arme d\'épaule', concealable: false, handsRequired: 2 },
  { name: 'Fusil à pompe', type: 'RANGED', damage: '5d6', rof: 1, magazine: 4, skill: 'Arme d\'épaule', concealable: false, handsRequired: 2 },

  // Armes lourdes
  { name: 'Mitrailleuse', type: 'RANGED', damage: '5d6', rof: 1, magazine: 60, skill: 'Arme lourde', concealable: false, handsRequired: 2 },
  { name: 'Lance-roquettes', type: 'RANGED', damage: '6d6', rof: 1, magazine: 1, skill: 'Arme lourde', concealable: false, handsRequired: 2 },
  { name: 'Lance-grenades', type: 'RANGED', damage: '6d6', rof: 1, magazine: 2, skill: 'Arme lourde', concealable: false, handsRequired: 2 },

  // Armes exotiques
  { name: 'Arc', type: 'RANGED', damage: '4d6', rof: 1, magazine: 1, skill: 'Archerie', concealable: false, handsRequired: 2 },
  { name: 'Arbalète', type: 'RANGED', damage: '4d6', rof: 1, magazine: 1, skill: 'Archerie', concealable: false, handsRequired: 2 },

  // Armes de mêlée
  { name: 'Couteau', type: 'MELEE', damage: '1d6', rof: 2, skill: 'Mêlée', concealable: true },
  { name: 'Épée', type: 'MELEE', damage: '3d6', rof: 2, skill: 'Mêlée', concealable: false },
  { name: 'Katana', type: 'MELEE', damage: '3d6', rof: 2, skill: 'Mêlée', concealable: false },
  { name: 'Machette', type: 'MELEE', damage: '2d6', rof: 2, skill: 'Mêlée', concealable: false },
  { name: 'Batte de baseball', type: 'MELEE', damage: '2d6', rof: 2, skill: 'Mêlée', concealable: false },
  { name: 'Matraque', type: 'MELEE', damage: '1d6', rof: 2, skill: 'Mêlée', concealable: true },
  { name: 'Poing américain', type: 'MELEE', damage: '1d6', rof: 2, skill: 'Bagarre', concealable: true },
  { name: 'Nunchaku', type: 'MELEE', damage: '2d6', rof: 2, skill: 'Arts martiaux', concealable: true },
  { name: 'Chaîne', type: 'MELEE', damage: '2d6', rof: 2, skill: 'Mêlée', concealable: false },
  { name: 'Hache', type: 'MELEE', damage: '3d6', rof: 1, skill: 'Mêlée', concealable: false, handsRequired: 2 },
  { name: 'Marteau', type: 'MELEE', damage: '3d6', rof: 1, skill: 'Mêlée', concealable: false, handsRequired: 2 },
  { name: 'Tronçonneuse', type: 'MELEE', damage: '4d6', rof: 1, skill: 'Mêlée', concealable: false, handsRequired: 2 },
];

// === ARMURES ===
export const ARMOR_TEMPLATES: ArmorTemplate[] = [
  // Armures de corps
  { name: 'Vêtements en cuir', type: 'BODY', stoppingPower: 4, penalty: 0 },
  { name: 'Gilet kevlar', type: 'BODY', stoppingPower: 7, penalty: 0 },
  { name: 'Veste blindée légère', type: 'BODY', stoppingPower: 11, penalty: 0 },
  { name: 'Veste blindée moyenne', type: 'BODY', stoppingPower: 12, penalty: -2 },
  { name: 'Veste blindée lourde', type: 'BODY', stoppingPower: 13, penalty: -2 },
  { name: 'Gilet pare-balles', type: 'BODY', stoppingPower: 11, penalty: 0 },
  { name: 'Armure corporelle', type: 'BODY', stoppingPower: 13, penalty: -2 },
  { name: 'Metalgear', type: 'BODY', stoppingPower: 15, penalty: -4 },

  // Casques
  { name: 'Casque léger', type: 'HEAD', stoppingPower: 11, penalty: 0 },
  { name: 'Casque lourd', type: 'HEAD', stoppingPower: 13, penalty: -2 },
  { name: 'Casque tactique', type: 'HEAD', stoppingPower: 14, penalty: -2 },

  // Boucliers
  { name: 'Bouclier anti-émeute', type: 'SHIELD', stoppingPower: 10, penalty: -2 },
  { name: 'Bouclier balistique', type: 'SHIELD', stoppingPower: 15, penalty: -4 },
];

// === CYBERWARE ===
export const CYBERWARE_TEMPLATES: CyberwareTemplate[] = [
  // FASHIONWARE (Mall)
  { name: 'Biomonitor', type: 'FASHIONWARE', installation: 'MALL', description: 'Affiche vos signes vitaux', humanityLoss: 0, cost: 100 },
  { name: 'Cheveux lumineux', type: 'FASHIONWARE', installation: 'MALL', description: 'Cheveux qui brillent de différentes couleurs', humanityLoss: 0, cost: 100 },
  { name: 'Peau chromatique', type: 'FASHIONWARE', installation: 'MALL', description: 'Peau qui change de couleur', humanityLoss: 0, cost: 100 },
  { name: 'Tatouages lumineux', type: 'FASHIONWARE', installation: 'MALL', description: 'Tatouages qui brillent', humanityLoss: 0, cost: 100 },
  { name: 'Tech Hair', type: 'FASHIONWARE', installation: 'MALL', description: 'Cheveux high-tech personnalisables', humanityLoss: 0, cost: 100 },
  { name: 'Yeux cosmétiques', type: 'FASHIONWARE', installation: 'MALL', description: 'Lentilles colorées permanentes', humanityLoss: 0, cost: 100 },

  // NEURALWARE (Clinic)
  { name: 'Neural Link', type: 'NEURALWARE', installation: 'CLINIC', description: 'Interface neurale de base (3 slots)', humanityLoss: 7, cost: 500 },
  { name: 'Plugs d\'interface', type: 'NEURALWARE', installation: 'CLINIC', description: 'Permet de se connecter aux systèmes', humanityLoss: 7, cost: 500 },
  { name: 'Chipware Socket', type: 'NEURALWARE', installation: 'CLINIC', description: 'Socket pour chips de compétence', humanityLoss: 7, cost: 500 },
  { name: 'Kerenzikov', type: 'NEURALWARE', installation: 'CLINIC', description: '+2 Initiative', humanityLoss: 14, cost: 500 },
  { name: 'Sandevistan', type: 'NEURALWARE', installation: 'CLINIC', description: '+3 Initiative (3/jour)', humanityLoss: 14, cost: 500 },
  { name: 'Speedware (Basic)', type: 'NEURALWARE', installation: 'CLINIC', description: '+1 Initiative', humanityLoss: 7, cost: 500 },
  { name: 'Tactile Boost', type: 'NEURALWARE', installation: 'CLINIC', description: '+2 aux jets de perception tactile', humanityLoss: 7, cost: 100 },
  { name: 'Olfactory Boost', type: 'NEURALWARE', installation: 'CLINIC', description: '+2 aux jets de perception olfactive', humanityLoss: 7, cost: 100 },
  { name: 'Pain Editor', type: 'NEURALWARE', installation: 'CLINIC', description: 'Ignore les pénalités de blessure', humanityLoss: 14, cost: 1000 },
  { name: 'Reflex Co-Processor', type: 'NEURALWARE', installation: 'CLINIC', description: '+1 REF', humanityLoss: 21, cost: 1000 },

  // CYBEROPTICS (Clinic)
  { name: 'Cybereye', type: 'CYBEROPTICS', installation: 'CLINIC', description: 'Oeil cybernétique de base (3 slots)', humanityLoss: 7, cost: 100 },
  { name: 'Vision anti-éblouissement', type: 'CYBEROPTICS', installation: 'CLINIC', description: 'Protection contre les flashs', humanityLoss: 2, cost: 100 },
  { name: 'Vision nocturne', type: 'CYBEROPTICS', installation: 'CLINIC', description: 'Voir dans le noir', humanityLoss: 7, cost: 500 },
  { name: 'Vision infrarouge', type: 'CYBEROPTICS', installation: 'CLINIC', description: 'Détection de chaleur', humanityLoss: 7, cost: 500 },
  { name: 'Vision thermographique', type: 'CYBEROPTICS', installation: 'CLINIC', description: 'Vision thermique avancée', humanityLoss: 7, cost: 500 },
  { name: 'Zoom optique', type: 'CYBEROPTICS', installation: 'CLINIC', description: 'Zoom x20', humanityLoss: 2, cost: 100 },
  { name: 'Caméra intégrée', type: 'CYBEROPTICS', installation: 'CLINIC', description: 'Enregistrement vidéo', humanityLoss: 7, cost: 500 },
  { name: 'Viseur de ciblage', type: 'CYBEROPTICS', installation: 'CLINIC', description: '+1 à l\'attaque à distance', humanityLoss: 7, cost: 500 },
  { name: 'Analyseur de menace', type: 'CYBEROPTICS', installation: 'CLINIC', description: 'Identifie les armes cachées', humanityLoss: 7, cost: 500 },
  { name: 'MicroOptics', type: 'CYBEROPTICS', installation: 'CLINIC', description: 'Vision microscopique', humanityLoss: 2, cost: 100 },

  // CYBERAUDIO (Clinic)
  { name: 'Cyberaudio Suite', type: 'CYBERAUDIO', installation: 'CLINIC', description: 'Système audio de base (3 slots)', humanityLoss: 7, cost: 500 },
  { name: 'Amplificateur audio', type: 'CYBERAUDIO', installation: 'CLINIC', description: '+2 perception auditive', humanityLoss: 2, cost: 100 },
  { name: 'Filtre anti-bruit', type: 'CYBERAUDIO', installation: 'CLINIC', description: 'Protège contre les attaques sonores', humanityLoss: 2, cost: 100 },
  { name: 'Radio interne', type: 'CYBERAUDIO', installation: 'CLINIC', description: 'Communication radio intégrée', humanityLoss: 2, cost: 100 },
  { name: 'Téléphone interne', type: 'CYBERAUDIO', installation: 'CLINIC', description: 'Téléphone cérébral', humanityLoss: 2, cost: 100 },
  { name: 'Scrambler/Descrambler', type: 'CYBERAUDIO', installation: 'CLINIC', description: 'Communications cryptées', humanityLoss: 2, cost: 100 },
  { name: 'Enregistreur audio', type: 'CYBERAUDIO', installation: 'CLINIC', description: 'Enregistre les conversations', humanityLoss: 2, cost: 100 },
  { name: 'Analyseur de voix', type: 'CYBERAUDIO', installation: 'CLINIC', description: 'Détecte les mensonges (+2)', humanityLoss: 7, cost: 500 },
  { name: 'Détecteur de direction', type: 'CYBERAUDIO', installation: 'CLINIC', description: 'Localise les sources sonores', humanityLoss: 2, cost: 100 },
  { name: 'Radar auditif', type: 'CYBERAUDIO', installation: 'CLINIC', description: 'Écholocalisation', humanityLoss: 7, cost: 500 },

  // INTERNAL BODY (Clinic/Hospital)
  { name: 'Cardiovascular Booster', type: 'INTERNAL_BODY', installation: 'CLINIC', description: '+2 END pour course', humanityLoss: 7, cost: 500 },
  { name: 'Enhanced Antibodies', type: 'INTERNAL_BODY', installation: 'CLINIC', description: '+2 aux jets de résistance aux maladies', humanityLoss: 7, cost: 500 },
  { name: 'Toxin Binders', type: 'INTERNAL_BODY', installation: 'CLINIC', description: '+2 aux jets contre les poisons', humanityLoss: 7, cost: 500 },
  { name: 'Nanosurgeons', type: 'INTERNAL_BODY', installation: 'HOSPITAL', description: 'Guérison accélérée (+1 HP/jour)', humanityLoss: 14, cost: 500 },
  { name: 'Cybersnake', type: 'INTERNAL_BODY', installation: 'HOSPITAL', description: 'Tentacule interne (attaque 2d6)', humanityLoss: 14, cost: 1000 },
  { name: 'Independent Air Supply', type: 'INTERNAL_BODY', installation: 'CLINIC', description: '30 min d\'oxygène interne', humanityLoss: 7, cost: 500 },
  { name: 'Gills', type: 'INTERNAL_BODY', installation: 'HOSPITAL', description: 'Respirer sous l\'eau', humanityLoss: 14, cost: 1000 },

  // EXTERNAL BODY (Clinic/Hospital)
  { name: 'Skin Weave', type: 'EXTERNAL_BODY', installation: 'CLINIC', description: 'PA +2 (se cumule)', humanityLoss: 7, cost: 500 },
  { name: 'Subdermal Armor', type: 'EXTERNAL_BODY', installation: 'HOSPITAL', description: 'PA +4 (se cumule)', humanityLoss: 14, cost: 1000 },
  { name: 'Subdermal Pocket', type: 'EXTERNAL_BODY', installation: 'CLINIC', description: 'Compartiment caché', humanityLoss: 7, cost: 500 },
  { name: 'Motion Detector', type: 'EXTERNAL_BODY', installation: 'CLINIC', description: 'Détecte les mouvements à 6m', humanityLoss: 7, cost: 500 },
  { name: 'Techhair', type: 'EXTERNAL_BODY', installation: 'MALL', description: 'Cheveux avec compartiments', humanityLoss: 0, cost: 100 },
  { name: 'Superchrome', type: 'EXTERNAL_BODY', installation: 'CLINIC', description: 'Peau métallique brillante', humanityLoss: 14, cost: 1000 },

  // CYBERLIMBS - ARMS (Hospital)
  { name: 'Cyberarm Standard', type: 'CYBERARM', installation: 'HOSPITAL', description: 'Bras cybernétique (4 slots)', humanityLoss: 7, cost: 500 },
  { name: 'Main normale', type: 'CYBERARM', installation: 'HOSPITAL', description: 'Main de remplacement standard', humanityLoss: 2, cost: 100 },
  { name: 'Poigne hydraulique', type: 'CYBERARM', installation: 'HOSPITAL', description: '+2 aux jets de Force (prise)', humanityLoss: 7, cost: 500 },
  { name: 'Griffes rétractiles', type: 'CYBERARM', installation: 'HOSPITAL', description: 'Attaque 2d6, dissimulable', humanityLoss: 7, cost: 500 },
  { name: 'Lames Mantis', type: 'CYBERARM', installation: 'HOSPITAL', description: 'Attaque 4d6, très mortelles', humanityLoss: 14, cost: 500 },
  { name: 'Wolvers', type: 'CYBERARM', installation: 'HOSPITAL', description: 'Griffes 3d6, rétractiles', humanityLoss: 14, cost: 500 },
  { name: 'Bras Gorille', type: 'CYBERARM', installation: 'HOSPITAL', description: '+4 aux dégâts de mêlée', humanityLoss: 14, cost: 500 },
  { name: 'Grappin', type: 'CYBERARM', installation: 'HOSPITAL', description: 'Câble de 30m avec grappin', humanityLoss: 7, cost: 500 },
  { name: 'Quickchange Mount', type: 'CYBERARM', installation: 'HOSPITAL', description: 'Changement rapide de main', humanityLoss: 2, cost: 100 },
  { name: 'Tool Hand', type: 'CYBERARM', installation: 'HOSPITAL', description: 'Main avec outils intégrés', humanityLoss: 7, cost: 500 },
  { name: 'Arme cachée', type: 'CYBERARM', installation: 'HOSPITAL', description: 'Pistolet dans le bras', humanityLoss: 7, cost: 500 },

  // CYBERLIMBS - LEGS (Hospital)
  { name: 'Cyberleg Standard', type: 'CYBERLEG', installation: 'HOSPITAL', description: 'Jambe cybernétique (3 slots)', humanityLoss: 7, cost: 500 },
  { name: 'Talon Blade', type: 'CYBERLEG', installation: 'HOSPITAL', description: 'Lame de talon (2d6)', humanityLoss: 7, cost: 500 },
  { name: 'Web Foot', type: 'CYBERLEG', installation: 'HOSPITAL', description: 'Pieds palmés pour nager', humanityLoss: 7, cost: 500 },
  { name: 'Jump Boosters', type: 'CYBERLEG', installation: 'HOSPITAL', description: 'Saut x3 distance normale', humanityLoss: 7, cost: 500 },
  { name: 'Skate Foot', type: 'CYBERLEG', installation: 'HOSPITAL', description: 'Rollers intégrés (+6 MOVE)', humanityLoss: 7, cost: 500 },
  { name: 'Sprint Legs', type: 'CYBERLEG', installation: 'HOSPITAL', description: '+2 MOVE en course', humanityLoss: 14, cost: 500 },
  { name: 'Grip Foot', type: 'CYBERLEG', installation: 'HOSPITAL', description: 'Escalade sans équipement', humanityLoss: 7, cost: 500 },

  // BORGWARE (Hospital)
  { name: 'Artificial Shoulder Mount', type: 'BORGWARE', installation: 'HOSPITAL', description: 'Épaule pour arme montée', humanityLoss: 14, cost: 1000 },
  { name: 'Implanted Linear Frame', type: 'BORGWARE', installation: 'HOSPITAL', description: 'Exosquelette interne (+4 BODY)', humanityLoss: 28, cost: 5000 },
  { name: 'Sensor Array', type: 'BORGWARE', installation: 'HOSPITAL', description: 'Multiples capteurs avancés', humanityLoss: 21, cost: 1000 },
  { name: 'MultiOptic Mount', type: 'BORGWARE', installation: 'HOSPITAL', description: 'Plusieurs yeux cybernétiques', humanityLoss: 21, cost: 1000 },
];

// Type labels for display
export const CYBERWARE_TYPE_LABELS: Record<string, string> = {
  FASHIONWARE: 'Fashionware',
  NEURALWARE: 'Neuroware',
  CYBEROPTICS: 'Cyberoptique',
  CYBERAUDIO: 'Cyberaudio',
  INTERNAL_BODY: 'Interne',
  EXTERNAL_BODY: 'Externe',
  CYBERARM: 'Cyberbras',
  CYBERLEG: 'Cyberjambe',
  BORGWARE: 'Borgware',
};

export const INSTALLATION_LABELS: Record<string, string> = {
  MALL: 'Mall',
  CLINIC: 'Clinique',
  HOSPITAL: 'Hôpital',
};

export const WEAPON_TYPE_LABELS: Record<string, string> = {
  MELEE: 'Mêlée',
  RANGED: 'Distance',
  EXOTIC: 'Exotique',
};

export const ARMOR_TYPE_LABELS: Record<string, string> = {
  BODY: 'Corps',
  HEAD: 'Tête',
  SHIELD: 'Bouclier',
};
