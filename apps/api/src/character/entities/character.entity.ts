import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// ============================================
// ENUMS - Cyberpunk Red Core Data
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

registerEnumType(Role, { name: 'Role' });
registerEnumType(CyberwareType, { name: 'CyberwareType' });
registerEnumType(InstallationType, { name: 'InstallationType' });
registerEnumType(WeaponType, { name: 'WeaponType' });
registerEnumType(ArmorType, { name: 'ArmorType' });

// ============================================
// EMBEDDED TYPES
// ============================================

@ObjectType()
export class Stats {
  @Field(() => Int)
  intelligence: number; // INT - Problem solving, awareness

  @Field(() => Int)
  reflexes: number; // REF - Combat, speed

  @Field(() => Int)
  dexterity: number; // DEX - Fine motor control

  @Field(() => Int)
  technology: number; // TECH - Using/repairing tech

  @Field(() => Int)
  cool: number; // COOL - Willpower, intimidation

  @Field(() => Int)
  willpower: number; // WILL - Resist torture, fear

  @Field(() => Int)
  luck: number; // LUCK - Pool to modify rolls

  @Field(() => Int)
  move: number; // MOVE - Movement speed (m/turn)

  @Field(() => Int)
  body: number; // BODY - Physical strength

  @Field(() => Int)
  empathy: number; // EMP - Social, humanity base
}

@ObjectType()
export class Skill {
  @Field()
  name: string;

  @Field()
  linkedStat: string; // INT, REF, DEX, TECH, COOL, WILL, EMP

  @Field(() => Int)
  level: number; // 0-10

  @Field(() => Int, { nullable: true })
  ipSpent?: number; // Improvement Points spent
}

@ObjectType()
export class Cyberware {
  @Field()
  name: string;

  @Field(() => CyberwareType)
  type: CyberwareType;

  @Field(() => InstallationType)
  installation: InstallationType;

  @Field()
  description: string;

  @Field(() => Int)
  humanityLoss: number;

  @Field(() => Int)
  cost: number; // In Eurodollars

  @Field(() => Int, { nullable: true })
  optionSlots?: number;

  @Field({ nullable: true })
  foundational?: boolean; // Is this foundational cyberware?
}

@ObjectType()
export class Weapon {
  @Field()
  name: string;

  @Field(() => WeaponType)
  type: WeaponType;

  @Field()
  damage: string; // e.g., "2d6", "3d6"

  @Field(() => Int)
  rof: number; // Rate of Fire

  @Field(() => Int, { nullable: true })
  magazine?: number;

  @Field({ nullable: true })
  skill?: string; // Linked skill

  @Field(() => Int, { nullable: true })
  handsRequired?: number;

  @Field({ nullable: true })
  concealable?: boolean;
}

@ObjectType()
export class Armor {
  @Field()
  name: string;

  @Field(() => ArmorType)
  type: ArmorType;

  @Field(() => Int)
  stoppingPower: number; // SP

  @Field(() => Int, { nullable: true })
  penalty?: number; // REF/DEX penalty
}

@ObjectType()
export class InventoryItem {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int, { nullable: true })
  cost?: number;

  @Field({ nullable: true })
  category?: string;
}

@ObjectType()
export class RoleAbility {
  @Field()
  name: string;

  @Field(() => Int)
  rank: number; // 1-10

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  specializations?: string[]; // For Medtech: Surgery, Pharma, Cryo
}

@ObjectType()
export class Lifepath {
  @Field({ nullable: true })
  culturalOrigin?: string;

  @Field({ nullable: true })
  personality?: string;

  @Field({ nullable: true })
  clothingStyle?: string;

  @Field({ nullable: true })
  hairstyle?: string;

  @Field({ nullable: true })
  valueMost?: string;

  @Field({ nullable: true })
  feelingsAboutPeople?: string;

  @Field({ nullable: true })
  valuedPerson?: string;

  @Field({ nullable: true })
  valuedPossession?: string;

  @Field({ nullable: true })
  familyBackground?: string;

  @Field({ nullable: true })
  childhoodEnvironment?: string;

  @Field({ nullable: true })
  familyCrisis?: string;

  @Field(() => [String], { nullable: true })
  lifeGoals?: string[];

  @Field(() => [String], { nullable: true })
  friends?: string[];

  @Field(() => [String], { nullable: true })
  enemies?: string[];

  @Field(() => [String], { nullable: true })
  romanticInvolvements?: string[];
}

// ============================================
// MAIN CHARACTER ENTITY
// ============================================

@ObjectType()
@Schema({ timestamps: true })
export class Character {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  // Basic Info
  @Field()
  @Prop({ required: true })
  handle: string; // Street name

  @Field({ nullable: true })
  @Prop()
  realName?: string;

  @Field(() => Role)
  @Prop({ required: true, type: String, enum: Role })
  role: Role;

  @Field(() => Int)
  @Prop({ default: 1 })
  level: number;

  // Stats
  @Field(() => Stats)
  @Prop({ type: Object, required: true })
  stats: Stats;

  // Derived Stats (stored, calculated on save/update)
  @Field(() => Int)
  @Prop({ default: 0 })
  maxHitPoints: number;

  @Field(() => Int)
  @Prop({ default: 0 })
  currentHitPoints: number;

  @Field(() => Int)
  @Prop({ default: 0 })
  seriouslyWoundedThreshold: number;

  @Field(() => Int)
  @Prop({ default: 0 })
  deathSave: number;

  @Field(() => Int)
  @Prop({ default: 0 })
  humanity: number;

  // Role Ability
  @Field(() => RoleAbility)
  @Prop({ type: Object, required: true })
  roleAbility: RoleAbility;

  // Skills (66 skills in Cyberpunk Red)
  @Field(() => [Skill])
  @Prop({ type: [Object], default: [] })
  skills: Skill[];

  // Gear
  @Field(() => [Cyberware])
  @Prop({ type: [Object], default: [] })
  cyberware: Cyberware[];

  @Field(() => [Weapon])
  @Prop({ type: [Object], default: [] })
  weapons: Weapon[];

  @Field(() => [Armor])
  @Prop({ type: [Object], default: [] })
  armor: Armor[];

  @Field(() => [InventoryItem])
  @Prop({ type: [Object], default: [] })
  inventory: InventoryItem[];

  // Money
  @Field(() => Int)
  @Prop({ default: 0 })
  eurodollars: number;

  // Lifepath
  @Field(() => Lifepath, { nullable: true })
  @Prop({ type: Object })
  lifepath?: Lifepath;

  // Improvement Points
  @Field(() => Int)
  @Prop({ default: 0 })
  improvementPoints: number;

  // Current Luck (can be spent and regenerates)
  @Field(() => Int)
  @Prop({ default: 0 })
  currentLuck: number;

  // Notes
  @Field({ nullable: true })
  @Prop()
  notes?: string;

  // Image
  @Field({ nullable: true })
  @Prop()
  portraitUrl?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type CharacterDocument = Character & Document;
export const CharacterSchema = SchemaFactory.createForClass(Character);
