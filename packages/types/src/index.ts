// ============================================
// ENUMS
// ============================================

export enum Role {
  SOLO = 'SOLO',
  NETRUNNER = 'NETRUNNER',
  TECH = 'TECH',
  MEDTECH = 'MEDTECH',
  MEDIA = 'MEDIA',
  EXEC = 'EXEC',
  LAWMAN = 'LAWMAN',
  FIXER = 'FIXER',
  NOMAD = 'NOMAD',
  ROCKERBOY = 'ROCKERBOY',
}

export enum CyberwareType {
  FASHIONWARE = 'FASHIONWARE',
  NEURALWARE = 'NEURALWARE',
  CYBEROPTICS = 'CYBEROPTICS',
  CYBERAUDIO = 'CYBERAUDIO',
  INTERNAL_BODY = 'INTERNAL_BODY',
  EXTERNAL_BODY = 'EXTERNAL_BODY',
  CYBERARM = 'CYBERARM',
  CYBERLEG = 'CYBERLEG',
  BORGWARE = 'BORGWARE',
}

export enum InstallationType {
  MALL = 'MALL',
  CLINIC = 'CLINIC',
  HOSPITAL = 'HOSPITAL',
}

export enum WeaponType {
  MELEE = 'MELEE',
  RANGED = 'RANGED',
  EXOTIC = 'EXOTIC',
}

export enum ArmorType {
  BODY = 'BODY',
  HEAD = 'HEAD',
  SHIELD = 'SHIELD',
}

export enum JournalEntryType {
  SESSION = 'SESSION',
  QUEST = 'QUEST',
  NPC = 'NPC',
  LOCATION = 'LOCATION',
  NOTE = 'NOTE',
  LOOT = 'LOOT',
}

// ============================================
// BASE TYPES
// ============================================

export interface Stats {
  intelligence: number;
  reflexes: number;
  dexterity: number;
  technology: number;
  cool: number;
  willpower: number;
  luck: number;
  move: number;
  body: number;
  empathy: number;
}

export interface Skill {
  name: string;
  linkedStat: string;
  level: number;
  ipSpent?: number;
}

export interface Cyberware {
  name: string;
  type: CyberwareType;
  installation: InstallationType;
  description: string;
  humanityLoss: number;
  cost: number;
  optionSlots?: number;
  foundational?: boolean;
}

export interface Weapon {
  name: string;
  type: WeaponType;
  damage: string;
  rof: number;
  magazine?: number;
  skill?: string;
  handsRequired?: number;
  concealable?: boolean;
}

export interface Armor {
  name: string;
  type: ArmorType;
  stoppingPower: number;
  penalty?: number;
}

export interface InventoryItem {
  name: string;
  description?: string;
  quantity: number;
  cost?: number;
  category?: string;
}

export interface RoleAbility {
  name: string;
  rank: number;
  description?: string;
  specializations?: string[];
}

export interface Lifepath {
  culturalOrigin?: string;
  personality?: string;
  clothingStyle?: string;
  hairstyle?: string;
  valueMost?: string;
  feelingsAboutPeople?: string;
  valuedPerson?: string;
  valuedPossession?: string;
  familyBackground?: string;
  childhoodEnvironment?: string;
  familyCrisis?: string;
  lifeGoals?: string[];
  friends?: string[];
  enemies?: string[];
  romanticInvolvements?: string[];
}

// ============================================
// ENTITIES
// ============================================

export interface User {
  _id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  _id: string;
  userId: string;
  handle: string;
  realName?: string;
  role: Role;
  level: number;
  stats: Stats;
  maxHitPoints: number;
  currentHitPoints: number;
  seriouslyWoundedThreshold: number;
  deathSave: number;
  humanity: number;
  roleAbility: RoleAbility;
  skills: Skill[];
  cyberware: Cyberware[];
  weapons: Weapon[];
  armor: Armor[];
  inventory: InventoryItem[];
  eurodollars: number;
  lifepath?: Lifepath;
  improvementPoints: number;
  currentLuck: number;
  notes?: string;
  portraitUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  type: JournalEntryType;
  tags: string[];
  imageUrl?: string;
  sessionNumber?: number;
  sessionDate?: string;
  npcRole?: string;
  npcLocation?: string;
  npcAttitude?: string;
  questStatus?: string;
  questGiver?: string;
  questReward?: number;
  district?: string;
  locationType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  _id: string;
  name: string;
  description?: string;
  gameMasterId: string;
  playerIds: string[];
  characterIds: string[];
  journalEntries: JournalEntry[];
  currentSession: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// AUTH
// ============================================

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}
