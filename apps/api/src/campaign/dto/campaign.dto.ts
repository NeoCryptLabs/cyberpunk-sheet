import { InputType, Field, Int, ID, PartialType } from '@nestjs/graphql';
import { IsString, IsEnum, IsInt, Min, IsOptional, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { JournalEntryType } from '../entities/campaign.entity';

@InputType()
export class CreateCampaignInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

@InputType()
export class UpdateCampaignInput extends PartialType(CreateCampaignInput) {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  playerIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  characterIds?: string[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  currentSession?: number;

  @Field({ nullable: true })
  @IsOptional()
  isActive?: boolean;
}

@InputType()
export class CreateJournalEntryInput {
  @Field(() => ID)
  @IsString()
  campaignId: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  content: string;

  @Field(() => JournalEntryType)
  @IsEnum(JournalEntryType)
  type: JournalEntryType;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  // Session fields
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  sessionNumber?: number;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sessionDate?: Date;

  // NPC fields
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  npcRole?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  npcLocation?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  npcAttitude?: string;

  // Quest fields
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  questStatus?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  questGiver?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  questReward?: number;

  // Location fields
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  district?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  locationType?: string;
}

@InputType()
export class UpdateJournalEntryInput extends PartialType(CreateJournalEntryInput) {
  @Field(() => ID)
  @IsString()
  entryId: string;
}

// ============================================
// PLAYER MANAGEMENT DTOs
// ============================================

@InputType()
export class GenerateInviteCodeInput {
  @Field(() => ID)
  @IsString()
  campaignId: string;
}

@InputType()
export class JoinCampaignInput {
  @Field()
  @IsString()
  inviteCode: string;
}

@InputType()
export class RemovePlayerInput {
  @Field(() => ID)
  @IsString()
  campaignId: string;

  @Field(() => ID)
  @IsString()
  userId: string;
}

@InputType()
export class LinkCharacterInput {
  @Field(() => ID)
  @IsString()
  campaignId: string;

  @Field(() => ID)
  @IsString()
  characterId: string;
}

@InputType()
export class UnlinkCharacterInput {
  @Field(() => ID)
  @IsString()
  campaignId: string;

  @Field(() => ID)
  @IsString()
  characterId: string;
}
