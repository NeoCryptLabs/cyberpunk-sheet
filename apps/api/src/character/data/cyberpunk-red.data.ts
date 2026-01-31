/**
 * Cyberpunk Red Core Data
 * Reference data for character creation and validation
 */

// ============================================
// SKILLS - All 66 skills from Cyberpunk Red
// ============================================

export const SKILLS_BY_STAT = {
  INT: [
    'Accounting',
    'Animal Handling',
    'Bureaucracy',
    'Business',
    'Composition',
    'Criminology',
    'Cryptography',
    'Deduction',
    'Education',
    'Gamble',
    'Language',
    'Library Search',
    'Local Expert',
    'Science',
    'Tactics',
    'Wilderness Survival',
  ],
  REF: [
    'Archery',
    'Autofire',
    'Brawling',
    'Evasion',
    'Handgun',
    'Heavy Weapons',
    'Martial Arts',
    'Melee Weapon',
    'Shoulder Arms',
  ],
  DEX: ['Athletics', 'Contortionist', 'Dance', 'Driving', 'Pilot Air Vehicle', 'Pilot Sea Vehicle', 'Riding', 'Stealth'],
  TECH: [
    'Air Vehicle Tech',
    'Basic Tech',
    'Cybertech',
    'Demolitions',
    'Electronics/Security Tech',
    'First Aid',
    'Forgery',
    'Land Vehicle Tech',
    'Paint/Draw/Sculpt',
    'Paramedic',
    'Photography/Film',
    'Pick Lock',
    'Pick Pocket',
    'Sea Vehicle Tech',
    'Weaponstech',
  ],
  COOL: ['Acting', 'Bribery', 'Conversation', 'Human Perception', 'Interrogation', 'Persuasion', 'Personal Grooming', 'Streetwise', 'Trading', 'Wardrobe & Style'],
  WILL: ['Concentration', 'Endurance', 'Resist Torture/Drugs'],
  EMP: ['Perception'],
} as const;

export const ALL_SKILLS = Object.entries(SKILLS_BY_STAT).flatMap(([stat, skills]) =>
  skills.map((name) => ({ name, linkedStat: stat }))
);

// ============================================
// ROLE ABILITIES
// ============================================

export const ROLE_ABILITIES = {
  SOLO: {
    name: 'Combat Awareness',
    description:
      'Add Combat Awareness rank to Initiative. At rank 4+, add to ranged attack rolls. At rank 6+, add to damage. At rank 8+, choose Precision Attack or Threat Detection.',
  },
  NETRUNNER: {
    name: 'Interface',
    description:
      'Access the NET using cyberdeck. Make Netrunning actions: Jack In/Out, Activate Program, Scanner, Backdoor, Cloak, Control, Eye-Dee, Pathfinder, Slide, Virus, Zap.',
  },
  TECH: {
    name: 'Maker',
    description:
      'Fabricate items, upgrades, and invent new gadgets. Field Expertise allows quick repairs. Upgrade Expertise adds modifications. Invention Expertise creates new items.',
  },
  MEDTECH: {
    name: 'Medicine',
    description:
      'Specialize in Surgery (install cyberware, treat critical injuries), Pharmaceuticals (create drugs), or Cryosystem Operation (cryo tanks for healing/preservation).',
    specializations: ['Surgery', 'Pharmaceuticals', 'Cryosystem Operation'],
  },
  MEDIA: {
    name: 'Credibility',
    description:
      'Influence public opinion. Credibility determines your reach and impact. Can expose secrets, rally support, or destroy reputations.',
  },
  EXEC: {
    name: 'Teamwork',
    description:
      'Lead a corporate team. Team members have skills that can assist you. Higher rank = bigger team, better skills, more loyalty.',
  },
  LAWMAN: {
    name: 'Backup',
    description:
      'Call for police/security backup. Higher rank = more officers, better equipped, faster response. Usable within jurisdiction.',
  },
  FIXER: {
    name: 'Operator',
    description:
      'Access black market, find rare items, make connections. Higher rank = better prices, rarer items, more reliable contacts.',
  },
  NOMAD: {
    name: 'Moto',
    description:
      'Access to clan vehicles. Higher rank = more vehicles, better armed/armored, larger transport capacity.',
  },
  ROCKERBOY: {
    name: 'Charismatic Impact',
    description:
      'Influence fans and crowds through performance. Can inspire action, calm riots, or incite rebellion. Higher rank = larger influence.',
  },
} as const;

// ============================================
// CYBERWARE - Common examples
// ============================================

export const FOUNDATIONAL_CYBERWARE = [
  { name: 'Neural Link', type: 'NEURALWARE', cost: 500, humanityLoss: 7, optionSlots: 5, installation: 'CLINIC' },
  { name: 'Cyberaudio Suite', type: 'CYBERAUDIO', cost: 500, humanityLoss: 7, optionSlots: 3, installation: 'CLINIC' },
  { name: 'Cybereye', type: 'CYBEROPTICS', cost: 100, humanityLoss: 7, optionSlots: 3, installation: 'CLINIC' },
  { name: 'Cyberarm', type: 'CYBERARM', cost: 500, humanityLoss: 7, optionSlots: 4, installation: 'HOSPITAL' },
  { name: 'Cyberleg', type: 'CYBERLEG', cost: 500, humanityLoss: 7, optionSlots: 3, installation: 'HOSPITAL' },
] as const;

export const CYBERWARE_OPTIONS = {
  NEURALWARE: [
    { name: 'Braindance Recorder', cost: 500, humanityLoss: 0 },
    { name: 'Chipware Socket', cost: 500, humanityLoss: 7 },
    { name: 'Interface Plugs', cost: 500, humanityLoss: 7 },
    { name: 'Kerenzikov', cost: 500, humanityLoss: 14 },
    { name: 'Sandevistan', cost: 500, humanityLoss: 14 },
    { name: 'Chemical Analyzer', cost: 500, humanityLoss: 0 },
    { name: 'Pain Editor', cost: 1000, humanityLoss: 14 },
  ],
  CYBEROPTICS: [
    { name: 'Anti-Dazzle', cost: 100, humanityLoss: 0 },
    { name: 'Chyron', cost: 100, humanityLoss: 0 },
    { name: 'Color Shift', cost: 100, humanityLoss: 0 },
    { name: 'Dartgun', cost: 500, humanityLoss: 2 },
    { name: 'Image Enhance', cost: 500, humanityLoss: 0 },
    { name: 'Low Light/IR/UV', cost: 500, humanityLoss: 0 },
    { name: 'MicroOptics', cost: 500, humanityLoss: 0 },
    { name: 'Targeting Scope', cost: 500, humanityLoss: 0 },
    { name: 'TeleOptics', cost: 500, humanityLoss: 0 },
    { name: 'Virtuality', cost: 100, humanityLoss: 0 },
  ],
  CYBERAUDIO: [
    { name: 'Amplified Hearing', cost: 100, humanityLoss: 0 },
    { name: 'Audio Recorder', cost: 100, humanityLoss: 0 },
    { name: 'Bug Detector', cost: 100, humanityLoss: 0 },
    { name: 'Homing Tracer', cost: 100, humanityLoss: 0 },
    { name: 'Internal Agent', cost: 100, humanityLoss: 0 },
    { name: 'Level Damper', cost: 100, humanityLoss: 0 },
    { name: 'Radio Communicator', cost: 100, humanityLoss: 0 },
    { name: 'Radar Detector', cost: 500, humanityLoss: 0 },
    { name: 'Scrambler/Descrambler', cost: 100, humanityLoss: 0 },
    { name: 'Voice Stress Analyzer', cost: 100, humanityLoss: 0 },
  ],
  CYBERARM: [
    { name: 'Big Knucks', cost: 100, humanityLoss: 3 },
    { name: 'Cyberdeck', cost: 500, humanityLoss: 0 },
    { name: 'Grapple Hand', cost: 100, humanityLoss: 3 },
    { name: 'Medscanner', cost: 500, humanityLoss: 0 },
    { name: 'Popup Grenade Launcher', cost: 500, humanityLoss: 7 },
    { name: 'Popup Melee Weapon', cost: 500, humanityLoss: 7 },
    { name: 'Popup Ranged Weapon', cost: 500, humanityLoss: 7 },
    { name: 'Quick Change Mount', cost: 100, humanityLoss: 0 },
    { name: 'Rippers', cost: 500, humanityLoss: 7 },
    { name: 'Scratchers', cost: 100, humanityLoss: 3 },
    { name: 'Shoulder Cam', cost: 500, humanityLoss: 0 },
    { name: 'Slice N Dice', cost: 500, humanityLoss: 7 },
    { name: 'Subdermal Grip', cost: 100, humanityLoss: 3 },
    { name: 'Techscanner', cost: 500, humanityLoss: 0 },
    { name: 'Tool Hand', cost: 100, humanityLoss: 0 },
    { name: 'Wolvers', cost: 500, humanityLoss: 7 },
  ],
  INTERNAL_BODY: [
    { name: 'AudioVox', cost: 500, humanityLoss: 3 },
    { name: 'Contraceptive Implant', cost: 10, humanityLoss: 0 },
    { name: 'Cybersnake', cost: 1000, humanityLoss: 14 },
    { name: 'Gills', cost: 1000, humanityLoss: 7 },
    { name: 'Grafted Muscle and Bone Lace', cost: 1000, humanityLoss: 14 },
    { name: 'Independent Air Supply', cost: 1000, humanityLoss: 2 },
    { name: 'Mr. Studd/Midnight Lady', cost: 100, humanityLoss: 7 },
    { name: 'Nasal Filters', cost: 100, humanityLoss: 0 },
    { name: 'Radar/Sonar Implant', cost: 1000, humanityLoss: 7 },
    { name: 'Toxin Binders', cost: 100, humanityLoss: 0 },
    { name: 'Vampyres', cost: 500, humanityLoss: 14 },
  ],
  EXTERNAL_BODY: [
    { name: 'Hidden Holster', cost: 500, humanityLoss: 0 },
    { name: 'Skin Weave', cost: 500, humanityLoss: 7 },
    { name: 'Subdermal Armor', cost: 1000, humanityLoss: 14 },
    { name: 'Subdermal Pocket', cost: 100, humanityLoss: 3 },
    { name: 'Superchrome Covers', cost: 1000, humanityLoss: 14 },
  ],
  FASHIONWARE: [
    { name: 'Biomonitor', cost: 100, humanityLoss: 0 },
    { name: 'Chemskin', cost: 100, humanityLoss: 0 },
    { name: 'EMP Threading', cost: 10, humanityLoss: 0 },
    { name: 'Light Tattoo', cost: 100, humanityLoss: 0 },
    { name: 'Shift Tacts', cost: 100, humanityLoss: 0 },
    { name: 'Skinwatch', cost: 100, humanityLoss: 0 },
    { name: 'Techhair', cost: 100, humanityLoss: 0 },
  ],
} as const;

// ============================================
// WEAPONS - Common examples
// ============================================

export const WEAPONS = {
  MELEE: [
    { name: 'Light Melee Weapon', damage: '1d6', rof: 2, skill: 'Melee Weapon', concealable: true },
    { name: 'Medium Melee Weapon', damage: '2d6', rof: 2, skill: 'Melee Weapon', concealable: false },
    { name: 'Heavy Melee Weapon', damage: '3d6', rof: 2, skill: 'Melee Weapon', concealable: false, handsRequired: 2 },
    { name: 'Very Heavy Melee Weapon', damage: '4d6', rof: 1, skill: 'Melee Weapon', concealable: false, handsRequired: 2 },
  ],
  RANGED: [
    { name: 'Medium Pistol', damage: '2d6', rof: 2, magazine: 12, skill: 'Handgun', concealable: true },
    { name: 'Heavy Pistol', damage: '3d6', rof: 2, magazine: 8, skill: 'Handgun', concealable: true },
    { name: 'Very Heavy Pistol', damage: '4d6', rof: 1, magazine: 8, skill: 'Handgun', concealable: false },
    { name: 'SMG', damage: '2d6', rof: 1, magazine: 30, skill: 'Autofire', concealable: true },
    { name: 'Heavy SMG', damage: '3d6', rof: 1, magazine: 40, skill: 'Autofire', concealable: false },
    { name: 'Assault Rifle', damage: '5d6', rof: 1, magazine: 25, skill: 'Shoulder Arms', concealable: false, handsRequired: 2 },
    { name: 'Shotgun', damage: '5d6', rof: 1, magazine: 4, skill: 'Shoulder Arms', concealable: false, handsRequired: 2 },
    { name: 'Sniper Rifle', damage: '5d6', rof: 1, magazine: 4, skill: 'Shoulder Arms', concealable: false, handsRequired: 2 },
    { name: 'Bow', damage: '4d6', rof: 1, magazine: 1, skill: 'Archery', concealable: false, handsRequired: 2 },
    { name: 'Crossbow', damage: '4d6', rof: 1, magazine: 1, skill: 'Archery', concealable: false, handsRequired: 2 },
  ],
  EXOTIC: [
    { name: 'Grenade Launcher', damage: '6d6', rof: 1, magazine: 2, skill: 'Heavy Weapons', concealable: false, handsRequired: 2 },
    { name: 'Rocket Launcher', damage: '8d6', rof: 1, magazine: 1, skill: 'Heavy Weapons', concealable: false, handsRequired: 2 },
  ],
} as const;

// ============================================
// ARMOR - Common examples
// ============================================

export const ARMOR = {
  BODY: [
    { name: 'Leathers', stoppingPower: 4, penalty: 0 },
    { name: 'Kevlar', stoppingPower: 7, penalty: 0 },
    { name: 'Light Armorjack', stoppingPower: 11, penalty: 0 },
    { name: 'Medium Armorjack', stoppingPower: 12, penalty: -2 },
    { name: 'Heavy Armorjack', stoppingPower: 13, penalty: -2 },
    { name: 'Flak', stoppingPower: 15, penalty: -4 },
    { name: 'Metalgear', stoppingPower: 18, penalty: -4 },
  ],
  HEAD: [
    { name: 'Helmet (Light)', stoppingPower: 11, penalty: 0 },
    { name: 'Helmet (Heavy)', stoppingPower: 13, penalty: -2 },
    { name: 'Flak Helmet', stoppingPower: 15, penalty: -4 },
    { name: 'Metalgear Helmet', stoppingPower: 18, penalty: -4 },
  ],
  SHIELD: [
    { name: 'Bulletproof Shield', stoppingPower: 10, penalty: 0 },
    { name: 'Corpse Shield', stoppingPower: 20, penalty: -2 },
  ],
} as const;

// ============================================
// STARTING STATS RANGES
// ============================================

export const STAT_LIMITS = {
  MIN: 2,
  MAX: 8,
  TOTAL_POINTS: 62, // For standard character creation
} as const;

export const SKILL_LIMITS = {
  MIN: 0,
  MAX: 10,
  STARTING_POINTS: 86, // For Streetrat template
} as const;

// ============================================
// CULTURAL ORIGINS (Lifepath)
// ============================================

export const CULTURAL_ORIGINS = [
  'North American',
  'South/Central American',
  'Western European',
  'Eastern European',
  'Middle Eastern/North African',
  'Sub-Saharan African',
  'South Asian',
  'Southeast Asian',
  'East Asian',
  'Oceanian/Pacific Islander',
] as const;

export const LANGUAGES_BY_ORIGIN = {
  'North American': ['English', 'Spanish'],
  'South/Central American': ['Spanish', 'Portuguese'],
  'Western European': ['English', 'French', 'German', 'Italian', 'Spanish'],
  'Eastern European': ['Russian', 'Polish', 'Ukrainian'],
  'Middle Eastern/North African': ['Arabic', 'Hebrew', 'Farsi', 'Turkish'],
  'Sub-Saharan African': ['Swahili', 'French', 'Arabic'],
  'South Asian': ['Hindi', 'Urdu', 'Bengali', 'Tamil'],
  'Southeast Asian': ['Vietnamese', 'Thai', 'Filipino', 'Indonesian'],
  'East Asian': ['Chinese', 'Japanese', 'Korean'],
  'Oceanian/Pacific Islander': ['English', 'Tagalog'],
} as const;
