import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum JournalEntryType {
  SESSION = 'SESSION',
  QUEST = 'QUEST',
  NPC = 'NPC',
  LOCATION = 'LOCATION',
  NOTE = 'NOTE',
  LOOT = 'LOOT',
}

registerEnumType(JournalEntryType, { name: 'JournalEntryType' });

// ============================================
// JOURNAL ENTRY
// ============================================

@ObjectType()
@Schema({ timestamps: true })
export class JournalEntry {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  content: string;

  @Field(() => JournalEntryType)
  @Prop({ required: true, type: String, enum: JournalEntryType })
  type: JournalEntryType;

  @Field(() => [String])
  @Prop({ type: [String], default: [] })
  tags: string[];

  @Field({ nullable: true })
  @Prop()
  imageUrl?: string;

  @Field(() => Int, { nullable: true })
  @Prop()
  sessionNumber?: number;

  @Field({ nullable: true })
  @Prop()
  sessionDate?: Date;

  // For NPCs
  @Field({ nullable: true })
  @Prop()
  npcRole?: string;

  @Field({ nullable: true })
  @Prop()
  npcLocation?: string;

  @Field({ nullable: true })
  @Prop()
  npcAttitude?: string; // Friendly, Neutral, Hostile

  // For Quests
  @Field({ nullable: true })
  @Prop()
  questStatus?: string; // Active, Completed, Failed, Abandoned

  @Field({ nullable: true })
  @Prop()
  questGiver?: string;

  @Field(() => Int, { nullable: true })
  @Prop()
  questReward?: number; // Eurodollars

  // For Locations
  @Field({ nullable: true })
  @Prop()
  district?: string; // Night City district

  @Field({ nullable: true })
  @Prop()
  locationType?: string; // Bar, Clinic, Corporate, etc.

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type JournalEntryDocument = JournalEntry & Document;
export const JournalEntrySchema = SchemaFactory.createForClass(JournalEntry);

// ============================================
// CAMPAIGN
// ============================================

@ObjectType()
@Schema({ timestamps: true })
export class Campaign {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field()
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  gameMasterId: string;

  @Field(() => [String])
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  playerIds: string[];

  @Field(() => [String])
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Character' }], default: [] })
  characterIds: string[];

  @Field(() => [JournalEntry])
  @Prop({ type: [JournalEntrySchema], default: [] })
  journalEntries: JournalEntry[];

  @Field(() => Int)
  @Prop({ default: 0 })
  currentSession: number;

  @Field({ nullable: true })
  @Prop()
  imageUrl?: string;

  @Field()
  @Prop({ default: true })
  isActive: boolean;

  @Field({ nullable: true })
  @Prop()
  inviteCode?: string;

  @Field({ nullable: true })
  @Prop()
  inviteCodeExpiry?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type CampaignDocument = Campaign & Document;
export const CampaignSchema = SchemaFactory.createForClass(Campaign);
