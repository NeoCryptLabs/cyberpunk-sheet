import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CampaignService } from './campaign.service';
import { Campaign, JournalEntry, JournalEntryType } from './entities/campaign.entity';
import {
  CreateCampaignInput,
  UpdateCampaignInput,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
  GenerateInviteCodeInput,
  JoinCampaignInput,
  RemovePlayerInput,
  LinkCharacterInput,
  UnlinkCharacterInput,
} from './dto/campaign.dto';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { Character } from '../character/entities/character.entity';

@Resolver(() => Campaign)
@UseGuards(GqlAuthGuard)
export class CampaignResolver {
  constructor(private campaignService: CampaignService) {}

  @Mutation(() => Campaign)
  async createCampaign(
    @CurrentUser() user: User,
    @Args('input') input: CreateCampaignInput
  ): Promise<Campaign> {
    return this.campaignService.create(user._id, input);
  }

  @Query(() => [Campaign])
  async myCampaigns(@CurrentUser() user: User): Promise<Campaign[]> {
    return this.campaignService.findAllByUser(user._id);
  }

  @Query(() => Campaign)
  async campaign(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string
  ): Promise<Campaign> {
    return this.campaignService.findOne(id, user._id);
  }

  @Mutation(() => Campaign)
  async updateCampaign(
    @CurrentUser() user: User,
    @Args('input') input: UpdateCampaignInput
  ): Promise<Campaign> {
    return this.campaignService.update(user._id, input);
  }

  @Mutation(() => Boolean)
  async deleteCampaign(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string
  ): Promise<boolean> {
    return this.campaignService.delete(id, user._id);
  }

  // Journal Entry mutations
  @Mutation(() => Campaign)
  async addJournalEntry(
    @CurrentUser() user: User,
    @Args('input') input: CreateJournalEntryInput
  ): Promise<Campaign> {
    return this.campaignService.addJournalEntry(user._id, input);
  }

  @Mutation(() => Campaign)
  async updateJournalEntry(
    @CurrentUser() user: User,
    @Args('input') input: UpdateJournalEntryInput
  ): Promise<Campaign> {
    return this.campaignService.updateJournalEntry(user._id, input);
  }

  @Mutation(() => Campaign)
  async deleteJournalEntry(
    @CurrentUser() user: User,
    @Args('campaignId', { type: () => ID }) campaignId: string,
    @Args('entryId', { type: () => ID }) entryId: string
  ): Promise<Campaign> {
    return this.campaignService.deleteJournalEntry(campaignId, entryId, user._id);
  }

  // Journal Entry queries
  @Query(() => [JournalEntry])
  async journalEntriesByType(
    @CurrentUser() user: User,
    @Args('campaignId', { type: () => ID }) campaignId: string,
    @Args('type', { type: () => JournalEntryType }) type: JournalEntryType
  ): Promise<JournalEntry[]> {
    return this.campaignService.getJournalEntriesByType(campaignId, user._id, type);
  }

  @Query(() => [JournalEntry])
  async searchJournalEntries(
    @CurrentUser() user: User,
    @Args('campaignId', { type: () => ID }) campaignId: string,
    @Args('query') query: string
  ): Promise<JournalEntry[]> {
    return this.campaignService.searchJournalEntries(campaignId, user._id, query);
  }

  // ============================================
  // PLAYER MANAGEMENT MUTATIONS
  // ============================================

  @Mutation(() => String, { description: 'Generate an invite code for a campaign (GM only)' })
  async generateInviteCode(
    @CurrentUser() user: User,
    @Args('input') input: GenerateInviteCodeInput,
  ): Promise<string> {
    return this.campaignService.generateInviteCode(input.campaignId, user._id);
  }

  @Mutation(() => Campaign, { description: 'Join a campaign using an invite code' })
  async joinCampaign(
    @CurrentUser() user: User,
    @Args('input') input: JoinCampaignInput,
  ): Promise<Campaign> {
    return this.campaignService.joinCampaign(input.inviteCode, user._id);
  }

  @Mutation(() => Campaign, { description: 'Remove a player from a campaign (GM only)' })
  async removePlayer(
    @CurrentUser() user: User,
    @Args('input') input: RemovePlayerInput,
  ): Promise<Campaign> {
    return this.campaignService.removePlayer(input.campaignId, input.userId, user._id);
  }

  @Mutation(() => Campaign, { description: 'Link a character to a campaign' })
  async linkCharacterToCampaign(
    @CurrentUser() user: User,
    @Args('input') input: LinkCharacterInput,
  ): Promise<Campaign> {
    return this.campaignService.linkCharacter(input.campaignId, input.characterId, user._id);
  }

  @Mutation(() => Campaign, { description: 'Unlink a character from a campaign' })
  async unlinkCharacterFromCampaign(
    @CurrentUser() user: User,
    @Args('input') input: UnlinkCharacterInput,
  ): Promise<Campaign> {
    return this.campaignService.unlinkCharacter(input.campaignId, input.characterId, user._id);
  }

  // ============================================
  // PLAYER MANAGEMENT QUERIES
  // ============================================

  @Query(() => [Character], { description: 'Get all characters linked to a campaign (GM only)' })
  async campaignCharacters(
    @CurrentUser() user: User,
    @Args('campaignId', { type: () => ID }) campaignId: string,
  ): Promise<Character[]> {
    return this.campaignService.getCampaignCharacters(campaignId, user._id);
  }
}
