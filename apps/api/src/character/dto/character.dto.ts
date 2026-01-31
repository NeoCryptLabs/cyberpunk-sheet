import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsString, IsEnum, IsInt, Min, Max, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { Role, CyberwareType, InstallationType, WeaponType, ArmorType } from '../entities/character.entity';

@InputType()
export class StatsInput {
  @Field(() => Int)
  @IsInt()
  @Min(2)
  @Max(8)
  intelligence: number;

  @Field(() => Int)
  @IsInt()
  @Min(2)
  @Max(8)
  reflexes: number;

  @Field(() => Int)
  @IsInt()
  @Min(2)
  @Max(8)
  dexterity: number;

  @Field(() => Int)
  @IsInt()
  @Min(2)
  @Max(8)
  technology: number;

  @Field(() => Int)
  @IsInt()
  @Min(2)
  @Max(8)
  cool: number;

  @Field(() => Int)
  @IsInt()
  @Min(2)
  @Max(8)
  willpower: number;

  @Field(() => Int)
  @IsInt()
  @Min(2)
  @Max(8)
  luck: number;

  @Field(() => Int)
  @IsInt()
  @Min(2)
  @Max(8)
  move: number;

  @Field(() => Int)
  @IsInt()
  @Min(2)
  @Max(8)
  body: number;

  @Field(() => Int)
  @IsInt()
  @Min(2)
  @Max(8)
  empathy: number;
}

@InputType()
export class SkillInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  linkedStat: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(10)
  level: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  ipSpent?: number;
}

@InputType()
export class CyberwareInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => CyberwareType)
  @IsEnum(CyberwareType)
  type: CyberwareType;

  @Field(() => InstallationType)
  @IsEnum(InstallationType)
  installation: InstallationType;

  @Field()
  @IsString()
  description: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  humanityLoss: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  cost: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  optionSlots?: number;

  @Field({ nullable: true })
  @IsOptional()
  foundational?: boolean;
}

@InputType()
export class WeaponInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => WeaponType)
  @IsEnum(WeaponType)
  type: WeaponType;

  @Field()
  @IsString()
  damage: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  rof: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  magazine?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  skill?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  handsRequired?: number;

  @Field({ nullable: true })
  @IsOptional()
  concealable?: boolean;
}

@InputType()
export class ArmorInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => ArmorType)
  @IsEnum(ArmorType)
  type: ArmorType;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  stoppingPower: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  penalty?: number;
}

@InputType()
export class InventoryItemInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  cost?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;
}

@InputType()
export class RoleAbilityInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(10)
  rank: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  specializations?: string[];
}

@InputType()
export class LifepathInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  culturalOrigin?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  personality?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  clothingStyle?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  hairstyle?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  valueMost?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  feelingsAboutPeople?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  valuedPerson?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  valuedPossession?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  familyBackground?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  childhoodEnvironment?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  familyCrisis?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  lifeGoals?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  friends?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  enemies?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  romanticInvolvements?: string[];
}

@InputType()
export class CreateCharacterInput {
  @Field()
  @IsString()
  handle: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  realName?: string;

  @Field(() => Role)
  @IsEnum(Role)
  role: Role;

  @Field(() => StatsInput)
  @ValidateNested()
  @Type(() => StatsInput)
  stats: StatsInput;

  @Field(() => RoleAbilityInput)
  @ValidateNested()
  @Type(() => RoleAbilityInput)
  roleAbility: RoleAbilityInput;

  @Field(() => [SkillInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillInput)
  skills?: SkillInput[];

  @Field(() => LifepathInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => LifepathInput)
  lifepath?: LifepathInput;

  @Field(() => [CyberwareInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CyberwareInput)
  cyberware?: CyberwareInput[];

  @Field(() => [WeaponInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeaponInput)
  weapons?: WeaponInput[];

  @Field(() => [ArmorInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArmorInput)
  armor?: ArmorInput[];

  @Field(() => [InventoryItemInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryItemInput)
  inventory?: InventoryItemInput[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  eurodollars?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  portraitUrl?: string;
}

@InputType()
export class UpdateCharacterInput extends PartialType(CreateCharacterInput) {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  currentHitPoints?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  currentLuck?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  improvementPoints?: number;
}
